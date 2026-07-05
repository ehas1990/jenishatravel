'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Award, Sparkles, Compass } from 'lucide-react';
import Hero from '@/components/home/Hero';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';
import PackageCard from '@/components/packages/PackageCard';
import Card from '@/components/ui/Card';
import { getDestinations } from '@/actions/destinations';
import { PACKAGES } from '@/constants/data';

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const featuredPackages = PACKAGES.filter((p) => p.featured).slice(0, 3);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await getDestinations({
          status: 'ACTIVE',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 2,
        });
        if (res.error) {
          setError(res.error);
        } else {
          setFeaturedDestinations(res.destinations || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load destinations.');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner */}
      <Hero />


      {/* 3. Popular Destinations Section */}
      <section className="section-pad bg-white">
        <Container>
          <SectionHeading
            badge="Top Destinations"
            title="Explore Popular Places"
            subtitle="Explore our selection of the world's most exquisite and visually stunning locations, curated for luxury enthusiasts."
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-100 border border-border/40 rounded-[24px] h-[380px] w-full animate-pulse flex flex-col justify-end p-8 gap-3">
                <div className="h-3.5 w-1/4 bg-slate-200 rounded-[4px]" />
                <div className="h-7 w-3/4 bg-slate-200 rounded-[6px]" />
                <div className="h-4 w-full bg-slate-200 rounded-[4px]" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-[4px]" />
                <div className="h-4 w-1/2 bg-slate-200 rounded-[4px] mt-3 pt-3 border-t border-slate-200/40" />
              </div>
              <div className="bg-slate-100 border border-border/40 rounded-[24px] h-[380px] w-full animate-pulse flex flex-col justify-end p-8 gap-3">
                <div className="h-3.5 w-1/4 bg-slate-200 rounded-[4px]" />
                <div className="h-7 w-3/4 bg-slate-200 rounded-[6px]" />
                <div className="h-4 w-full bg-slate-200 rounded-[4px]" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-[4px]" />
                <div className="h-4 w-1/2 bg-slate-200 rounded-[4px] mt-3 pt-3 border-t border-slate-200/40" />
              </div>
            </div>
          ) : error || featuredDestinations.length === 0 ? (
            <div className="text-center py-12 text-paragraph font-normal">
              No destinations available.
            </div>
          ) : (
            <DestinationsGrid
              destinations={featuredDestinations}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            />
          )}

          <div className="text-center mt-12">
            <Link href="/destinations">
              <Button variant="outline" size="md" className="flex items-center space-x-2 mx-auto">
                <span>View All Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Travel Categories Section */}
      <section className="section-pad bg-light-gray/40 border-y border-border/50">
        <Container>
          <SectionHeading
            badge="Categories"
            title="Choose Your Travel Style"
            subtitle="Whether seeking high-altitude adventure or deep cultural immersion, find your ideal travel style."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, label: 'Luxury Escape', value: 'luxury', desc: '5-Star boutique hotels & yacht charters' },
              { icon: Compass, label: 'Adventure Quest', value: 'adventure', desc: 'Glacier trekking & volcanic caving' },
              { icon: Globe, label: 'Cultural Journey', value: 'cultural', desc: 'Historic temple tours & tea ceremonies' },
              { icon: Award, label: 'Nature Sanctuary', value: 'nature', desc: 'Eco-friendly retreats & scenic valleys' }
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link key={i} href={`/packages?category=${cat.value}`}>
                  <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 hover:border-primary/50 group h-full bg-white">
                    <div className="p-4 bg-teal-50 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-[18px] text-heading group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-[13px] text-paragraph mt-1 font-normal leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Featured Packages Section */}
      <section className="section-pad bg-white">
        <Container>
          <SectionHeading
            badge="Exclusive Offers"
            title="Featured Tour Packages"
            subtitle="Browse our carefully planned itineraries featuring private transportation, local guides, and top-tier hospitality."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="primary" size="md" className="flex items-center space-x-2 mx-auto">
                <span>View All Tour Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 6. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 7. Testimonials Carousel Section */}
      <Testimonials />


      {/* 9. Experience / Statistics Section */}
      <section className="section-pad bg-teal-50 border-t border-border/50">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '12K+', label: 'Happy Travelers' },
              { number: '150+', label: 'Luxury Hotels' },
              { number: '15+', label: 'Years Experience' },
              { number: '99%', label: 'Satisfied Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-[44px] md:text-[56px] font-heading font-extrabold text-primary leading-none">
                  {stat.number}
                </div>
                <div className="font-heading font-semibold text-small text-heading uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
