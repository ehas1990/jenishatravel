'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Star, CheckCircle, XCircle, Info, Landmark, Hotel, Map, ArrowRight } from 'lucide-react';
import { PACKAGES } from '@/constants/data';
import { formatPrice } from '@/lib/utils';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import PackageCard from '@/components/packages/PackageCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PackageDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const pkg = PACKAGES.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'hotel' | 'map'>('overview');
  const [activeImage, setActiveImage] = useState(pkg.images[0]);

  // Map day-wise itinerary into Accordion structure
  const itineraryItems = pkg.itinerary.map((day) => ({
    id: day.day,
    title: `Day ${day.day}: ${day.title}`,
    content: (
      <div className="space-y-4 font-normal">
        <p className="leading-relaxed text-paragraph">{day.description}</p>
        <div className="flex flex-wrap gap-2">
          {day.activities.map((act, i) => (
            <span key={i} className="inline-flex items-center text-caption text-primary bg-teal-50 px-3 py-1 rounded-full font-semibold">
              {act}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  const hasDiscount = !!pkg.discountPrice;
  const displayPrice = hasDiscount ? pkg.discountPrice! : pkg.price;

  // Get related tours (excluding current package, matching country or category)
  const relatedTours = PACKAGES.filter((p) => p.id !== pkg.id && (p.country === pkg.country || p.category === pkg.category)).slice(0, 2);

  // Dynamic JSON-LD structured data for SEO indexing
  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'Trip',
    'name': pkg.title,
    'description': pkg.description,
    'image': pkg.images,
    'provider': {
      '@type': 'TravelAgency',
      'name': 'VistaLuxe Travel',
      'url': 'https://vistaluxe-travel.com',
      'telephone': '+1-800-555-0199',
      'priceRange': '$$$$',
    },
    'offers': {
      '@type': 'Offer',
      'price': displayPrice,
      'priceCurrency': 'USD',
      'category': pkg.category,
      'availability': 'https://schema.org/InStock',
    },
    'itinerary': pkg.itinerary.map((day) => ({
      '@type': 'Day',
      'position': day.day,
      'name': day.title,
      'description': day.description,
    })),
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-light-gray/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Packages', href: '/packages' },
          { label: pkg.title }
        ]} 
      />

      <Container className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Gallery & Details Tabs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title Block */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={pkg.category === 'luxury' ? 'secondary' : 'primary'}>{pkg.category}</Badge>
                <span className="text-caption text-paragraph flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{pkg.location}</span>
                </span>
              </div>
              <h1 className="text-section-title font-extrabold text-heading tracking-tight leading-tight">
                {pkg.title}
              </h1>
            </div>

            {/* Gallery Layout */}
            <div className="space-y-4">
              <div className="h-[400px] md:h-[480px] w-full rounded-card overflow-hidden border border-border shadow-soft">
                <img
                  src={activeImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex gap-4">
                {pkg.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-28 h-20 rounded-btn overflow-hidden border-2 cursor-pointer transition-all ${activeImage === img ? 'border-primary scale-95 shadow-soft' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${pkg.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="border-b border-border flex space-x-6 overflow-x-auto scrollbar-none">
              {(['overview', 'itinerary', 'hotel', 'map'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-heading font-semibold text-small pb-3 border-b-2 capitalize transition-all cursor-pointer ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-paragraph hover:text-heading'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content Panels */}
            <div className="bg-white rounded-card border border-border/50 p-6 md:p-8 shadow-soft">
              {activeTab === 'overview' && (
                <div className="space-y-8 font-normal">
                  {/* Overview Text */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-[22px] text-heading flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      <span>Tour Overview</span>
                    </h3>
                    <p className="text-body text-paragraph leading-relaxed">{pkg.overview}</p>
                  </div>

                  {/* Included / Excluded splits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                    <div className="space-y-4">
                      <h4 className="font-heading font-bold text-[18px] text-heading flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span>What's Included</span>
                      </h4>
                      <ul className="space-y-3">
                        {pkg.included.map((inc, i) => (
                          <li key={i} className="text-small text-paragraph flex items-start space-x-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-heading font-bold text-[18px] text-heading flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-danger" />
                        <span>What's Excluded</span>
                      </h4>
                      <ul className="space-y-3">
                        {pkg.excluded.map((exc, i) => (
                          <li key={i} className="text-small text-paragraph flex items-start space-x-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  <h3 className="font-heading font-bold text-[22px] text-heading flex items-center gap-2 mb-6">
                    <Landmark className="w-5 h-5 text-primary" />
                    <span>Day-by-Day Schedule</span>
                  </h3>
                  <Accordion items={itineraryItems} defaultOpenId={1} />
                </div>
              )}

              {activeTab === 'hotel' && (
                <div className="space-y-6 font-normal">
                  <h3 className="font-heading font-bold text-[22px] text-heading flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-primary" />
                    <span>Featured Luxury Lodging</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
                    <div className="md:col-span-5 h-56 rounded-card overflow-hidden border border-border shadow-soft">
                      <img src={pkg.hotel.image} alt={pkg.hotel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="md:col-span-7 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.floor(pkg.hotel.rating) }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                          ))}
                        </div>
                        <h4 className="font-heading font-bold text-[20px] text-heading">{pkg.hotel.name}</h4>
                      </div>
                      <p className="text-small text-paragraph leading-relaxed">{pkg.hotel.description}</p>
                      
                      <div className="space-y-2">
                        <span className="text-[12px] font-bold text-heading uppercase tracking-wider">Amenities Included:</span>
                        <div className="flex flex-wrap gap-2">
                          {pkg.hotel.amenities.map((am, i) => (
                            <Badge key={i} variant="neutral" className="px-3.5 py-1 text-slate-600 bg-slate-50 border border-slate-100">{am}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-6">
                  <h3 className="font-heading font-bold text-[22px] text-heading flex items-center gap-2">
                    <Map className="w-5 h-5 text-primary" />
                    <span>Bespoke Logistics Route</span>
                  </h3>
                  <div className="aspect-[16/9] bg-slate-900 rounded-card border border-border relative overflow-hidden flex items-center justify-center text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')] bg-cover opacity-20 bg-center" />
                    <div className="relative z-10 text-center space-y-4 max-w-sm p-6">
                      <MapPin className="w-10 h-10 text-secondary mx-auto animate-bounce" />
                      <h4 className="font-heading font-bold text-[20px]">Route Visualizer</h4>
                      <p className="text-caption text-slate-300 font-normal leading-relaxed">
                        Our private travel mapping tracks transfers across {pkg.location}. Custom itineraries include coordinates of landing pads and ports.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-border rounded-card p-6 md:p-8 shadow-medium space-y-6">
              
              {/* Rating and Duration */}
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="text-small font-bold text-heading">{pkg.rating}</span>
                  <span className="text-[13px] text-paragraph">({pkg.reviewsCount} reviews)</span>
                </div>
                <Badge variant="primary" className="px-3.5 py-1 text-xs">{pkg.duration.split(' / ')[0]}</Badge>
              </div>

              {/* Price Details */}
              <div className="space-y-1">
                <span className="text-caption text-paragraph font-medium uppercase tracking-wider">Price per traveler</span>
                <div className="flex items-baseline space-x-2">
                  {hasDiscount && (
                    <span className="text-body text-paragraph line-through">
                      {formatPrice(pkg.price)}
                    </span>
                  )}
                  <span className="text-[32px] font-extrabold text-heading leading-none">
                    {formatPrice(displayPrice)}
                  </span>
                </div>
                <p className="text-[12px] text-paragraph font-normal">
                  All-inclusive accommodations, transfers, and guides.
                </p>
              </div>

              {/* Package Summary highlights */}
              <div className="bg-light-gray/40 rounded-2xl p-4.5 space-y-3.5 border border-border/30">
                <div className="flex justify-between text-caption font-semibold text-heading">
                  <span className="text-paragraph">Destinations Covered</span>
                  <span>{pkg.location}</span>
                </div>
                <div className="flex justify-between text-caption font-semibold text-heading">
                  <span className="text-paragraph">Lodging standard</span>
                  <span>5-Star / Ryokan</span>
                </div>
                <div className="flex justify-between text-caption font-semibold text-heading">
                  <span className="text-paragraph">Travel Style</span>
                  <span className="capitalize">{pkg.category} Escape</span>
                </div>
              </div>

              {/* Call to Action */}
              <Link href={`/booking?packageId=${pkg.id}`} className="w-full block">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center space-x-2.5 py-4 shadow-soft font-bold">
                  <span>Book This Voyage</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <p className="text-center text-[12px] text-paragraph font-normal">
                No immediate payment required. You'll review dates & discount coupons in the checkout panel.
              </p>
            </div>
          </div>

        </div>
      </Container>

      {/* Related Packages Carousel */}
      {relatedTours.length > 0 && (
        <section className="section-pad bg-white border-t border-border/50 mt-20">
          <Container>
            <SectionHeading
              title="Related Tour Packages"
              subtitle="Exquisite options in adjacent categories or regions that you might find compelling."
              align="left"
              className="mb-10"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedTours.map((tour) => (
                <div key={tour.id} className="max-w-md lg:max-w-none">
                  <PackageCard pkg={tour} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
