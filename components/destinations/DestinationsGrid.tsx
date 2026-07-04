'use client';

import React, { useState } from 'react';
import { Destination } from '@/types';
import DestinationCard from './DestinationCard';

interface DestinationsGridProps {
  destinations: Destination[];
  className?: string;
}

export default function DestinationsGrid({ destinations, className }: DestinationsGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className={className}>
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          isActive={activeId === destination.id}
          onActive={() => setActiveId(destination.id)}
        />
      ))}
    </div>
  );
}
