// Global Types for Tour & Travel Website

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface HotelInfo {
  name: string;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
}

export interface TravelPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  duration: string; // e.g. "7 Days / 6 Nights"
  location: string;
  country: string;
  category: 'luxury' | 'adventure' | 'cultural' | 'honeymoon' | 'nature' | 'family';
  featured: boolean;
  images: string[];
  overview: string;
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  hotel: HotelInfo;
}

export interface Destination {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  country: string;
  featured: boolean;
  popular: boolean;
  attractionsCount: number;
  activities: string[];
  faqs?: { question: string; answer: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  location: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'travel';
}

export interface BookingDetails {
  packageId: string;
  packageName: string;
  price: number;
  travelersCount: number;
  travelDate: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  couponCode?: string;
  discount: number;
  totalPrice: number;
}
