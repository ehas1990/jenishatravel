'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";
import { generateSlug } from "@/utils/slug";

// Global in-memory cache for offline mode simulation
const globalForOffline = globalThis as unknown as {
  offlineDestinations?: any[];
};

if (!globalForOffline.offlineDestinations) {
  globalForOffline.offlineDestinations = [
    {
      id: "dest-1",
      name: "Munnar & Alleppey, Kerala",
      slug: "kerala",
      country: "India",
      state: "Kerala",
      shortDescription: "Explore misty mountains and lush tea plantations in Munnar.",
      description: "Explore misty mountains and lush tea plantations in Munnar, and float on the serene Alleppey backwaters in a premium luxury houseboat.",
      bannerImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200",
      galleryImages: [
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800"
      ],
      popularPlaces: ["Windermere Estate", "Mattupetty Dam", "Alleppey Backwaters"],
      bestTimeToVisit: "October to March",
      mapUrl: "https://maps.google.com",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { packages: 1 }
    },
    {
      id: "dest-2",
      name: "Dal Lake & Gulmarg, Kashmir",
      slug: "kashmir",
      country: "India",
      state: "Jammu & Kashmir",
      shortDescription: "Glide on Dal Lake in a luxury shikara and stay in houseboats.",
      description: "Glide on Dal Lake in a luxury shikara, stay in premium wooden houseboats, and view snow-covered Himalayan peaks, pine forests, and tulip gardens.",
      bannerImage: "https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=1200",
      galleryImages: [
        "https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800"
      ],
      popularPlaces: ["Dal Lake", "Gulmarg Gondola", "Tulip Garden"],
      bestTimeToVisit: "March to October",
      mapUrl: "https://maps.google.com",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { packages: 1 }
    },
    {
      id: "dest-3",
      name: "Jaipur & Udaipur, Rajasthan",
      slug: "rajasthan",
      country: "India",
      state: "Rajasthan",
      shortDescription: "Live like royalty in palace hotels and explore hilltop forts.",
      description: "Live like royalty. Stay in authentic palace hotels, explore massive hilltop forts in Jaipur, take a private boat cruise on Lake Pichola in Udaipur.",
      bannerImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200",
      galleryImages: [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800"
      ],
      popularPlaces: ["Amber Fort", "City Palace Udaipur", "Lake Pichola"],
      bestTimeToVisit: "November to February",
      mapUrl: "https://maps.google.com",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { packages: 0 }
    }
  ];
}

const offlineDestinations = globalForOffline.offlineDestinations;

export async function getDestinations(params: {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const {
    search = "",
    status,
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
      { country: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as Status;
  }

  try {
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: { packages: true },
          },
        },
      }),
      prisma.destination.count({ where }),
    ]);

    return {
      destinations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      error: undefined as string | undefined
    };
  } catch (error: any) {
    console.error("Failed to fetch destinations from database, using offline fallback:", error);

    // Offline filter simulation
    let filtered = [...offlineDestinations];
    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.country.toLowerCase().includes(search.toLowerCase()) ||
          (d.state && d.state.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (status && status !== "ALL") {
      filtered = filtered.filter((d) => d.status === status);
    }

    // Sorting simulation
    filtered.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' 
        ? (valA > valB ? 1 : -1) 
        : (valA < valB ? 1 : -1);
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      destinations: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      error: undefined as string | undefined
    };
  }
}

export async function createDestination(
  adminId: string,
  data: {
    name: string;
    country: string;
    state?: string;
    shortDescription: string;
    description: string;
    bannerImage: string;
    galleryImages: string[];
    popularPlaces: string[];
    bestTimeToVisit: string;
    mapUrl?: string;
    status: Status;
  }
) {
  const slug = generateSlug(data.name);

  try {
    // Verify unique slug
    const existing = await prisma.destination.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: "A destination with this name or slug already exists" };
    }

    const newDest = await prisma.destination.create({
      data: {
        name: data.name,
        slug,
        country: data.country,
        state: data.state || null,
        shortDescription: data.shortDescription,
        description: data.description,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages,
        popularPlaces: data.popularPlaces,
        bestTimeToVisit: data.bestTimeToVisit,
        mapUrl: data.mapUrl || null,
        status: data.status,
      },
    });

    // Log Activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: adminId,
          action: "Create Destination",
          details: `Created destination ${newDest.name} (${newDest.country})`,
        },
      });
    } catch (_) {}

    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true, destination: newDest };
  } catch (error: any) {
    console.error("Failed to create destination in DB, using offline fallback:", error);

    const existingOffline = offlineDestinations.find((d) => d.slug === slug);
    if (existingOffline) {
      return { error: "A destination with this name or slug already exists (Offline Mode)" };
    }

    const newDest = {
      id: `dest-${Date.now()}`,
      name: data.name,
      slug,
      country: data.country,
      state: data.state || null,
      shortDescription: data.shortDescription,
      description: data.description,
      bannerImage: data.bannerImage,
      galleryImages: data.galleryImages,
      popularPlaces: data.popularPlaces,
      bestTimeToVisit: data.bestTimeToVisit,
      mapUrl: data.mapUrl || null,
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { packages: 0 }
    };

    offlineDestinations.unshift(newDest);

    return { success: true, destination: newDest };
  }
}

export async function updateDestination(
  adminId: string,
  destId: string,
  data: {
    name: string;
    country: string;
    state?: string;
    shortDescription: string;
    description: string;
    bannerImage: string;
    galleryImages: string[];
    popularPlaces: string[];
    bestTimeToVisit: string;
    mapUrl?: string;
    status: Status;
  }
) {
  const slug = generateSlug(data.name);

  try {
    // Verify unique slug
    const existing = await prisma.destination.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== destId) {
      return { error: "A destination with this name/slug already exists" };
    }

    const updatedDest = await prisma.destination.update({
      where: { id: destId },
      data: {
        name: data.name,
        slug,
        country: data.country,
        state: data.state || null,
        shortDescription: data.shortDescription,
        description: data.description,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages,
        popularPlaces: data.popularPlaces,
        bestTimeToVisit: data.bestTimeToVisit,
        mapUrl: data.mapUrl || null,
        status: data.status,
      },
    });

    // Log Activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: adminId,
          action: "Update Destination",
          details: `Updated destination ${updatedDest.name}`,
        },
      });
    } catch (_) {}

    revalidatePath("/admin/destinations");
    revalidatePath(`/destinations/${updatedDest.slug}`);
    revalidatePath("/destinations");
    return { success: true, destination: updatedDest };
  } catch (error) {
    console.error("Failed to update destination in DB, using offline fallback:", error);

    const existingOffline = offlineDestinations.find((d) => d.slug === slug && d.id !== destId);
    if (existingOffline) {
      return { error: "Another destination with this name/slug already exists (Offline Mode)" };
    }

    const index = offlineDestinations.findIndex((d) => d.id === destId);
    if (index !== -1) {
      const current = offlineDestinations[index];
      const updated = {
        ...current,
        name: data.name,
        slug,
        country: data.country,
        state: data.state || null,
        shortDescription: data.shortDescription,
        description: data.description,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages,
        popularPlaces: data.popularPlaces,
        bestTimeToVisit: data.bestTimeToVisit,
        mapUrl: data.mapUrl || null,
        status: data.status,
        updatedAt: new Date(),
      };
      offlineDestinations[index] = updated;
      return { success: true, destination: updated };
    }

    return { error: "Destination not found in offline memory" };
  }
}

export async function deleteDestination(adminId: string, destId: string) {
  try {
    const deletedDest = await prisma.destination.delete({
      where: { id: destId },
    });

    // Log Activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: adminId,
          action: "Delete Destination",
          details: `Deleted destination ${deletedDest.name}`,
        },
      });
    } catch (_) {}

    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete destination in DB, using offline fallback:", error);

    const index = offlineDestinations.findIndex((d) => d.id === destId);
    if (index !== -1) {
      offlineDestinations.splice(index, 1);
      return { success: true };
    }

    return { error: "Destination not found in offline memory" };
  }
}

// Fetch all active destinations for select dropdowns
export async function getActiveDestinationsDropdown() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, destinations };
  } catch (error) {
    console.error("Failed to fetch destinations dropdown, using offline fallback:", error);
    const destinations = offlineDestinations
      .filter(d => d.status === "ACTIVE")
      .map(d => ({ id: d.id, name: d.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { success: true, destinations };
  }
}
