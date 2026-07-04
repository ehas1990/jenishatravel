'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Compass, Map, HelpCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';
import Accordion from '@/components/ui/Accordion';
import InteractiveMap from '@/components/destinations/InteractiveMap';
import { DESTINATIONS } from '@/constants/data';
import { cn } from '@/lib/utils';

const countries = ['All', 'Kerala', 'Tamil Nadu', 'Kashmir', 'Rajasthan', 'Goa', 'Ladakh'];

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
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center animate-fadeIn">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Where to go</span>
          <h1 className="text-section-title font-extrabold text-white">Explore Our Destinations</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            Discover historic temples, serene coastlines, and snow-capped Himalayan peaks curated for luxury explorers in India.
          </p>
        </Container>
      </section>

      {/* Search and Regional Filters */}
      <section className="pt-16 pb-0 bg-white" id="destinations-grid-section">
        <Container className="space-y-8">
          <SectionHeading
            badge="Bespoke Collections"
            title="Curate Your Journey"
            subtitle="Filter our luxury travel destinations by state or search by keyword to design your custom itinerary."
            align="center"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-light-gray/40 border border-border/50 p-6 rounded-card shadow-soft">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-paragraph" />
              <input
                type="text"
                placeholder="Search states, cities or themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-border rounded-btn pl-12 pr-4 py-3 text-small text-heading focus:outline-none focus:border-primary transition-colors shadow-soft"
              />
            </div>

            {/* State Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end overflow-x-auto scrollbar-none">
              {countries.map((country) => {
                const isActive = selectedCountry.toLowerCase() === country.toLowerCase();
                return (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "px-5 py-2.5 rounded-btn text-caption font-semibold transition-all cursor-pointer whitespace-nowrap",
                      isActive
                        ? "bg-primary text-white shadow-soft"
                        : "bg-white border border-border text-paragraph hover:text-heading hover:border-primary-hover"
                    )}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Destination Grid */}
      <section className="section-pad">
        <Container>
          {filteredDestinations.length > 0 ? (
            <DestinationsGrid
              destinations={filteredDestinations}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn"
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

      {/* Map Section */}
      <section className="section-pad bg-light-gray/40 border-y border-border/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map copy text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Interactive Map</span>
              <h2 className="text-section-title text-heading">Bespoke Logistics & Coordinates</h2>
              <p className="text-body text-paragraph leading-relaxed">
                Our luxury transport network spans across India's premier destinations. We arrange private aviation charters, yachts, and luxury SUVs, bypassing public transit to ensure a secure, VIP experience from start to finish.
              </p>
              <div className="space-y-4">
                {[
                  'Private helicopter charters to Ladakh',
                  'Chartered luxury yachts in Goa',
                  'Private heritage train compartments in Ooty',
                  'Chauffeured luxury SUV transfers'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-heading font-semibold text-small">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actual Interactive Map Component */}
            <div className="lg:col-span-7">
              <InteractiveMap 
                selectedCountry={selectedCountry} 
                onSelectCountry={handleCountrySelect} 
              />
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
