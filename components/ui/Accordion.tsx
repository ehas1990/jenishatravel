'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultOpenId?: string | number;
}

export default function Accordion({ items, className, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId ?? null);

  const toggle = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div 
            key={item.id} 
            className="border border-border rounded-card overflow-hidden bg-white shadow-soft transition-all duration-300"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-light-gray/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-semibold text-heading text-[18px] md:text-[20px]">
                {item.title}
              </span>
              <ChevronDown 
                className={cn(
                  'w-5 h-5 text-paragraph transition-transform duration-300',
                  isOpen && 'transform rotate-180 text-primary'
                )} 
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-0 border-t border-border/50 text-paragraph text-small md:text-body">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
