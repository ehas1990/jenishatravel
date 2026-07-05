'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Compass, MapPin, Calendar, HelpCircle, Loader2 } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';
import Accordion from '@/components/ui/Accordion';
import InteractiveMap from '@/components/destinations/InteractiveMap';
import { getDestinations } from '@/actions/destinations';
import { cn } from '@/lib/utils';

const countries = ['All', 'Kerala', 'Tamil Nadu', 'Kashmir', 'Rajasthan', 'Goa', 'Ladakh'];

function DestinationCardSkeleton() {
  return (
    <div className="bg-slate-100 border border-border/40 rounded-[24px] h-[380px] w-full animate-pulse flex flex-col justify-end p-8 gap-3">
      <div className="h-3.5 w-1/4 bg-slate-200 rounded-[4px]" />
      <div className="h-7 w-3/4 bg-slate-200 rounded-[6px]" />
      <div className="h-4 w-full bg-slate-200 rounded-[4px]" />
      <div className="h-4 w-2/3 bg-slate-200 rounded-[4px]" />
      <div className="h-4 w-1/2 bg-slate-200 rounded-[4px] mt-3 pt-3 border-t border-slate-200/40" />
    </div>
  );
}

function DestinationsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  
  // Database states
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryParam = searchParams.get('country') || 'All';

  // Sync state with URL params after mount
  useEffect(() => {
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
  }, [countryParam]);

  // Fetch active destinations from server action
  const fetchDestinationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDestinations({
        status: 'ACTIVE',
        limit: 100, // Fetch all active destinations
      });
      if (res.error) {
        setError(res.error);
      } else {
        setDestinations(res.destinations || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to establish database connection. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationsData();
  }, []);

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
    return destinations.filter((dest) => {
      const matchesCountry = selectedCountry === 'All' || 
                             dest.country.toLowerCase() === selectedCountry.toLowerCase() ||
                             (dest.state && dest.state.toLowerCase() === selectedCountry.toLowerCase());
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (dest.state && dest.state.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCountry && matchesSearch;
    });
  }, [destinations, searchQuery, selectedCountry]);

  // Aggregate destination FAQs
  const destinationFaqs = useMemo(() => {
    if (destinations.length === 0) {
      return [
        {
          id: 1,
          title: "When is the best season to travel to India's luxury regions?",
          content: "The winter months from October to March offer cool, pleasant weather across most destinations, including Kerala, Rajasthan, and Tamil Nadu. The monsoons (June to September) are ideal for wellness and Ayurvedic retreats."
        },
        {
          id: 2,
          title: "What bespoke logistics and transports are arranged for guests?",
          content: "We organize private helicopter charters to high-altitude areas like Ladakh, premium catamaran or private yacht cruises in Goa, and chartered luxury SUV transfers across all destinations."
        }
      ];
    }
    
    return destinations.flatMap((d) => {
      return [
        {
          title: `What is the best season to visit ${d.name}?`,
          content: `The best time to visit ${d.name} in ${d.country} is during ${d.bestTimeToVisit || 'the cooler months of the year'} when the weather is most favorable.`
        },
        {
          title: `What attractions should I not miss in ${d.name}?`,
          content: `Highly recommended luxury attractions in ${d.name} include: ${d.popularPlaces?.join(', ') || 'heritage landmarks and scenic spots'}.`
        }
      ];
    }).map((faq, i) => ({
      id: i,
      title: faq.title,
      content: faq.content,
    }));
  }, [destinations]);

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


        </Container>
      </section>

      {/* Destination Grid */}
      <section className="pt-6 pb-16 bg-white">
        <Container>
          {loading ? (
            /* Loading State with Skeleton cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <DestinationCardSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            /* Error State with retry option */
            <div className="text-center py-16 space-y-5 max-w-md mx-auto">
              <HelpCircle className="w-16 h-16 text-rose-400 mx-auto animate-bounce" />
              <h3 className="text-[20px] text-heading font-bold">Failed to Load Collections</h3>
              <p className="text-[14px] text-paragraph leading-relaxed font-normal">
                {error}
              </p>
              <Button variant="primary" size="md" onClick={fetchDestinationsData} className="rounded-xl px-6 flex items-center justify-center gap-2 mx-auto">
                <Loader2 className="w-4 h-4 hidden" />
                Retry Connection
              </Button>
            </div>
          ) : filteredDestinations.length > 0 ? (
            /* Actual Destinations Display Grid */
            <DestinationsGrid
              destinations={filteredDestinations}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn"
            />
          ) : (
            /* Empty State */
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
      <section className="py-12 bg-light-gray/40">
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
                destinations={destinations}
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
          <Accordion items={destinationFaqs.slice(0, 6)} />
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
