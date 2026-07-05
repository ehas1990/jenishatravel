'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role, Status } from "@prisma/client";

// Get paginated and filtered users list
export async function getUsers(params: {
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const {
    search = "",
    status,
    role,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  const offset = (page - 1) * limit;

  // Build where query
  const where: any = {};
  
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as Status;
  }

  if (role && role !== "ALL") {
    where.role = role as Role;
  }

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { users: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }, error: "Failed to fetch users" };
  }
}

// Create a new User
export async function createUser(
  adminId: string,
  data: {
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
    role: Role;
    status: Status;
    image?: string;
  }
) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { error: "A user with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password || "Password123!", 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
        status: data.status,
        image: data.image,
      },
    });

    // Log Activity
    try {
      const adminExists = adminId ? await prisma.user.findUnique({
        where: { id: adminId },
        select: { id: true },
      }) : null;

      await prisma.activityLog.create({
        data: {
          userId: adminExists ? adminId : null,
          action: "Create User",
          details: `Created user ${newUser.email} with role ${newUser.role}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user" };
  }
}

// Update User details
export async function updateUser(
  adminId: string,
  userId: string,
  data: {
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
    role: Role;
    status: Status;
    image?: string;
  }
) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing && existing.id !== userId) {
      return { error: "A user with this email already exists" };
    }

    const updateData: any = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
    };

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Log Activity
    try {
      const adminExists = adminId ? await prisma.user.findUnique({
        where: { id: adminId },
        select: { id: true },
      }) : null;

      await prisma.activityLog.create({
        data: {
          userId: adminExists ? adminId : null,
          action: "Update User",
          details: `Updated user profile for ${updatedUser.email}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    revalidatePath("/admin/users");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
}

// Delete User
export async function deleteUser(adminId: string, deleteId: string) {
  if (adminId === deleteId) {
    return { error: "You cannot delete your own account" };
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: deleteId },
    });

    // Log Activity
    try {
      const adminExists = adminId ? await prisma.user.findUnique({
        where: { id: adminId },
        select: { id: true },
      }) : null;

      await prisma.activityLog.create({
        data: {
          userId: adminExists ? adminId : null,
          action: "Delete User",
          details: `Deleted user ${deletedUser.email}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}

// Export users as CSV
export async function exportUsersCSV() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Status", "Joined Date"];
    const rows = users.map((user) => [
      user.id,
      `"${user.fullName.replace(/"/g, '""')}"`,
      user.email,
      user.phone || "",
      user.role,
      user.status,
      user.createdAt.toISOString().split("T")[0],
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Failed to export users CSV:", error);
    return { error: "Failed to export users to CSV" };
  }
}
