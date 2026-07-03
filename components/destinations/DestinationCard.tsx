import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Destination } from '@/types';
import Card from '../ui/Card';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/destinations?country=${destination.country}`}>
      <Card className="relative h-96 group cursor-pointer overflow-hidden rounded-card">
        {/* Background Image */}
        <img
          src={destination.image}
          alt={destination.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/30 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

        {/* Text Details overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3 z-10 flex flex-col justify-end h-full">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">
              {destination.country}
            </span>
            <h3 className="text-card-title font-extrabold leading-tight">
              {destination.title}
            </h3>
          </div>
          
          <p className="text-caption text-slate-200 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            {destination.description}
          </p>

          <div className="flex items-center space-x-2 text-caption font-semibold text-primary pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Compass className="w-4 h-4 text-secondary animate-spin-slow" />
            <span className="text-white">{destination.attractionsCount} Premium Attractions</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
