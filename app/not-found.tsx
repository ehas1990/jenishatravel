import React from 'react';
import Link from 'next/link';
import { Compass, Home, CompassIcon } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-light-gray/40 py-24 text-center font-normal">
      <Container className="max-w-md space-y-8 flex flex-col items-center">
        {/* Animated Compass Graphic */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-125" />
          <div className="bg-white border border-border p-8 rounded-full shadow-medium relative z-10 text-primary">
            <Compass className="w-20 h-20 animate-spin-slow" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-section-title font-extrabold text-heading tracking-tight leading-none">404</h1>
          <h2 className="font-heading font-bold text-[22px] text-heading">Itinerary Lost</h2>
          <p className="text-small text-paragraph max-w-xs mx-auto leading-relaxed">
            The page you are looking for has been relocated or doesn't exist. Let's redirect you to safety.
          </p>
        </div>

        {/* Go Home button */}
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="flex items-center space-x-2 shadow-soft font-bold">
              <Home className="w-4.5 h-4.5" />
              <span>Go Back Home</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
