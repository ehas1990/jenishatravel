'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, ArrowRight, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

interface InteractiveMapProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  destinations: any[];
}

interface MapPinInfo {
  slug: string;
  name: string;
  x: number; // SVG X coordinate (0-400)
  y: number; // SVG Y coordinate (0-500)
  lat: string;
  lng: string;
}

const MAP_PINS: MapPinInfo[] = [
  { slug: 'kashmir', name: 'Kashmir', x: 200, y: 75, lat: '34.0837° N', lng: '74.7973° E' },
  { slug: 'ladakh', name: 'Ladakh', x: 218, y: 55, lat: '34.1526° N', lng: '77.5770° E' },
  { slug: 'rajasthan', name: 'Rajasthan', x: 110, y: 175, lat: '26.9124° N', lng: '75.7873° E' },
  { slug: 'goa', name: 'Goa', x: 140, y: 320, lat: '15.2993° N', lng: '74.1240° E' },
  { slug: 'kerala', name: 'Kerala', x: 165, y: 430, lat: '10.8505° N', lng: '76.2711° E' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', x: 185, y: 420, lat: '11.1271° N', lng: '78.6569° E' }
];

export default function InteractiveMap({ selectedCountry, onSelectCountry, destinations }: InteractiveMapProps) {
  const [activeSlug, setActiveSlug] = useState<string>('kerala');
  const [isScanning, setIsScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [geoLoc, setGeoLoc] = useState<{ x: number; y: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [scanCoords, setScanCoords] = useState({ lat: '10.8505° N', lng: '76.2711° E' });
  const mapRef = useRef<HTMLDivElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);


  // Find dynamic destination based on slug, state, or country matches
  const activeDestination = destinations.find(d => 
    d.slug === activeSlug || 
    (d.state && d.state.toLowerCase() === activeSlug.toLowerCase()) ||
    d.country.toLowerCase() === activeSlug.toLowerCase()
  ) || destinations[0];

  // Dynamic image source with fallback support
  // eslint-disable-next-line react-hooks-rules-of-hooks
  const [panelImgSrc, setPanelImgSrc] = useState(activeDestination?.bannerImage || '/hero-banner.jpg');

  // eslint-disable-next-line react-hooks-rules-of-hooks
  useEffect(() => {
    if (activeDestination) {
      setPanelImgSrc(activeDestination.bannerImage || '/hero-banner.jpg');
    }
  }, [activeDestination]);

  // Sync active destination with parent selected country if it changes
  // eslint-disable-next-line react-hooks-rules-of-hooks
  useEffect(() => {
    if (selectedCountry && selectedCountry !== 'All') {
      const matched = destinations.find(d => 
        d.country.toLowerCase() === selectedCountry.toLowerCase() ||
        (d.state && d.state.toLowerCase() === selectedCountry.toLowerCase())
      );
      if (matched) {
        setActiveSlug(matched.slug);
      }
    }
  }, [selectedCountry, destinations]);

  // Filter map pins to dynamically show pins for which active database records exist
  const activePins = MAP_PINS.filter(pin => 
    destinations.some(d => 
      d.slug === pin.slug || 
      (d.state && d.state.toLowerCase() === pin.slug.toLowerCase()) || 
      d.country.toLowerCase() === pin.slug.toLowerCase()
    )
  );

  // Handle GPS Scan / Geolocation simulation
  const handleGPSActive = () => {
    if (isScanning || activePins.length === 0) return;
    setIsScanning(true);
    setIsLocating(true);
    setScanText('INITIALIZING SECURE SAT-LINK...');
    
    let counter = 0;
    const duration = 2500; // 2.5 seconds
    const intervalTime = 120;
    const totalSteps = duration / intervalTime;

    scanIntervalRef.current = setInterval(() => {
      // Rotate active pin rapidly to simulate scanning
      const tempPin = activePins[counter % activePins.length];
      setActiveSlug(tempPin.slug);
      setScanCoords({
        lat: `${(Math.random() * 20 + 10).toFixed(4)}° N`,
        lng: `${(Math.random() * 15 + 70).toFixed(4)}° E`
      });

      counter++;

      if (counter >= totalSteps) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        
        // Finalize scanning and select a random destination
        const randomIndex = Math.floor(Math.random() * activePins.length);
        const finalPin = activePins[randomIndex];
        setActiveSlug(finalPin.slug);
        setScanCoords({ lat: finalPin.lat, lng: finalPin.lng });
        setIsScanning(false);
        setIsLocating(false);
        setScanText('');

        // Attempt real browser geolocation as a premium touch
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const mapX = ((longitude - 68) / (97 - 68)) * 340 + 40;
              const mapY = 500 - (((latitude - 8) / (37 - 8)) * 380 + 50);

              if (mapX >= 0 && mapX <= 420 && mapY >= 0 && mapY <= 500) {
                setGeoLoc({ x: mapX, y: mapY, label: 'YOU (GPS)' });
              } else {
                setGeoLoc({ x: 190, y: 460, label: 'YOU (GATEWAY)' });
              }
            },
            () => {
              // Permission denied/error
            }
          );
        }
      }
    }, intervalTime);
  };

  // eslint-disable-next-line react-hooks-rules-of-hooks
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // Render empty state if no destinations exist
  if (!destinations || destinations.length === 0) {
    return (
      <div className="w-full aspect-[16/10.5] md:aspect-[16/10] bg-dark-bg rounded-[32px] overflow-hidden relative shadow-medium border border-white/10 flex items-center justify-center text-white p-6 select-none animate-fadeIn">
        <div className="absolute inset-0 bg-[radial-gradient(#115e59_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="text-center p-8 space-y-4 max-w-sm relative z-10">
          <ShieldAlert className="w-12 h-12 text-secondary/80 mx-auto animate-pulse" />
          <h3 className="text-[18px] font-bold text-white">No destinations available.</h3>
          <p className="text-[13px] text-slate-400 font-normal">
            Please register active sectors in the administrator control panel.
          </p>
        </div>
      </div>
    );
  }

  const handlePinClick = (slug: string) => {
    setActiveSlug(slug);
    const pin = MAP_PINS.find(p => p.slug === slug);
    if (pin) {
      setScanCoords({ lat: pin.lat, lng: pin.lng });
    }
  };

  const handleFilterClick = () => {
    if (activeDestination) {
      onSelectCountry(activeDestination.country);
      const gridSection = document.getElementById('destinations-grid-section');
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Outer Map Container */}
      <div 
        ref={mapRef}
        className="w-full aspect-[16/10.5] md:aspect-[16/10] bg-dark-bg rounded-[32px] overflow-hidden relative shadow-medium border border-white/5 flex flex-col md:flex-row p-4 md:p-6 text-white select-none animate-fadeIn"
      >
        {/* Futuristic Grid & Overlay Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#115e59_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-dark-bg via-dark-bg/95 to-teal-950/20 pointer-events-none" />

        {/* Vector SVG India Map Column */}
        <div className="w-full md:w-3/5 h-full relative flex items-center justify-center min-h-[250px] md:min-h-0">
          <svg 
            viewBox="0 0 420 500" 
            className="w-full h-[95%] text-teal-950/40 fill-current stroke-primary/20 stroke-[1.5] filter drop-shadow-[0_4px_16px_rgba(15,118,110,0.15)]"
          >
            {/* Outline path of India (stylized vector) */}
            <path d="M190,40 L210,48 L222,65 L212,82 L202,87 L206,96 L216,92 L226,101 L230,115 L242,120 L252,106 L262,111 L274,102 L284,111 L288,124 L276,133 L266,129 L262,138 L256,143 L266,152 L280,157 L296,152 L314,157 L318,148 L332,153 L336,167 L326,176 L312,171 L298,176 L288,185 L292,195 L278,195 L268,200 L254,191 L244,196 L238,205 L228,210 L223,220 L228,234 L238,239 L242,248 L256,252 L270,257 L284,252 L298,256 L312,265 L316,279 L306,293 L292,298 L278,303 L264,308 L250,322 L236,340 L222,358 L212,377 L202,395 L198,408 L193,422 L188,432 L186,441 L181,445 L178,441 L174,422 L173,404 L168,385 L166,367 L164,349 L161,331 L156,312 L150,293 L144,275 L138,256 L130,242 L123,233 L116,228 L106,233 L96,238 L86,233 L76,224 L68,215 L63,205 L60,196 L63,182 L73,177 L83,172 L88,163 L93,149 L103,139 L113,144 L123,139 L133,130 L141,125 L146,111 L141,101 L146,92 L156,87 L166,82 L171,68 L176,54 Z" />
            
            {/* Connecting luxury travel grid network lines (futuristic routes mapping) */}
            <g className="stroke-secondary/20 stroke-[1] stroke-dasharray-[2_4] opacity-50">
              <line x1="200" y1="75" x2="110" y2="175" /> {/* Kashmir to Rajasthan */}
              <line x1="110" y1="175" x2="140" y2="320" /> {/* Rajasthan to Goa */}
              <line x1="140" y1="320" x2="165" y2="430" /> {/* Goa to Kerala */}
              <line x1="165" y1="430" x2="185" y2="420" /> {/* Kerala to Tamil Nadu */}
              <line x1="185" y1="420" x2="200" y2="75" /> {/* Tamil Nadu to Kashmir */}
              <line x1="200" y1="75" x2="218" y2="55" /> {/* Kashmir to Ladakh */}
            </g>

            {/* Glowing Geolocation marker if available */}
            {geoLoc && (
              <g className="cursor-default">
                <circle 
                  cx={geoLoc.x} 
                  cy={geoLoc.y} 
                  r="15" 
                  className="fill-teal-400/20 stroke-teal-400/30 stroke-[1] animate-ping"
                />
                <circle 
                  cx={geoLoc.x} 
                  cy={geoLoc.y} 
                  r="6" 
                  className="fill-teal-400 stroke-white stroke-[1.5] shadow-medium"
                />
                <text 
                  x={geoLoc.x + 10} 
                  y={geoLoc.y + 4} 
                  className="font-bold text-[8px] fill-teal-400 tracking-widest font-body"
                >
                  {geoLoc.label}
                </text>
              </g>
            )}

            {/* Glowing Interactive Pins */}
            {MAP_PINS.map((pin) => {
              const isSelected = pin.slug === activeSlug;
              const hasDest = destinations.some(d => 
                d.slug === pin.slug || 
                (d.state && d.state.toLowerCase() === pin.slug.toLowerCase()) || 
                d.country.toLowerCase() === pin.slug.toLowerCase()
              );
              
              if (!hasDest) return null; // Hide pin if no corresponding active database record exists

              return (
                <g 
                  key={pin.slug}
                  onClick={() => handlePinClick(pin.slug)}
                  className="cursor-pointer group"
                >
                  {/* Ping Pulse Outer Effect */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 16 : 10}
                    className={cn(
                      "transition-all duration-300 fill-current opacity-25",
                      isSelected ? "text-secondary animate-ping" : "text-primary/0 group-hover:text-primary/45 group-hover:animate-pulse"
                    )}
                  />
                  {/* Medium Hover Rings */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 8 : 5}
                    className={cn(
                      "transition-all duration-300 fill-none stroke-[2]",
                      isSelected ? "stroke-secondary" : "stroke-primary group-hover:stroke-secondary/70"
                    )}
                  />
                  {/* Core Inner Circle */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="3.5"
                    className={cn(
                      "transition-all duration-300",
                      isSelected ? "fill-white" : "fill-primary group-hover:fill-secondary"
                    )}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Glassmorphic Side Panel Detail Column */}
        <div className="w-full md:w-2/5 h-full relative z-10 flex flex-col justify-between mt-4 md:mt-0 bg-white/5 md:bg-white/[0.03] backdrop-blur-md rounded-2xl md:rounded-[24px] border border-white/10 p-5 md:p-6 space-y-4 md:space-y-0">
          
          {/* Header coordinate scan indicator */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Navigation className={cn("w-3 h-3 text-secondary", isScanning && "animate-spin")} />
                <span>Logistics Sat-Link</span>
              </span>
              <h4 className="font-heading font-extrabold text-[15px] text-white">
                {isScanning ? 'SCANNING COORDINATES...' : `${activeDestination?.country.toUpperCase()} SECTOR`}
              </h4>
            </div>
            <div className="text-right text-white">
              <span className="text-[11px] font-mono text-secondary font-bold block">{scanCoords.lat}</span>
              <span className="text-[11px] font-mono text-secondary font-bold block">{scanCoords.lng}</span>
            </div>
          </div>

          {/* Destination Showcase Details */}
          <div className="flex-grow flex flex-col justify-center py-2 space-y-4">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <div className="relative w-14 h-14 border-2 border-secondary/30 rounded-full flex items-center justify-center">
                  <Compass className="w-8 h-8 text-secondary animate-spin-slow" />
                  <div className="absolute inset-0 border-t-2 border-secondary rounded-full animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-mono text-secondary animate-pulse tracking-widest">{scanText}</p>
                  <p className="text-[10px] text-slate-400 font-normal">Syncing high-frequency beacons...</p>
                </div>
              </div>
            ) : activeDestination ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Destination Image Crop */}
                <div className="w-full h-32 rounded-xl overflow-hidden relative border border-white/10 shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={panelImgSrc} 
                    alt={activeDestination.name} 
                    onError={() => setPanelImgSrc('/hero-banner.jpg')}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/10 to-transparent" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[10.5px] bg-secondary text-dark-bg font-bold px-3 py-1 rounded-full uppercase tracking-wider block">
                      {activeDestination.bestTimeToVisit || 'Best Time Not Available'}
                    </span>
                  </div>
                </div>

                {/* Title and Short description */}
                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-[18px] text-white leading-tight">
                    {activeDestination.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono tracking-widest uppercase">
                    {activeDestination.state ? `${activeDestination.state}, ${activeDestination.country}` : activeDestination.country}
                  </p>
                  <p className="text-caption text-slate-300 font-normal line-clamp-3 leading-relaxed">
                    {activeDestination.shortDescription}
                  </p>
                </div>

              </div>
            ) : null}
          </div>


        </div>
      </div>

      {/* Map Control Widget Button at bottom */}
      <div className="flex items-center justify-between bg-light-gray/40 border border-border/50 px-6 py-4 rounded-card">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
          <span className="text-caption text-heading font-semibold">
            {isLocating ? 'SAT-LINKING SECURE GPS BEACONS...' : 'LOGISTICS SIGNAL: SECURE CONNECTION ACTIVE'}
          </span>
        </div>
        <button
          onClick={handleGPSActive}
          disabled={isScanning || activePins.length === 0}
          className="inline-flex items-center space-x-2 text-caption font-bold text-secondary uppercase tracking-wider bg-dark-bg hover:bg-dark-bg/90 disabled:opacity-50 px-5 py-2.5 rounded-full border border-white/10 transition-colors shadow-soft cursor-pointer"
        >
          <Navigation className="w-4 h-4 fill-secondary" />
          <span>{isScanning ? 'LOCKING GPS...' : 'SCAN GLOBAL SECTOR'}</span>
        </button>
      </div>
    </div>
  );
}
