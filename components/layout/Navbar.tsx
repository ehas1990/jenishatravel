'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, PhoneCall } from 'lucide-react';
import { useScroll } from '@/hooks/useScroll';
import Container from './Container';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'Destination', href: '/destinations' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(20);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full',
          scrolled 
            ? 'glass-effect py-4 border-b border-border/50 shadow-soft' 
            : 'bg-transparent py-6 border-b border-transparent'
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2.5 rounded-xl text-white group-hover:bg-primary-hover transition-colors">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="font-heading font-extrabold text-[22px] tracking-wider text-heading flex flex-col leading-none">
              VISTA<span className="text-primary text-[14px] font-semibold tracking-widest mt-0.5">LUXE TRAVEL</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'font-heading font-semibold text-[15px] hover:text-primary transition-colors relative py-1.5',
                    isActive ? 'text-primary' : 'text-heading'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full origin-left"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="hidden sm:block">
              <Button variant="primary" size="sm" className="flex items-center space-x-2 shadow-soft">
                <PhoneCall className="w-4 h-4" />
                <span>Plan A Trip</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-heading bg-white hover:bg-light-gray rounded-btn border border-border transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-dark-bg/60 backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-border p-8 pt-24 shadow-hover flex flex-col justify-between"
            >
              <div className="space-y-6 flex flex-col">
                <span className="text-[12px] font-semibold text-paragraph uppercase tracking-widest border-b border-border pb-4">
                  Navigation
                </span>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'text-[20px] font-heading font-bold py-2 hover:text-primary transition-colors',
                          isActive ? 'text-primary' : 'text-heading'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4">
                <Link href="/contact" className="w-full block">
                  <Button variant="primary" size="md" className="w-full flex items-center justify-center space-x-2">
                    <PhoneCall className="w-5 h-5" />
                    <span>Plan A Trip</span>
                  </Button>
                </Link>
                <p className="text-center text-[12px] text-paragraph">
                  © 2026 VistaLuxe Travel. All rights reserved.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
