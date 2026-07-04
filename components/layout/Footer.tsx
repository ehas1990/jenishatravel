'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Facebook, Instagram, Twitter, Youtube, Send, Check } from 'lucide-react';
import Container from './Container';
import Button from '../ui/Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-dark-bg text-white pt-24 pb-12 border-t border-white/5">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2.5 rounded-xl text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-heading font-extrabold text-[22px] tracking-wider text-white flex flex-col leading-none">
                VISTA<span className="text-primary text-[14px] font-semibold tracking-widest mt-0.5">LUXE TRAVEL</span>
              </span>
            </Link>
            <p className="text-slate-400 text-small max-w-sm leading-relaxed">
              VistaLuxe is a world-class boutique travel agency creating custom, premium, and unforgettable journeys to the earth's most spectacular destinations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2.5 bg-white/5 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white/5 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white/5 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white/5 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Destinations Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
            <h4 className="font-heading font-bold text-white text-[18px] tracking-wide">
              Destinations
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Kyoto, Japan', href: '/destinations/kyoto-japan' },
                { label: 'Amalfi Coast, Italy', href: '/destinations/amalfi-coast-italy' },
                { label: 'Iceland', href: '/destinations/iceland' },
                { label: 'Bali, Indonesia', href: '/destinations/bali-indonesia' },
                { label: 'Swiss Alps', href: '/destinations/swiss-alps' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-primary transition-colors text-small">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
            <h4 className="font-heading font-bold text-white text-[18px] tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Our Services', href: '/services' },
                { label: 'About VistaLuxe', href: '/about' },
                { label: 'Contact Us', href: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-primary transition-colors text-small">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-4 space-y-6">
            <h4 className="font-heading font-bold text-white text-[18px] tracking-wide">
              Join Our Newsletter
            </h4>
            <p className="text-slate-400 text-small leading-relaxed">
              Subscribe to get curated luxury travel recommendations, secret promotions, and seasonal destination guides.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-btn px-4 py-3 text-small text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                disabled={subscribed}
              />
              <Button type="submit" variant={subscribed ? 'secondary' : 'primary'} size="sm" className="px-5 shrink-0" disabled={subscribed}>
                {subscribed ? <Check className="w-5 h-5" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-caption font-semibold animate-pulse">
                Thank you! You have successfully subscribed to our newsletter.
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-slate-500 text-caption text-center sm:text-left">
            © 2026 VistaLuxe Travel. Crafted for premium experiences. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
