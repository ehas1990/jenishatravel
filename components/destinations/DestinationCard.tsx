import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Destination } from '@/types';
import { cn } from '@/lib/utils';
import Card from '../ui/Card';

interface DestinationCardProps {
  destination: Destination;
  isActive?: boolean;
  onActive?: () => void;
}

export default function DestinationCard({ destination, isActive = false, onActive }: DestinationCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Desktop: >=1024px -> hover interaction.
    // Mobile/Tablet: <1024px -> tap interaction.
    if (window.innerWidth < 1024) {
      if (!isActive) {
        e.preventDefault();
        if (onActive) {
          onActive();
        }
      }
    }
  };

  return (
    <Link 
      href={`/destinations?country=${destination.country}`}
      onClick={handleClick}
      className="group block outline-none rounded-card"
    >
      <Card 
        hoverEffect={false}
        className={cn(
          "relative h-96 w-full cursor-pointer overflow-hidden rounded-card border border-border/50",
          isActive 
            ? "-translate-y-2 shadow-hover border-primary/20" 
            : "lg:group-hover:-translate-y-2 lg:group-hover:shadow-hover lg:group-hover:border-primary/20 group-focus-visible:-translate-y-2 group-focus-visible:shadow-hover group-focus-visible:border-primary/20"
        )}
        style={{ transition: 'all 0.45s ease' }}
      >
        {/* Background Image */}
        <img
          src={destination.image}
          alt={destination.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            isActive ? "scale-105" : "lg:group-hover:scale-105 group-focus-visible:scale-105"
          )}
          style={{ transition: 'all 0.45s ease' }}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0",
            isActive 
              ? "bg-gradient-to-t from-dark-bg/95 via-dark-bg/40 to-transparent" 
              : "bg-gradient-to-t from-dark-bg/60 via-dark-bg/10 to-transparent lg:group-hover:from-dark-bg/95 lg:group-hover:via-dark-bg/40 group-focus-visible:from-dark-bg/95 group-focus-visible:via-dark-bg/40"
          )}
          style={{ transition: 'all 0.45s ease' }}
        />

        {/* Text Details overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 flex flex-col justify-end h-full">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">
              {destination.country}
            </span>
            <h3 className="text-card-title font-extrabold leading-tight">
              {destination.title}
            </h3>
          </div>
          
          {/* Animated Expandable Content */}
          <div 
            className={cn(
              "space-y-3",
              isActive 
                ? "max-h-[150px] opacity-100 translate-y-0 mt-3 pointer-events-auto" 
                : "max-h-0 opacity-0 translate-y-5 overflow-hidden pointer-events-none lg:group-hover:max-h-[150px] lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:mt-3 lg:group-hover:pointer-events-auto group-focus-visible:max-h-[150px] group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:mt-3 group-focus-visible:pointer-events-auto"
            )}
            style={{ transition: 'all 0.45s ease' }}
          >
            <p className="text-caption text-slate-200 line-clamp-2 leading-relaxed">
              {destination.description}
            </p>

            <div className="flex items-center space-x-2 text-caption font-semibold text-primary pt-2 border-t border-white/10">
              <Compass className="w-4 h-4 text-secondary animate-spin-slow" />
              <span className="text-white">{destination.attractionsCount} Premium Attractions</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
