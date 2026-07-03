'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/constants/data';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section className="section-pad bg-dark-bg text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="Testimonials"
          title="Guest Stories & Journeys"
          subtitle="Discover why discerning world travelers choose VistaLuxe for their custom luxury voyages."
          className="text-white"
        />

        <div className="max-w-4xl mx-auto relative flex flex-col items-center">
          {/* Quote Icon */}
          <div className="mb-6 text-primary bg-primary/10 p-5 rounded-full">
            <Quote className="w-10 h-10 transform rotate-180" />
          </div>

          {/* Testimonial slider viewport */}
          <div className="w-full min-h-[220px] relative overflow-hidden flex justify-center items-center px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-center space-y-6"
              >
                {/* Rating */}
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 fill-current ${i < Math.floor(current.rating) ? 'text-secondary' : 'text-slate-600'}`} 
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-[20px] md:text-[24px] font-heading font-semibold leading-relaxed max-w-2xl mx-auto italic text-slate-100">
                  "{current.text}"
                </blockquote>

                {/* User Details */}
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="text-left">
                    <h4 className="font-heading font-bold text-white text-[18px]">
                      {current.name}
                    </h4>
                    <p className="text-caption text-slate-400">
                      {current.role} • {current.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={handlePrev}
              className="p-3 bg-white/5 border border-white/10 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === index ? 'bg-primary w-6' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 bg-white/5 border border-white/10 hover:bg-primary rounded-full transition-all text-slate-300 hover:text-white cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
