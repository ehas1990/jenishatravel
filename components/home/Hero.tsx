'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bus, ShieldCheck, UserCheck, Headphones, Coins, Play, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
      {/* Background Image with Zoom (Ken Burns) Effect */}
      <div className="absolute inset-0 z-0">
        {/* Mobile portrait background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 md:hidden"
          style={{ 
            backgroundImage: 'url("/mobile-jen.jpg")',
            animationName: 'kenburns'
          }}
        />
        {/* Desktop landscape background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 hidden md:block"
          style={{ 
            backgroundImage: 'url("/hero-banner.jpg")',
            animationName: 'kenburns'
          }}
        />
        <style jsx global>{`
          @keyframes kenburns {
            0% { transform: scale(1.05) translate(0px, 0px); }
            100% { transform: scale(1.12) translate(-5px, -3px); }
          }
        `}</style>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 via-transparent to-dark-bg/40" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-8 text-white my-auto">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl space-y-6"
        >
          {/* Tagline prefix */}
          <div className="text-secondary font-heading font-semibold text-caption uppercase tracking-widest flex items-center space-x-2.5">
            <span>✈</span>
            <span>Explore the world in luxury</span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-title font-extrabold leading-tight text-white">
            Travel in Style,<br />
            Arrive in <span className="text-secondary">Comfort</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body text-slate-200 max-w-xl font-normal leading-relaxed">
            Experience premium travel with luxury buses, curated tour packages and unforgettable memories.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link href="/packages">
              <Button variant="secondary" size="lg" className="flex items-center space-x-2 font-bold px-7 py-3.5 shadow-medium bg-secondary text-slate-950 hover:bg-amber-600 border-none shrink-0 rounded-btn">
                <span>EXPLORE PACKAGES</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <button className="flex items-center space-x-3 text-white hover:text-secondary transition-colors font-heading font-semibold text-small cursor-pointer group">
              <span className="w-12 h-12 flex items-center justify-center border border-white/30 rounded-full group-hover:border-secondary transition-colors">
                <Play className="w-5 h-5 fill-current text-white group-hover:text-secondary transition-colors ml-0.5" />
              </span>
              <span>WATCH VIDEO</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Features Banner Overlay */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="glass-dark-effect rounded-[24px] p-6 lg:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 text-white shadow-medium bg-slate-950/60 border border-white/10"
        >
          {/* Feature 1 */}
          <div className="flex items-start space-x-4">
            <div className="text-secondary bg-white/5 p-3 rounded-2xl shrink-0">
              <Bus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-small text-white leading-tight">Luxury Buses</h4>
              <p className="text-[13px] text-slate-300 font-normal">Premium & Comfortable</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start space-x-4">
            <div className="text-secondary bg-white/5 p-3 rounded-2xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-small text-white leading-tight">Safe & Secure</h4>
              <p className="text-[13px] text-slate-300 font-normal">Your Safety Our Priority</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start space-x-4">
            <div className="text-secondary bg-white/5 p-3 rounded-2xl shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-small text-white leading-tight">Expert Drivers</h4>
              <p className="text-[13px] text-slate-300 font-normal">Experienced & Friendly</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start space-x-4">
            <div className="text-secondary bg-white/5 p-3 rounded-2xl shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-small text-white leading-tight">24/7 Support</h4>
              <p className="text-[13px] text-slate-300 font-normal">We're Always Here</p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex items-start space-x-4 col-span-2 md:col-span-1">
            <div className="text-secondary bg-white/5 p-3 rounded-2xl shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-small text-white leading-tight">Best Price</h4>
              <p className="text-[13px] text-slate-300 font-normal">Quality at Best Price</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
