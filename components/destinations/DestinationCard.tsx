import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    slug: string;
    country: string;
    state?: string | null;
    shortDescription: string;
    description: string;
    bannerImage: string;
    galleryImages?: string[];
    popularPlaces?: string[];
    bestTimeToVisit?: string;
    status: string;
  };
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const attractionsCount = destination.popularPlaces?.length || 0;
  const [imgSrc, setImgSrc] = React.useState(destination.bannerImage || '/hero-banner.jpg');

  React.useEffect(() => {
    setImgSrc(destination.bannerImage || '/hero-banner.jpg');
  }, [destination.bannerImage]);
  
  return (
    <Link 
      href={`/packages?country=${encodeURIComponent(destination.country)}`}
      className="group block outline-none overflow-hidden rounded-[24px] relative h-[380px] w-full border border-border/10 hover:shadow-hover hover:border-primary/20 transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={destination.name}
        onError={() => setImgSrc('/hero-banner.jpg')}
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 lg:group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
        <span className="text-[12px] font-bold text-[#F59E0B] uppercase tracking-widest block">
          {destination.state ? destination.state.toUpperCase() : destination.country.toUpperCase()}
        </span>
        
        <h3 className="text-[22px] font-bold text-white leading-tight mt-1.5 font-heading">
          {destination.name}
        </h3>
        
        <p className="text-[14px] text-white/80 leading-relaxed mt-2.5 line-clamp-3 font-normal">
          {destination.shortDescription}
        </p>

        <div className="flex items-center gap-2 text-[14px] font-semibold text-white mt-4 pt-3 border-t border-white/10">
          <Calendar className="w-4 h-4 text-[#F59E0B]" />
          <span>{destination.bestTimeToVisit ? destination.bestTimeToVisit : "Best Time Not Available"}</span>
        </div>
      </div>
    </Link>
  );
}
