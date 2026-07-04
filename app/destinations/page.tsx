'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Compass, Map, HelpCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';
import Accordion from '@/components/ui/Accordion';
import { DESTINATIONS } from '@/constants/data';

const countries = ['All', 'Japan', 'Italy', 'Iceland', 'Indonesia', 'Switzerland', 'France'];

function DestinationsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const countryParam = searchParams.get('country') || 'All';

  // Sync state with URL params after mount
  useEffect(() => {
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
  }, [countryParam]);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    const params = new URLSearchParams(searchParams.toString());
    if (country === 'All') {
      params.delete('country');
    } else {
      params.set('country', country);
    }
    router.push(`/destinations?${params.toString()}`);
  };

  // Filter destinations based on search query and tab selection
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      const matchesCountry = selectedCountry === 'All' || dest.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCountry && matchesSearch;
    });
  }, [searchQuery, selectedCountry]);

  // Aggregate destination FAQs
  const destinationFaqs = useMemo(() => {
    return DESTINATIONS.flatMap((d) => d.faqs || []).map((faq, i) => ({
      id: i,
      title: faq.question,
      content: faq.answer,
    }));
  }, []);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Banner */}
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Where to go</span>
          <h1 className="text-section-title font-extrabold text-white">Explore Our Destinations</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            Discover historic temples, crystalline coastlines, and snow-capped alpine peaks curated for luxury explorers.
          </p>
        </Container>
      </section>



      {/* Destination Grid */}
      <section className="section-pad">
        <Container>
          {filteredDestinations.length > 0 ? (
            <DestinationsGrid
              destinations={filteredDestinations}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            />
          ) : (
            <div className="text-center py-16 space-y-4">
              <Compass className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
              <h3 className="text-card-title text-heading font-bold">No Destinations Found</h3>
              <p className="text-small text-paragraph max-w-sm mx-auto font-normal">
                We couldn't find any destinations matching your search. Try adjusting your filters.
              </p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); handleCountrySelect('All'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Map Section Mockup */}
      <section className="section-pad bg-light-gray/40 border-y border-border/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Interactive Map</span>
              <h2 className="text-section-title text-heading">World of Luxury Awaiting</h2>
              <p className="text-body text-paragraph leading-relaxed">
                Our global network spans six continents. We design private routes, ensuring you bypass crowded checkpoints and arrive at exclusive resorts via chartered logistics.
              </p>
              <div className="space-y-4">
                {[
                  'Private island charter pick-ups',
                  'Skip-the-line VIP museum bookings',
                  'Exclusive culinary chef tables',
                  'Premium wellness spa check-ins'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-heading font-semibold text-small">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7">
              {/* Map Placeholder Graphic */}
              <div className="aspect-[16/10] bg-slate-900 rounded-[32px] overflow-hidden relative shadow-medium border border-border flex items-center justify-center text-white p-8">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200")' }}
                />
                <div className="absolute inset-0 bg-teal-950/20" />
                <div className="relative z-10 text-center space-y-4 max-w-sm">
                  <Map className="w-12 h-12 text-secondary mx-auto animate-bounce" />
                  <h3 className="font-heading font-bold text-[22px]">Interactive Travel Map</h3>
                  <p className="text-caption text-slate-300 font-normal">
                    Interactive global navigation showing available packages and bespoke villas is loading...
                  </p>
                  <div className="inline-flex items-center space-x-2 text-secondary font-semibold text-caption uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                    <span>GPS Coordinates Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Destination FAQs */}
      <section className="section-pad bg-white">
        <Container className="max-w-4xl">
          <SectionHeading
            badge="FAQ"
            title="Destination Advice & Tips"
            subtitle="Get essential answers regarding travel season timing, language support, and entry clearances."
          />
          <Accordion items={destinationFaqs.slice(0, 5)} />
        </Container>
      </section>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <p className="text-small text-paragraph font-normal">Loading destinations...</p>
      </div>
    }>
      <DestinationsPageContent />
    </Suspense>
  );
}
