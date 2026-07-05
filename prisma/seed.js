const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin User
  const adminEmail = 'admin@vista.luxe';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'VistaLuxe Admin',
        phone: '+1 (555) 0199',
        role: 'ADMIN',
        status: 'ACTIVE',
        image: null
      }
    });
    console.log('Created default admin:', admin.email);
  } else {
    console.log('Admin already exists.');
  }

  // 2. Initial Destinations
  const destinationsData = [
    {
      name: 'Munnar & Alleppey, Kerala',
      slug: 'kerala',
      country: 'India',
      state: 'Kerala',
      shortDescription: 'Explore misty mountains and lush tea plantations in Munnar.',
      description: 'Explore misty mountains and lush tea plantations in Munnar, and float on the serene Alleppey backwaters in a premium luxury houseboat.',
      bannerImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800'
      ],
      popularPlaces: ['Windermere Estate', 'Mattupetty Dam', 'Alleppey Backwaters'],
      bestTimeToVisit: 'October to March',
      mapUrl: 'https://maps.google.com',
      status: 'ACTIVE'
    },
    {
      name: 'Dal Lake & Gulmarg, Kashmir',
      slug: 'kashmir',
      country: 'India',
      state: 'Jammu & Kashmir',
      shortDescription: 'Glide on Dal Lake in a luxury shikara and stay in houseboats.',
      description: 'Glide on Dal Lake in a luxury shikara, stay in premium wooden houseboats, and view snow-covered Himalayan peaks, pine forests, and tulip gardens.',
      bannerImage: 'https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800'
      ],
      popularPlaces: ['Dal Lake', 'Gulmarg Gondola', 'Tulip Garden'],
      bestTimeToVisit: 'March to October',
      mapUrl: 'https://maps.google.com',
      status: 'ACTIVE'
    },
    {
      name: 'Jaipur & Udaipur, Rajasthan',
      slug: 'rajasthan',
      country: 'India',
      state: 'Rajasthan',
      shortDescription: 'Live like royalty in palace hotels and explore hilltop forts.',
      description: 'Live like royalty. Stay in authentic palace hotels, explore massive hilltop forts in Jaipur, take a private boat cruise on Lake Pichola in Udaipur.',
      bannerImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800'
      ],
      popularPlaces: ['Amber Fort', 'City Palace Udaipur', 'Lake Pichola'],
      bestTimeToVisit: 'November to February',
      mapUrl: 'https://maps.google.com',
      status: 'ACTIVE'
    }
  ];

  console.log('Seeding destinations...');
  const seededDestinations = [];
  for (const dest of destinationsData) {
    const createdDest = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest
    });
    seededDestinations.push(createdDest);
    console.log(`- Seeded destination: ${createdDest.name}`);
  }

  // 3. Initial Packages
  const packagesData = [
    {
      name: 'Kerala Premium Tea & Houseboat Escape',
      slug: 'kerala-tea-houseboat-escape',
      destinationId: seededDestinations[0].id,
      category: 'nature',
      duration: '6 Days / 5 Nights',
      price: 2400.0,
      discountPrice: 2150.0,
      shortDescription: 'A curated journey through Munnar tea plantations and Alleppey houseboat.',
      description: 'Witness the incredible green landscape of Munnar tea hills and enjoy the calm waters of Alleppey from a private luxury floating villa (houseboat). A dedicated travel concierge accompanies you throughout.',
      galleryImages: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800',
      inclusions: [
        '3 Nights in Luxury Munnar Tea Estates, 2 Nights in Houseboat',
        'Daily organic gourmet meals',
        'Private luxury vehicle with driver',
        'Guided spice estate walking tour'
      ],
      exclusions: [
        'Flights to/from Cochin Airport',
        'Personal travel insurance',
        'Tipping and personal shopping'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Cochin & Munnar Transfer', description: 'Arrive at Cochin Airport. Meet your driver and travel to Munnar, checking in to a premium tea estate chalet.' },
        { day: 2, title: 'Munnar Tea Estates Walk', description: 'Stroll through Munnar tea plantations in the misty morning and enjoy a private tea tasting session.' },
        { day: 3, title: 'Alleppey Luxury Houseboat Check-in', description: 'Travel to Alleppey. Board your private luxury houseboat with a personal chef.' }
      ],
      availableSeats: 12,
      featured: true,
      status: 'ACTIVE'
    },
    {
      name: 'Kashmir Shikara & Himalayan Splendor',
      slug: 'kashmir-shikara-splendor',
      destinationId: seededDestinations[1].id,
      category: 'luxury',
      duration: '5 Days / 4 Nights',
      price: 3100.0,
      discountPrice: 2800.0,
      shortDescription: 'Glide on Dal Lake in a shikara and ride the Gulmarg Gondola.',
      description: 'Enjoy a luxurious shikara ride on Dal Lake, stay in a premium houseboat, and experience the highest cable car in Gulmarg.',
      galleryImages: [
        'https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1596895567557-9a593a1a3fb9?q=80&w=800',
      inclusions: [
        '2 Nights in Luxury Srinagar Houseboat, 2 Nights in Gulmarg Resort',
        'Daily breakfast and dinner',
        'Gulmarg Gondola phase 1 and 2 tickets',
        'Private airport transfers'
      ],
      exclusions: [
        'Flights to/from Srinagar',
        'Lunch and personal items'
      ],
      itinerary: [
        { day: 1, title: 'Srinagar Arrival & Shikara Cruise', description: 'Arrive in Srinagar, transfer to a premium houseboat, and take a sunset shikara ride on Dal Lake.' },
        { day: 2, title: 'Gulmarg Gondola Ride', description: 'Travel to Gulmarg and ride the famous Gondola cable car to Apharwat Peak.' }
      ],
      availableSeats: 8,
      featured: true,
      status: 'ACTIVE'
    }
  ];

  console.log('Seeding packages...');
  for (const pkg of packagesData) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg
    });
    console.log(`- Seeded package: ${pkg.name}`);
  }

  // 4. Default Settings
  const settingsData = [
    { key: 'websiteName', value: 'VistaLuxe Travel' },
    { key: 'footerDetails', value: '© 2026 VistaLuxe Travel. All Rights Reserved. Curated Luxury Journeys.' },
    { key: 'socialLinks', value: JSON.stringify({ instagram: 'https://instagram.com', facebook: 'https://facebook.com', twitter: 'https://twitter.com' }) }
  ];

  console.log('Seeding settings...');
  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
