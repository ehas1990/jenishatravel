'use client';

import React from 'react';
import DestinationCard from './DestinationCard';

interface DestinationsGridProps {
  destinations: any[];
  className?: string;
}

export default function DestinationsGrid({ destinations, className }: DestinationsGridProps) {
  return (
    <div className={className}>
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  );
}
