'use server';

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "true";

  if (!email || !password) {
    return { error: "Please enter both email and password" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please try again." };
        default:
          return { error: "An authentication error occurred. Please try again." };
      }
    }
    // Handle database or custom authorize errors
    const errorMessage = (error as Error).message;
    if (errorMessage && errorMessage.includes("USER_INACTIVE")) {
      return { error: "Your account is currently inactive. Please contact an admin." };
    }
    return { error: "Invalid email or password." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function forgotPasswordAction(email: string) {
  if (!email) return { error: "Email is required" };

  try {
    // Check if user or admin exists
    const user = await prisma.user.findUnique({ where: { email } });
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!user && !admin) {
      // For security, don't disclose if the email exists or not
      return { success: true, message: "If the email is registered, you will receive a reset link." };
    }

    // In a real application, you would generate a token and send a real email.
    // For this dashboard, we will log it and return success.
    console.log(`Password reset requested for: ${email}`);

    // Create an activity log if it is a registered User
    if (user) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "Password Reset Request",
          details: `Requested reset link for ${email}`,
        }
      });
    }

    return { success: true, message: "Password reset link sent! Check your inbox." };
  } catch (error) {
    return { error: "Failed to process request. Please try again." };
  }
}

export async function resetPasswordAction(token: string, password: string) {
  if (!token || !password) return { error: "Token and password are required" };

  try {
    // Mimicking token validation
    // In production, decode JWT reset token, find user, update password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // For demo/seeding purposes, we'll reset the default admin or standard user
    const defaultUser = await prisma.user.findFirst({
      where: { email: "admin@vista.luxe" }
    });

    if (defaultUser) {
      await prisma.user.update({
        where: { id: defaultUser.id },
        data: { password: hashedPassword }
      });
      return { success: true, message: "Password reset successful! You can now log in." };
    }
    
    return { error: "Invalid reset token." };
  } catch (error) {
    return { error: "Failed to reset password." };
  }
}

export async function changePasswordAction(userId: string, oldPassword: string, newPassword: string) {
  if (!userId || !oldPassword || !newPassword) {
    return { error: "All fields are required" };
  }

  try {
    // Check standard User
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) return { error: "Incorrect current password" };

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "Change Password",
          details: "User changed password successfully",
        }
      });

      return { success: true, message: "Password updated successfully!" };
    }

    // Check Admin table
    const admin = await prisma.admin.findUnique({ where: { id: userId } });
    if (admin) {
      const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      if (!isPasswordValid) return { error: "Incorrect current password" };

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.admin.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return { success: true, message: "Admin password updated successfully!" };
    }

    return { error: "User not found" };
  } catch (error) {
    return { error: "Failed to change password." };
  }
}
