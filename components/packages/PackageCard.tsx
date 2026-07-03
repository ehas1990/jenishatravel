import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import { TravelPackage } from '@/types';
import { formatPrice } from '@/lib/utils';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface PackageCardProps {
  pkg: TravelPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const hasDiscount = !!pkg.discountPrice;
  const displayPrice = hasDiscount ? pkg.discountPrice! : pkg.price;

  return (
    <Card className="flex flex-col h-full bg-white group">
      {/* Image and Badge */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={pkg.category === 'luxury' ? 'secondary' : 'primary'}>
            {pkg.category}
          </Badge>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-4 right-4 z-10 glass-effect px-3 py-1 rounded-full flex items-center space-x-1 border-white/40 shadow-soft">
          <Star className="w-4 h-4 fill-secondary text-secondary" />
          <span className="text-[13px] font-bold text-heading">
            {pkg.rating}
          </span>
          <span className="text-[11px] text-paragraph font-normal">
            ({pkg.reviewsCount})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata: Location & Duration */}
          <div className="flex items-center text-caption text-paragraph space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[120px]">{pkg.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{pkg.duration.split('/')[0]}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-card-title text-heading font-bold line-clamp-1 group-hover:text-primary transition-colors">
            {pkg.title}
          </h3>

          {/* Short Description */}
          <p className="text-small text-paragraph font-normal line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-caption text-paragraph font-medium uppercase tracking-wider">From</span>
            <div className="flex items-baseline space-x-1.5">
              {hasDiscount && (
                <span className="text-small text-paragraph line-through">
                  {formatPrice(pkg.price)}
                </span>
              )}
              <span className="text-card-title font-extrabold text-heading">
                {formatPrice(displayPrice)}
              </span>
            </div>
          </div>

          <Link href={`/packages/${pkg.slug}`}>
            <span className="inline-flex items-center justify-center w-11 h-11 bg-teal-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
