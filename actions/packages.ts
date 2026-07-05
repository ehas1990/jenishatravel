'use server';

import { prisma, isDbAvailable } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";
import { generateSlug } from "@/utils/slug";

// Global in-memory cache for offline mode simulation
const globalForOffline = globalThis as unknown as {
  offlinePackages?: any[];
};

if (!globalForOffline.offlinePackages) {
  globalForOffline.offlinePackages = [
    {
      id: "pkg-1",
      name: "Kerala Premium Tea & Houseboat Escape",
      slug: "kerala-tea-houseboat-escape",
      destinationId: "dest-1",
      category: "NATURE",
      duration: "6 Days / 5 Nights",
      price: 2400,
      discountPrice: 2150,
      shortDescription: "A curated journey through Munnar tea plantations and Alleppey backwaters.",
      description: "Witness the incredible green landscape of Munnar tea hills and enjoy the calm waters of Alleppey from a private luxury floating villa (houseboat). A dedicated travel concierge accompanies you throughout.",
      galleryImages: [
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800"
      ],
      thumbnail: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800",
      inclusions: [
        "3 Nights in Luxury Munnar Tea Estates",
        "2 Nights in Alleppey Luxury Houseboat",
        "Daily organic gourmet meals",
        "Private luxury vehicle with driver"
      ],
      exclusions: [
        "Flights to/from Cochin Airport",
        "Personal travel insurance"
      ],
      itinerary: [
        { day: 1, title: "Arrival in Cochin", description: "Arrive at Cochin Airport and drive to Munnar." },
        { day: 2, title: "Munnar Tea Walk", description: "Stroll through Munnar tea plantations." }
      ],
      availableSeats: 12,
      featured: true,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      destination: { name: "Munnar & Alleppey, Kerala" }
    },
    {
      id: "pkg-2",
      name: "Kashmir Luxury Shikara & Snowy Peaks",
      slug: "kashmir-shikara-snowy-peaks",
      destinationId: "dest-2",
      category: "ADVENTURE",
      duration: "5 Days / 4 Nights",
      price: 3200,
      discountPrice: 2950,
      shortDescription: "An Alpine excursion showcasing Dal Lake houseboats and Gulmarg gondolas.",
      description: "Glide on Dal Lake in a luxury shikara, stay in premium wooden houseboats, and view snow-covered Himalayan peaks, pine forests, and tulip gardens.",
      galleryImages: [
        "https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800"
      ],
      thumbnail: "https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800",
      inclusions: [
        "2 Nights in Dal Lake Luxury Houseboat",
        "2 Nights in Gulmarg Luxury Resort",
        "Private Shikara tour on Dal Lake",
        "All meals included"
      ],
      exclusions: [
        "Flights to Srinagar",
        "Tipping and shopping"
      ],
      itinerary: [
        { day: 1, title: "Srinagar Arrival", description: "Board your luxury houseboat." }
      ],
      availableSeats: 8,
      featured: true,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      destination: { name: "Dal Lake & Gulmarg, Kashmir" }
    }
  ];
}

const offlinePackages = globalForOffline.offlinePackages;

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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
      error: undefined as string | undefined
    };
  } catch (error) {
    console.warn("Failed to fetch packages from database, using offline fallback:", error instanceof Error ? error.message : error);

    // Offline filter simulation
    let filtered = [...offlinePackages];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.duration.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (destinationId && destinationId !== "ALL") {
      filtered = filtered.filter((p) => p.destinationId === destinationId);
    }

    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (category && category !== "ALL") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured === true);
    } else if (featured === "false") {
      filtered = filtered.filter((p) => p.featured === false);
    }

    // Sorting simulation
    filtered.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      packages: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      error: (error instanceof Error ? error.message : "Failed to fetch packages") as string | undefined
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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    console.warn("Failed to create package in DB, using offline fallback:", error instanceof Error ? error.message : error);

    // Find if destination exists in offline destinations to populate destination name
    let destinationName = "Unknown Destination";
    try {
      const { getDestinations } = require("./destinations");
      const destsRes = await getDestinations({ limit: 100 });
      const dest = destsRes.destinations.find((d: any) => d.id === data.destinationId);
      if (dest) destinationName = dest.name;
    } catch (_) {}

    const slug = generateSlug(data.name);
    const newPkg = {
      id: "pkg-" + Date.now(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      destination: { name: destinationName }
    };

    offlinePackages.unshift(newPkg);
    return { success: true, package: newPkg };
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
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    console.warn("Failed to update package in DB, using offline fallback:", error instanceof Error ? error.message : error);

    const index = offlinePackages.findIndex((p) => p.id === pkgId);
    if (index !== -1) {
      let destinationName = offlinePackages[index].destination?.name || "Unknown Destination";
      try {
        const { getDestinations } = require("./destinations");
        const destsRes = await getDestinations({ limit: 100 });
        const dest = destsRes.destinations.find((d: any) => d.id === data.destinationId);
        if (dest) destinationName = dest.name;
      } catch (_) {}

      const slug = generateSlug(data.name);
      const updated = {
        ...offlinePackages[index],
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
        updatedAt: new Date(),
        destination: { name: destinationName }
      };

      offlinePackages[index] = updated;
      return { success: true, package: updated };
    }
    return { error: "Package not found in offline memory" };
  }
}

export async function deletePackage(adminId: string, pkgId: string) {
  try {
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    console.warn("Failed to delete package in DB, using offline fallback:", error instanceof Error ? error.message : error);
    const index = offlinePackages.findIndex((p) => p.id === pkgId);
    if (index !== -1) {
      offlinePackages.splice(index, 1);
      return { success: true };
    }
    return { error: "Package not found in offline memory" };
  }
}

// Export packages as CSV
export async function exportPackagesCSV() {
  try {
    if (!(await isDbAvailable())) {
      throw new Error("Database connection is offline");
    }
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
    return { success: true, data: csvContent, error: undefined as string | undefined };
  } catch (error) {
    console.warn("Failed to export packages CSV from DB, using offline fallback:", error instanceof Error ? error.message : error);

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

    const rows = offlinePackages.map((pkg) => [
      pkg.id,
      `"${pkg.name.replace(/"/g, '""')}"`,
      `"${(pkg.destination?.name || "").replace(/"/g, '""')}"`,
      pkg.category,
      pkg.duration,
      pkg.price,
      pkg.discountPrice || "",
      pkg.availableSeats,
      pkg.featured ? "Yes" : "No",
      pkg.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, data: csvContent, error: undefined as string | undefined };
  }
}
