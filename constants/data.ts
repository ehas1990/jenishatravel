import { TravelPackage, Destination, Testimonial, Blog, FAQItem } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    title: 'Munnar & Alleppey, Kerala',
    slug: 'kerala',
    image: '/kerala.jpg',
    description: 'Explore misty mountains and lush tea plantations in Munnar, and float on the serene Alleppey backwaters in a premium luxury houseboat.',
    country: 'India',
    featured: true,
    popular: true,
    attractionsCount: 15,
    activities: ['Houseboat Stay', 'Tea Estate Walk', 'Spices Plantation Tour', 'Kathakali Show'],
    faqs: [
      { question: 'What is the best season to visit Kerala?', answer: 'The winter months from October to March are ideal with cool, pleasant weather. Monsoons (June to September) are popular for ayurvedic wellness retreats.' },
      { question: 'What is a Kettuvallam?', answer: 'It is a traditional Kerala houseboat, historically used for grain transport and now redesigned as a luxury floating villa.' }
    ]
  },
  {
    id: 'dest-2',
    title: 'Madurai & Ooty, Tamil Nadu',
    slug: 'tamil-nadu',
    image: '/tamilnadu.jpg',
    description: 'Marvel at the ancient architecture of Meenakshi Temple in Madurai and enjoy the cool tea estates and Nilgiri toy train ride in Ooty.',
    country: 'India',
    featured: true,
    popular: true,
    attractionsCount: 18,
    activities: ['Temple Architecture Tour', 'Heritage Rail Ride', 'Waterfalls Trekking', 'Tea Tasting'],
    faqs: [
      { question: 'How do I ride the Nilgiri Mountain Railway?', answer: 'It runs from Mettupalayam to Ooty. Booking tickets in advance via the Indian Railways website is highly recommended as it is a UNESCO World Heritage site.' }
    ]
  },
  {
    id: 'dest-3',
    title: 'Dal Lake & Gulmarg, Kashmir',
    slug: 'kashmir',
    image: '/kashmir.jpg',
    description: 'Glide on Dal Lake in a luxury shikara, stay in premium wooden houseboats, and view snow-covered Himalayan peaks, pine forests, and vibrant tulip gardens.',
    country: 'India',
    featured: true,
    popular: true,
    attractionsCount: 20,
    activities: ['Shikara Ride', 'Houseboat Stay', 'Gulmarg Gondola Ride', 'Tulip Garden Visit'],
    faqs: [
      { question: 'When does the Tulip Festival take place?', answer: 'The Indira Gandhi Memorial Tulip Garden in Srinagar opens to the public during April, showcasing millions of blooming tulips.' }
    ]
  },
  {
    id: 'dest-4',
    title: 'Bali, Indonesia',
    slug: 'bali-indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800',
    description: 'Find peace and adventure in the Island of the Gods. Explore lush rice terraces, ancient sea temples, volcanic hikes, and world-class surfing beaches.',
    country: 'Indonesia',
    featured: false,
    popular: true,
    attractionsCount: 30,
    activities: ['Surfing', 'Yoga & Wellness', 'Rice Terrace Hikes', 'Temple Blessings'],
    faqs: [
      { question: 'Do I need a visa for Bali?', answer: 'Many nationalities can obtain a Visa on Arrival (VoA) valid for 30 days, which can be extended once.' }
    ]
  },
  {
    id: 'dest-5',
    title: 'Swiss Alps, Switzerland',
    slug: 'swiss-alps',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
    description: 'Savor breathtaking Alpine heights, pristine glacier lakes, luxury ski chalets, and scenic cogwheel train journeys through snow-capped valleys.',
    country: 'Switzerland',
    featured: true,
    popular: false,
    attractionsCount: 15,
    activities: ['Alpine Skiing', 'Panoramic Train Ride', 'Paragliding', 'Chocolate Tasting'],
    faqs: [
      { question: 'What is the Swiss Travel Pass?', answer: 'It is an all-in-one ticket that gives visitors unlimited access to the Swiss Travel System (trains, buses, and boats).' }
    ]
  },
  {
    id: 'dest-6',
    title: 'Paris, France',
    slug: 'paris-france',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    description: 'The global capital of art, fashion, gastronomy, and culture. Stroll down broad avenues, admire world-famous museums, and dine on fine French cuisine.',
    country: 'France',
    featured: false,
    popular: true,
    attractionsCount: 25,
    activities: ['Museum Visits', 'Seine River Cruise', 'Gourmet Cooking Class', 'Fashion Walk'],
    faqs: [
      { question: 'Is the Louvre closed on certain days?', answer: 'Yes, the Louvre Museum is closed every Tuesday, and booking a time slot in advance is highly recommended.' }
    ]
  }
];

export const PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-1',
    title: 'Kerala Premium Tea & Houseboat Escape',
    slug: 'kerala-tea-houseboat-escape',
    description: 'A curated journey through Munnar tea plantations, misty mountains, and a private luxury houseboat stay in Alleppey backwaters.',
    price: 2400,
    discountPrice: 2150,
    rating: 4.9,
    reviewsCount: 42,
    duration: '6 Days / 5 Nights',
    location: 'Munnar & Alleppey',
    country: 'India',
    category: 'nature',
    featured: true,
    images: [
      '/kerala.jpg',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800'
    ],
    overview: 'Witness the incredible green landscape of Munnar tea hills and enjoy the calm waters of Alleppey from a private luxury floating villa (houseboat). A dedicated travel concierge accompanies you throughout.',
    included: [
      '3 Nights in Luxury Munnar Tea Estates, 2 Nights in Alleppey Luxury Houseboat',
      'Daily organic gourmet meals',
      'Private luxury vehicle with professional driver',
      'All sightseeing and entry tickets',
      'Guided spice estate walking tour'
    ],
    excluded: [
      'Flights to/from Cochin Airport',
      'Personal travel insurance',
      'Tipping and personal shopping'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Cochin & Munnar Transfer', description: 'Arrive at Cochin Airport. Meet your luxury vehicle driver and travel to Munnar, checking in to a premium tea estate chalet.', activities: ['Airport pickup', 'Scenic drive', 'Chalet check-in'] },
      { day: 2, title: 'Munnar Tea Estates Walk', description: 'Stroll through Munnar tea plantations in the misty morning. Visit the tea museum and enjoy a private tea tasting session.', activities: ['Tea estate walk', 'Tea museum', 'Tea tasting'] },
      { day: 3, title: 'Misty Mountains & Waterfalls', description: 'Explore local valleys, waterfalls, and viewpoints. Enjoy a sunset picnic overlooking the tea fields.', activities: ['Sightseeing tour', 'Waterfalls trek', 'Sunset picnic'] },
      { day: 4, title: 'Alleppey Luxury Houseboat Check-in', description: 'Travel to Alleppey. Board your private luxury houseboat with a personal chef and navigator. Glide through calm backwaters.', activities: ['Alleppey transfer', 'Houseboat boarding', 'Backwater cruise'] },
      { day: 5, title: 'Local Village & Backwaters Explore', description: 'Canoe through smaller canals, visit a local village, and savor a traditional Kerala banana-leaf meal prepared by your chef.', activities: ['Canal canoeing', 'Village walk', 'Traditional feast'] },
      { day: 6, title: 'Departure via Cochin', description: 'Enjoy your final morning on the houseboat. Take a private transfer back to Cochin Airport for departure.', activities: ['Check-out', 'Transfer to Cochin'] }
    ],
    hotel: {
      name: 'Windermere Estate Munnar',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
      description: 'A luxurious retreat set inside a working cardamom and tea plantation, featuring wooden bungalows, mountain vistas, and farm-to-table dining.',
      amenities: ['Tea Plantation Views', 'Infinity Pool', 'Ayurvedic Spa treatments', 'Organic Garden', 'Free Wi-Fi']
    }
  },
  {
    id: 'pkg-2',
    title: 'Tamil Nadu Heritage Temples & Ooty Hill Rail',
    slug: 'tamilnadu-heritage-toy-train',
    description: 'A historical trip around the majestic Meenakshi Temple in Madurai and the beautiful Nilgiri toy train ride through Ooty tea estates.',
    price: 2800,
    rating: 4.8,
    reviewsCount: 36,
    duration: '7 Days / 6 Nights',
    location: 'Madurai & Ooty',
    country: 'India',
    category: 'cultural',
    featured: true,
    images: [
      '/tamilnadu.jpg',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800',
      'https://images.unsplash.com/photo-1626509653066-bd97e3f89e24?q=80&w=800'
    ],
    overview: 'Experience ancient South Indian heritage and mountain charm. Tour Madurai’s towering temples and board the UNESCO heritage Nilgiri toy train to Ooty for stunning green landscapes and cool waterfall vistas.',
    included: [
      '3 Nights in Madurai Heritage Hotel, 3 Nights in Ooty Luxury Lodge',
      'First Class Toy Train tickets',
      'Private guide for temple tours',
      'Daily buffet breakfasts and heritage dinners',
      'Luxury chauffeured transport'
    ],
    excluded: [
      'Flights to Madurai / from Coimbatore',
      'Travel insurance',
      'Camera entry fees at temple sites'
    ],
    itinerary: [
      { day: 1, title: 'Welcome to Madurai', description: 'Arrive in Madurai. Check in to your luxury heritage palace hotel. Enjoy a evening temple tour.', activities: ['Airport pickup', 'Hotel check-in', 'Evening temple walk'] },
      { day: 2, title: 'Meenakshi Temple Architecture', description: 'A detailed guided tour of Meenakshi Amman Temple, exploring the thousand-pillar hall and ancient gopurams.', activities: ['Meenakshi Temple tour', 'Thousand pillar hall'] },
      { day: 3, title: 'Toy Train to Ooty', description: 'Travel to Mettupalayam. Board the Nilgiri Mountain Toy Train winding through tunnels and forests to Ooty.', activities: ['Toy train ride', 'Ooty check-in'] },
      { day: 4, title: 'Ooty Tea Estates & Botanical Gardens', description: 'Visit local tea estates and the beautiful Botanical Gardens. Savor local tea and chocolates.', activities: ['Tea estate tour', 'Botanical gardens', 'Local chocolate tasting'] },
      { day: 5, title: 'Pykara Waterfalls & Lake Ride', description: 'Explore Pykara waterfalls and take a private boat ride on Pykara Lake. Enjoy the mountain wilderness.', activities: ['Waterfalls hike', 'Boating', 'Nature picnic'] },
      { day: 6, title: 'Nilgiri Vista Trek', description: 'Take a soft morning trek to Doddabetta Peak. Spend the afternoon relaxing at the luxury spa.', activities: ['Peak trek', 'Spa relaxation', 'Farewell dinner'] },
      { day: 7, title: 'Departure', description: 'Private transfer to Coimbatore Airport for your return flight.', activities: ['Check-out', 'Transfer to airport'] }
    ],
    hotel: {
      name: 'Savoy - IHCL SeleQtions Ooty',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
      description: 'A 19th-century colonial cottage retreat in Ooty, featuring manicured gardens, fireplaces in every room, and premium English high-tea services.',
      amenities: ['Colonial Fireplaces', 'English Gardens', 'Ayurvedic Wellness Spa', 'Billiards Room', 'High-Tea Lounge']
    }
  },
  {
    id: 'pkg-3',
    title: 'Kashmir Luxury Shikara & Snowy Peaks Adventure',
    slug: 'kashmir-shikara-snowy-peaks',
    description: 'A breathtaking Alpine excursion showcasing Dal Lake houseboats, private Gulmarg gondolas, and custom treks through pine valleys.',
    price: 3200,
    discountPrice: 2950,
    rating: 4.9,
    reviewsCount: 50,
    duration: '6 Days / 5 Nights',
    location: 'Srinagar & Gulmarg',
    country: 'India',
    category: 'adventure',
    featured: true,
    images: [
      '/kashmir.jpg',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800'
    ],
    overview: 'Enter a paradise of snowy mountain backdrops and serene lakes. Stay in a hand-carved luxury cedar houseboat on Dal Lake, ride the Gulmarg gondola (one of the highest in the world), and walk in the beautiful Tulip Gardens.',
    included: [
      '2 Nights in Luxury Dal Lake Houseboat, 3 Nights in Gulmarg Alpine Resort',
      'Gulmarg Gondola tickets (Phase 1 & 2)',
      'Private Shikara boat rides',
      'All local ground logistics via 4x4 private transport',
      'Daily Kashmiri breakfast and dinners'
    ],
    excluded: [
      'Flights to/from Srinagar Airport',
      'Ski gear rentals in Gulmarg',
      'Tipping and personal shopping'
    ],
    itinerary: [
      { day: 1, title: 'Dal Lake Houseboat Welcome', description: 'Arrive in Srinagar. Take a private shikara ride to your luxury wooden houseboat on Dal Lake.', activities: ['Srinagar pickup', 'Shikara ride', 'Houseboat check-in'] },
      { day: 2, title: 'Mughal Gardens & Tulip Walk', description: 'Tour the historical Mughal Gardens (Shalimar & Nishat) and Srinagar’s expansive Tulip Garden in the afternoon.', activities: ['Mughal Gardens tour', 'Tulip Garden walk'] },
      { day: 3, title: 'Gulmarg Gondola Mountain Ride', description: 'Travel to Gulmarg. Board the gondola to Apharwat Peak for spectacular snow views and skiing options.', activities: ['Gulmarg transfer', 'Gondola ride', 'Snow activities'] },
      { day: 4, title: 'Pine Valleys & Meadow Treks', description: 'Guided hike through the pine-forested meadows of Gulmarg, followed by a cozy evening fire setup.', activities: ['Pine forest hike', 'Meadow walk', 'Bonfire night'] },
      { day: 5, title: 'Srinagar Old Town & Shopping', description: 'Return to Srinagar. Stroll through the heritage wooden architecture of the Old Town and shop for local pashmina shawls.', activities: ['Old town tour', 'Heritage walk', 'Pashmina shopping'] },
      { day: 6, title: 'Departure', description: 'Enjoy breakfast on Dal Lake, followed by a private transfer to Srinagar Airport for departure.', activities: ['Check-out', 'Airport transfer'] }
    ],
    hotel: {
      name: 'The Khyber Himalayan Resort Gulmarg',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800',
      description: 'A 5-star ski resort nestled in the Pir Panjal range, offering pine forest views, heated indoor pools, and proximity to the Gulmarg Gondola.',
      amenities: ['Heated Indoor Pool', 'Himalayan View Spa', 'Ski Concierge', 'Multiple Restaurants', 'Cozy Fireplaces']
    }
  },
  {
    id: 'pkg-4',
    title: 'Rajasthan Royal Palaces & Desert Luxury',
    slug: 'rajasthan-royal-palaces-desert',
    description: 'A majestic journey across Jaipur’s pink palaces, Udaipur’s floating lake castles, and private tented safaris in Jaisalmer.',
    price: 3500,
    rating: 4.8,
    reviewsCount: 28,
    duration: '8 Days / 7 Nights',
    location: 'Jaipur, Udaipur & Jaisalmer',
    country: 'India',
    category: 'luxury',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800'
    ],
    overview: 'Live like royalty. Stay in authentic palace hotels, explore massive hilltop forts in Jaipur, take a private boat cruise on Lake Pichola in Udaipur, and experience a luxury desert camp in Jaisalmer.',
    included: [
      '7 Nights in 5-Star Palace Hotels and Luxury Desert Camps',
      'Daily royal buffet breakfasts',
      'All fort entries and local heritage guides',
      'Private sunset boat cruise on Lake Pichola',
      'Chauffeured luxury SUV transport'
    ],
    excluded: [
      'Flights to Jaipur / from Udaipur',
      'Travel insurance',
      'Personal guide tips'
    ],
    itinerary: [
      { day: 1, title: 'Pink City Welcome', description: 'Arrive in Jaipur. Check in to your luxury palace hotel. Relax and enjoy a traditional Rajasthani welcome.', activities: ['Jaipur pickup', 'Palace check-in', 'Heritage welcome'] },
      { day: 2, title: 'Amber Fort & City Palace', description: 'Explore the grand Amber Fort, Hawa Mahal (Palace of Winds), and the City Palace Museum with your guide.', activities: ['Amber Fort tour', 'Hawa Mahal view', 'City Palace visit'] },
      { day: 3, title: 'Desert Camp Jaisalmer', description: 'Travel to the desert city of Jaisalmer. Check in to a premium tented camp in the Sam Sand Dunes.', activities: ['Jaisalmer transfer', 'Desert camp check-in'] },
      { day: 4, title: 'Camel Safari & Folk Performance', description: 'Enjoy a sunset camel safari across the sand dunes. Experience local Rajasthani folk dance and music with dinner.', activities: ['Camel safari', 'Sunset dunes', 'Folk dance show'] },
      { day: 5, title: 'Lake City Udaipur', description: 'Travel to Udaipur, the Venice of the East. Check in to your palace hotel situated in the middle of Lake Pichola.', activities: ['Udaipur transfer', 'Lake palace check-in'] },
      { day: 6, title: 'Lake Pichola Cruise & City Palace', description: 'Visit Udaipur’s City Palace. In the evening, take a private boat cruise on Lake Pichola around Jag Mandir.', activities: ['City Palace tour', 'Lake Pichola cruise', 'Sunset dinner'] },
      { day: 7, title: 'Arts & Crafts Village', description: 'Explore Shilpgram heritage crafts village. Savor a final royal feast tonight.', activities: ['Crafts village walk', 'Royal dinner'] },
      { day: 8, title: 'Departure', description: 'Private transfer to Udaipur Airport for departure.', activities: ['Check-out', 'Airport transfer'] }
    ],
    hotel: {
      name: 'Taj Lake Palace Udaipur',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800',
      description: 'An iconic white-marble palace floating on the waters of Lake Pichola, offering heritage rooms, royal butler services, and private sunset boat rides.',
      amenities: ['Floating Pool', 'Jiva Spa boat', 'Heritage Courtyards', 'Royal Butler Service', 'Fine Dining']
    }
  },
  {
    id: 'pkg-5',
    title: 'Ultimate Goa Yacht & Beach Retreat',
    slug: 'goa-yacht-beach-retreat',
    description: 'Rejuvenate at South Goa’s luxury wellness villas, charter private catamaran yachts, and explore historic Portuguese quarters.',
    price: 2100,
    rating: 4.7,
    reviewsCount: 22,
    duration: '5 Days / 4 Nights',
    location: 'North & South Goa',
    country: 'India',
    category: 'luxury',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'
    ],
    overview: 'Relax on quiet white-sand beaches. This package features stays in South Goa’s premier boutique villas, a private 4-hour luxury yacht charter on the Arabian Sea, and private dining with local Goan chefs.',
    included: [
      '4 Nights in Luxury Beachfront Pool Villas in South Goa',
      '4-Hour Private Luxury Yacht Charter with drinks and appetizers',
      'Daily beachfront buffet breakfasts',
      'Private walking tour of historic Fontainhas Portuguese quarter',
      'Airport luxury car transfers'
    ],
    excluded: [
      'Flights to/from Mopa Airport Goa',
      'Personal water sports fees (optional)',
      'Tipping and shopping'
    ],
    itinerary: [
      { day: 1, title: 'Goan Villa Check-in', description: 'Arrive in Goa. Take a private luxury car transfer to your South Goa pool villa resort. Spend a quiet sunset on the beach.', activities: ['Airport pickup', 'Resort check-in', 'Beach sunset'] },
      { day: 2, title: 'Private Catamaran Yacht Charter', description: 'Board your private catamaran yacht. Cruise along the coast, look for dolphins, swim in quiet bays, and enjoy local appetizers.', activities: ['Yacht cruise', 'Dolphin spotting', 'Snorkeling'] },
      { day: 3, title: 'Fontainhas Portuguese Heritage', description: 'Take a private guided walk through Fontainhas, Old Goa’s historic Portuguese quarter, featuring colorful houses and ancient churches.', activities: ['Old Goa tour', 'Fontainhas walk', 'Heritage lunch'] },
      { day: 4, title: 'Spice Plantation & Spa Session', description: 'Visit a local organic spice plantation for a traditional lunch, followed by a relaxing 90-minute Ayurvedic spa massage back at the resort.', activities: ['Spice farm tour', 'Traditional lunch', '90-min spa massage'] },
      { day: 5, title: 'Departure', description: 'Enjoy your final beachfront breakfast and a private transfer back to Mopa Airport for departure.', activities: ['Check-out', 'Airport transfer'] }
    ],
    hotel: {
      name: 'The Leela Goa',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
      description: 'A luxury beachfront resort set on 75 acres of luxury gardens and lagoons in South Goa, offering private beach access, a 12-hole golf course, and premier villas.',
      amenities: ['Private Beach Access', 'Lagoons & Pools', '12-Hole Golf Course', 'Luxury Spa', 'Seafood Restaurant']
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    role: 'Luxury Traveler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    rating: 5,
    text: 'Our trip to Kyoto with this agency was absolutely flawless. The ryokan recommendation, the private tea ceremony, and the absolute professionalism of our guide made it an unforgettable cultural immersion.',
    location: 'New York, USA'
  },
  {
    id: 't-2',
    name: 'Marcus Vance',
    role: 'Adventure Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    rating: 5,
    text: 'Visiting Iceland was a dream. The Super-Jeep tours, the ice caves, and the hotel set in the volcanic fields exceeded all expectations. Extremely organized and very premium!',
    location: 'London, UK'
  },
  {
    id: 't-3',
    name: 'Elena Rostova',
    role: 'Fashion Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    rating: 4.8,
    text: 'The Amalfi Coast yacht tour was breathtaking. Excellent 5-star hotels and wonderful local culinary recommendations. I will definitely book all my upcoming summer escapes here.',
    location: 'Milan, Italy'
  }
];

export const BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'The Art of Ryokan: What to Expect in a Luxury Japanese Inn',
    slug: 'art-of-ryokan-luxury-japanese-inn',
    category: 'Culture',
    excerpt: 'Step inside the serene world of Japanese Ryokans. Discover the etiquette of hot springs, traditional futons, and seasonal Kaiseki dining.',
    content: '<p>A Ryokan is not simply a place to sleep; it is an immersive window into Japanese tradition, hospitality, and aesthetics. Originating in the Edo period, these traditional inns have preserved a way of living that prioritizes mindfulness, natural harmony, and meticulous service.</p><h3>The Welcome Ritual</h3><p>Upon arriving, you will be asked to remove your shoes at the entrance and slip into indoor slippers. A hostess (nakai-san) will lead you to your room, which is lined with fragrant tatami straw mats and features low wooden tables and shoji paper screens. You will be served matcha green tea and local wagashi sweets.</p><h3>Yukata & Onsen Bathing</h3><p>You will find a yukata (light cotton kimono) in your room. Guests wear these to the hot spring baths (onsen), around the ryokan, and even during dinner. Onsen bathing is a highly ritualized process: you must wash thoroughly at the shower stations before entering the mineral-rich geothermal pools. It is a deeply meditative experience meant to cleanse the body and spirit.</p><h3>The Kaikesi Dining Experience</h3><p>The pinnacle of a ryokan stay is Kaiseki-ryori—a multi-course dinner that showcases seasonal, local ingredients. Each dish is a miniature work of art, served on carefully selected ceramics and lacquerware. Courses include sashimi, grilled fish, simmered seasonal vegetables, tempura, and local wagyu beef cooked at your table. It is a slow, sensory journey through Japan’s micro-seasons.</p>',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    author: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      role: 'Cultural Historian'
    },
    date: 'June 15, 2026',
    readTime: '5 min read',
    tags: ['Japan', 'Luxury Ryokan', 'Travel Guide', 'Gastronomy']
  },
  {
    id: 'blog-2',
    title: 'Chasing the Aurora: A Guide to Iceland’s Northern Lights',
    slug: 'chasing-aurora-guide-iceland-northern-lights',
    category: 'Adventure',
    excerpt: 'Maximize your chances of witnessing the stunning Aurora Borealis. Learn about solar activity, weather forecasting, and camera settings.',
    content: '<p>Few natural phenomena capture the human imagination quite like the Northern Lights (Aurora Borealis). Watching green, pink, and violet ribbons dance across a pitch-black Arctic sky is a bucket-list experience for travelers worldwide.</p><h3>What Causes the Lights?</h3><p>The science is as fascinating as the display. Auroras occur when charged particles ejected from the sun (solar wind) collide with gaseous particles in Earth’s magnetic field. This collision releases energy in the form of glowing light, with different gases creating different colors (oxygen produces pale green and pink; nitrogen yields blue and purple).</p><h3>How to Maximize Your Viewing Chances</h3><ul><li><strong>Go in the Right Season:</strong> The lights require dark skies. In Iceland, this means visiting between September and mid-April.</li><li><strong>Monitor Solar and Cloud Forecasts:</strong> Use the Icelandic Meteorological Office website to check cloud coverage and the KP-index (solar activity indicator scaled from 0 to 9). A KP-index of 3 or higher is excellent.</li><li><strong>Escape Light Pollution:</strong> While strong auroras can be seen from Reykjavík, driving 30-40 minutes into the wilderness makes the colors dramatically brighter.</li></ul><h3>Photographing the Aurora</h3><p>Smartphones have gotten better, but a camera with manual controls is best. Use a sturdy tripod, set your lens to manual focus at infinity, select a wide aperture (f/2.8 or lower), raise your ISO to 1600-3200, and set a shutter speed between 3 to 10 seconds.</p>',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800',
    author: {
      name: 'Freja Lind',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      role: 'Landscape Photographer'
    },
    date: 'May 28, 2026',
    readTime: '6 min read',
    tags: ['Iceland', 'Northern Lights', 'Astrophotography', 'Winter Travel']
  },
  {
    id: 'blog-3',
    title: 'Top 5 Secrets to Exploring the Amalfi Coast Like a Local',
    slug: 'secrets-exploring-amalfi-coast-like-local',
    category: 'Luxury Travel',
    excerpt: 'Avoid the heavy crowds and discover hidden beaches, authentic cliffside restaurants, and scenic walking trails off the beaten path.',
    content: '<p>The Amalfi Coast is legendary for its beauty, but it can also be crowded and overwhelming during peak summer months. To experience its true Italian charm (the "Dolce Vita"), you need to know how to navigate the region like a local.</p><h3>1. Travel in the Shoulder Season</h3><p>July and August see packed buses, bumper-to-bumper coastal traffic, and high hotel rates. Instead, visit in May or October. The weather is still warm enough for swimming, the lemon trees are full, and you can stroll Positano without pushing through tour groups.</p><h3>2. Choose Ferries Over Buses</h3><p>The winding coastal highway (Amalfi Drive) is notorious for traffic jams. Ferries are not only faster and more reliable, but they also offer spectacular, panoramic views of the coastal cliffs and colorful vertical towns from the water.</p><h3>3. Discover Ravello’s Quiet Heights</h3><p>While Positano and Amalfi grab the spotlight, Ravello sits high up in the mountains. It is a quiet sanctuary of elegant stone villas, historic classical music gardens, and some of the most panoramic views of the entire Salerno Gulf.</p>',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800',
    author: {
      name: 'Giovanni Rossi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
      role: 'Local Destination Expert'
    },
    date: 'April 10, 2026',
    readTime: '4 min read',
    tags: ['Italy', 'Amalfi Coast', 'Summer Travel', 'Insider Tips']
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is included in the tour package price?',
    answer: 'Our premium packages generally include all 4-star and 5-star accommodations, daily breakfasts, select fine-dining meals, all local private transfers with dedicated drivers, guided excursions, and entry tickets. Please check the "Included" list on each package details page for exact inclusions.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Can I customize an existing package itinerary?',
    answer: 'Absolutely. We specialize in bespoke luxury travel. Any of our published itineraries can be custom-tailored to adjust durations, swap hotels, add private boat charters, or include specific experiences. Speak with our travel designers to build your custom trip.',
    category: 'booking'
  },
  {
    id: 'faq-3',
    question: 'What is your cancellation and booking policy?',
    answer: 'Bookings require a 30% deposit at the time of confirmation. The remaining balance is due 45 days prior to departure. Cancellations made more than 60 days before the trip receive a full refund minus a 5% admin fee. Cancellations between 30-59 days receive a 50% refund, and cancellations under 30 days are non-refundable.',
    category: 'booking'
  },
  {
    id: 'faq-4',
    question: 'Is international travel insurance required?',
    answer: 'We highly recommend purchasing comprehensive travel insurance that covers trip cancellation, medical emergencies, evacuation, and baggage loss. While not strictly mandatory for booking, it provides peace of mind for unexpected circumstances.',
    category: 'travel'
  },
  {
    id: 'faq-5',
    question: 'How do you process payments, and is it secure?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and bank wire transfers. All online transactions are processed securely using 256-bit SSL encryption. We never store card details on our servers.',
    category: 'payment'
  }
];
