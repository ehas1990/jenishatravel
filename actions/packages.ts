'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";
import { generateSlug } from "@/utils/slug";

export async function getPackages(params: {
  search?: string;
  destinationId?: string;
  status?: string;
  category?: string;
  featured?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const {
    search = "",
    destinationId,
    status,
    category,
    featured,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  const offset = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { duration: { contains: search, mode: "insensitive" } },
    ];
  }

  if (destinationId && destinationId !== "ALL") {
    where.destinationId = destinationId;
  }

  if (status && status !== "ALL") {
    where.status = status as Status;
  }

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (featured === "true") {
    where.featured = true;
  } else if (featured === "false") {
    where.featured = false;
  }

  try {
    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        include: {
          destination: {
            select: { name: true },
          },
        },
      }),
      prisma.package.count({ where }),
    ]);

    return {
      packages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return {
      packages: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      error: "Failed to fetch packages",
    };
  }
}

export async function createPackage(
  adminId: string,
  data: {
    name: string;
    destinationId: string;
    category: string;
    duration: string;
    price: number;
    discountPrice?: number;
    shortDescription: string;
    description: string;
    galleryImages: string[];
    thumbnail: string;
    inclusions: string[];
    exclusions: string[];
    itinerary: any[]; // Array of { day: number, title: string, description: string }
    availableSeats: number;
    featured: boolean;
    status: Status;
  }
) {
  try {
    const slug = generateSlug(data.name);

    // Verify unique slug
    const existing = await prisma.package.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: "A package with this name or slug already exists" };
    }

    const newPkg = await prisma.package.create({
      data: {
        name: data.name,
        slug,
        destinationId: data.destinationId,
        category: data.category,
        duration: data.duration,
        price: data.price,
        discountPrice: data.discountPrice || null,
        shortDescription: data.shortDescription,
        description: data.description,
        galleryImages: data.galleryImages,
        thumbnail: data.thumbnail,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        itinerary: data.itinerary,
        availableSeats: data.availableSeats,
        featured: data.featured,
        status: data.status,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "Create Package",
        details: `Created package ${newPkg.name} under destination ${newPkg.destinationId}`,
      },
    });

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    return { success: true, package: newPkg };
  } catch (error) {
    console.error("Failed to create package:", error);
    return { error: "Failed to create package" };
  }
}

export async function updatePackage(
  adminId: string,
  pkgId: string,
  data: {
    name: string;
    destinationId: string;
    category: string;
    duration: string;
    price: number;
    discountPrice?: number;
    shortDescription: string;
    description: string;
    galleryImages: string[];
    thumbnail: string;
    inclusions: string[];
    exclusions: string[];
    itinerary: any[];
    availableSeats: number;
    featured: boolean;
    status: Status;
  }
) {
  try {
    const slug = generateSlug(data.name);

    // Verify unique slug
    const existing = await prisma.package.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== pkgId) {
      return { error: "A package with this name or slug already exists" };
    }

    const updatedPkg = await prisma.package.update({
      where: { id: pkgId },
      data: {
        name: data.name,
        slug,
        destinationId: data.destinationId,
        category: data.category,
        duration: data.duration,
        price: data.price,
        discountPrice: data.discountPrice || null,
        shortDescription: data.shortDescription,
        description: data.description,
        galleryImages: data.galleryImages,
        thumbnail: data.thumbnail,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        itinerary: data.itinerary,
        availableSeats: data.availableSeats,
        featured: data.featured,
        status: data.status,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "Update Package",
        details: `Updated package ${updatedPkg.name}`,
      },
    });

    revalidatePath("/admin/packages");
    revalidatePath(`/packages/${updatedPkg.slug}`);
    revalidatePath("/packages");
    return { success: true, package: updatedPkg };
  } catch (error) {
    console.error("Failed to update package:", error);
    return { error: "Failed to update package" };
  }
}

export async function deletePackage(adminId: string, pkgId: string) {
  try {
    const deletedPkg = await prisma.package.delete({
      where: { id: pkgId },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "Delete Package",
        details: `Deleted package ${deletedPkg.name}`,
      },
    });

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete package:", error);
    return { error: "Failed to delete package" };
  }
}

// Export packages as CSV
export async function exportPackagesCSV() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        destination: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Package Name",
      "Destination",
      "Category",
      "Duration",
      "Price",
      "Discount Price",
      "Available Seats",
      "Featured",
      "Status",
    ];
    
    const rows = packages.map((pkg) => [
      pkg.id,
      `"${pkg.name.replace(/"/g, '""')}"`,
      `"${pkg.destination.name.replace(/"/g, '""')}"`,
      pkg.category,
      pkg.duration,
      pkg.price,
      pkg.discountPrice || "",
      pkg.availableSeats,
      pkg.featured ? "Yes" : "No",
      pkg.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Failed to export packages CSV:", error);
    return { error: "Failed to export packages to CSV" };
  }
}
