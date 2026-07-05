'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const dbSettings = await prisma.setting.findMany();
    
    // Convert array of settings to key-value object
    const settingsObj: Record<string, string> = {
      websiteName: "VistaLuxe Travel",
      logoUrl: "",
      footerDetails: "© 2026 VistaLuxe Travel. All Rights Reserved. Curated Luxury Journeys.",
      socialInstagram: "https://instagram.com",
      socialFacebook: "https://facebook.com",
      socialTwitter: "https://twitter.com",
    };

    dbSettings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return { settings: settingsObj };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return { settings: {}, error: "Failed to load settings" };
  }
}

export async function updateSettings(
  adminId: string,
  settings: {
    websiteName: string;
    logoUrl?: string;
    footerDetails: string;
    socialInstagram?: string;
    socialFacebook?: string;
    socialTwitter?: string;
  }
) {
  try {
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      if (value === undefined) return Promise.resolve();
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(updatePromises);

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "Update Settings",
        details: "Updated global website configurations",
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { error: "Failed to update settings" };
  }
}

// Action to update administrator's credentials (email / full name)
export async function updateAdminProfile(
  adminId: string,
  data: {
    fullName: string;
    email: string;
  }
) {
  try {
    // Check standard User table (since roles are integrated here too)
    const user = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (user) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailConflict && emailConflict.id !== adminId) {
        return { error: "Email is already taken by another user" };
      }

      await prisma.user.update({
        where: { id: adminId },
        data: {
          fullName: data.fullName,
          email: data.email,
        },
      });

      return { success: true, message: "Profile updated successfully!" };
    }

    // Check Admin table
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (admin) {
      const emailConflict = await prisma.admin.findUnique({
        where: { email: data.email },
      });

      if (emailConflict && emailConflict.id !== adminId) {
        return { error: "Email is already taken by another admin" };
      }

      await prisma.admin.update({
        where: { id: adminId },
        data: {
          fullName: data.fullName,
          email: data.email,
        },
      });

      return { success: true, message: "Admin profile updated successfully!" };
    }

    return { error: "User not found" };
  } catch (error) {
    console.error("Failed to update admin profile:", error);
    return { error: "Failed to update profile settings" };
  }
}
