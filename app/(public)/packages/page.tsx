'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Compass, Calendar } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import PackageCard from '@/components/packages/PackageCard';
import Pagination from '@/components/ui/Pagination';
import Card from '@/components/ui/Card';
import { PACKAGES } from '@/constants/data';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'nature', label: 'Nature & Wellness' }
];

const durations = [
  { value: 'all', label: 'Any Duration' },
  { value: 'short', label: '1 - 5 Days' },
  { value: 'medium', label: '6 - 8 Days' }
];

const countries = ['All', 'Kerala', 'Tamil Nadu', 'Kashmir', 'Rajasthan', 'Goa', 'Ladakh'];

function TourPackagesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial states set to defaults for SSR safety (avoid hydration mismatch)
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState(5000); // Max budget
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const countryParam = searchParams.get('country') || 'All';
  const categoryParam = searchParams.get('category') || 'all';

  // Sync URL params with states after mount
  useEffect(() => {
    if (countryParam) setSelectedCountry(countryParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [countryParam, categoryParam]);

  // Handle resets
  const handleResetFilters = () => {
    setSelectedCountry('All');
    setSelectedCategory('all');
    setSelectedDuration('all');
    setPriceRange(5000);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    router.push('/packages');
  };

  // Filter logic
  const filteredPackages = useMemo(() => {
    return PACKAGES.filter((pkg) => {
      // Country Filter
      const matchesCountry = selectedCountry === 'All' || pkg.country.toLowerCase() === selectedCountry.toLowerCase();
      // Category Filter
      const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
      // Budget Filter
      const hasDiscount = !!pkg.discountPrice;
      const finalPrice = hasDiscount ? pkg.discountPrice! : pkg.price;
      const matchesBudget = finalPrice <= priceRange;
      
      // Duration Filter (parse days)
      const dayCount = parseInt(pkg.duration.split(' ')[0]) || 0;
      let matchesDuration = true;
      if (selectedDuration === 'short') {
        matchesDuration = dayCount <= 5;
      } else if (selectedDuration === 'medium') {
        matchesDuration = dayCount >= 6 && dayCount <= 8;
      }

      // Search Filter
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pkg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCountry && matchesCategory && matchesBudget && matchesDuration && matchesSearch;
    });
  }, [selectedCountry, selectedCategory, selectedDuration, priceRange, searchQuery]);

  // Sort logic
  const sortedPackages = useMemo(() => {
    const list = [...filteredPackages];
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredPackages, sortBy]);

  // Pagination calculations
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);
  
  const paginatedPackages = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedPackages.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedPackages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-light-gray/20">
      {/* Banner */}
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center animate-fadeIn">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Our Catalogue</span>
          <h1 className="text-section-title font-extrabold text-white">Curated Tour Voyages</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            Review our premier all-inclusive travel programs featuring local transport, wellness, and dedicated guide services.
          </p>
        </Container>
      </section>

      {/* Main Catalog Section */}
      <section className="py-10">
        <Container>
          <div className="w-full">
            {/* Catalog Grid & Header Sort */}
            <div className="w-full space-y-8">


              {/* Packages Cards Grid */}
              {paginatedPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                  {paginatedPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white border border-border/50 rounded-card space-y-4 shadow-soft">
                  <Compass className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
                  <h3 className="text-card-title text-heading font-bold">No Tours Found</h3>
                  <p className="text-small text-paragraph max-w-sm mx-auto font-normal">
                    We couldn't find any packages matching your selection. Try resetting filters.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="px-6 py-2.5">
                    Reset All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-12 border-t border-border/50">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>
    </div>
  );
}

export default function TourPackagesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <p className="text-small text-paragraph font-normal">Loading tour packages...</p>
      </div>
    }>
      <TourPackagesPageContent />
    </Suspense>
  );
}
