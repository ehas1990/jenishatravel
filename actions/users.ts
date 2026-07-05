'use server';

import { prisma, isDbAvailable } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role, Status } from "@prisma/client";

// Global in-memory cache for offline mode simulation
const globalForOffline = globalThis as unknown as {
  offlineUsers?: any[];
};

if (!globalForOffline.offlineUsers) {
  globalForOffline.offlineUsers = [
    {
      id: "mock-admin-id",
      email: "admin@vista.luxe",
      fullName: "VistaLuxe Admin",
      phone: "+1 (555) 0199",
      role: "ADMIN",
      status: "ACTIVE",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-1",
      email: "staff@vista.luxe",
      fullName: "Jane Staff",
      phone: "+1 (555) 0200",
      role: "STAFF",
      status: "ACTIVE",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}

const offlineUsers = globalForOffline.offlineUsers;

// Get paginated and filtered users list
export async function getUsers(params: {
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<{
  users: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}> {
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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    console.warn("Failed to fetch users from database, using offline fallback:", error instanceof Error ? error.message : error);

    // Simulate query filtering on offlineUsers
    let filtered = [...offlineUsers];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.phone && u.phone.toLowerCase().includes(s))
      );
    }

    if (status && status !== "ALL") {
      filtered = filtered.filter((u) => u.status === status);
    }

    if (role && role !== "ALL") {
      filtered = filtered.filter((u) => u.role === role);
    }

    // Sorting
    filtered.sort((a, b) => {
      const valA = a[sortBy] || "";
      const valB = b[sortBy] || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      users: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
      console.warn("Failed to log activity:", logError instanceof Error ? logError.message : logError);
    }

    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.warn("Failed to create user in DB, using offline fallback:", error instanceof Error ? error.message : error);

    const existingOffline = offlineUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingOffline) {
      return { error: "A user with this email already exists (Offline Mode)" };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      password: data.password || "Password123!",
      role: data.role,
      status: data.status,
      image: data.image || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    offlineUsers.unshift(newUser);

    return { success: true, user: newUser };
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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
      console.warn("Failed to log activity:", logError instanceof Error ? logError.message : logError);
    }

    revalidatePath("/admin/users");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.warn("Failed to update user in DB, using offline fallback:", error instanceof Error ? error.message : error);

    const existingOffline = offlineUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase() && u.id !== userId);
    if (existingOffline) {
      return { error: "A user with this email already exists (Offline Mode)" };
    }

    const index = offlineUsers.findIndex((u) => u.id === userId);
    if (index !== -1) {
      const updatedUser = {
        ...offlineUsers[index],
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || offlineUsers[index].phone,
        role: data.role,
        status: data.status,
        image: data.image !== undefined ? data.image : offlineUsers[index].image,
        updatedAt: new Date(),
      };
      offlineUsers[index] = updatedUser;
      return { success: true, user: updatedUser };
    }

    return { error: "User not found in offline memory" };
  }
}

// Delete User
export async function deleteUser(adminId: string, deleteId: string) {
  if (adminId === deleteId) {
    return { error: "You cannot delete your own account" };
  }

  try {
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
      console.warn("Failed to log activity:", logError instanceof Error ? logError.message : logError);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.warn("Failed to delete user in DB, using offline fallback:", error instanceof Error ? error.message : error);

    const index = offlineUsers.findIndex((u) => u.id === deleteId);
    if (index !== -1) {
      offlineUsers.splice(index, 1);
      return { success: true };
    }

    return { error: "User not found in offline memory" };
  }
}

// Export users as CSV
export async function exportUsersCSV(): Promise<{
  success?: boolean;
  data?: string;
  error?: string;
}> {
  try {
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    console.warn("Failed to export users CSV from database, using offline fallback:", error instanceof Error ? error.message : error);

    const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Status", "Joined Date"];
    const rows = offlineUsers.map((user) => [
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
  }
}
