import React from 'react';
import { Compass, Sparkles, ShieldCheck, HeartHandshake, Plane, Hotel, Navigation, Ship, FileText, Briefcase, Info, BadgeHelp } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const services = [
  {
    icon: Hotel,
    title: '5-Star Lodging Curation',
    desc: 'Direct bookings with preferred partner status at Marriott Bonvoy, Belmond, and local heritage ryokans, yielding free room upgrades.'
  },
  {
    icon: Navigation,
    title: 'Chauffeured Ground Logistics',
    desc: 'Explore seamlessly in luxury vehicles. Private drivers handle your luggage and transfers across urban centers and wilderness tracks.'
  },
  {
    icon: Ship,
    title: 'Private Yacht Charters',
    desc: 'Navigate coastlines in style. Yacht rentals in Capri, Amalfi, and Bali are fully equipped with private captains, chef tables, and gear.'
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel Management',
    desc: 'Exclusive corporate retreats and executive group programs designed with proper conferencing setups and private leisure itineraries.'
  },
  {
    icon: ShieldCheck,
    title: 'Luxury Travel Insurance',
    desc: 'Comprehensive protection options covering medical emergencies, trip cancellations, gear loss, and emergency evacuations.'
  },
  {
    icon: Compass,
    title: 'Expert Guided Tours',
    desc: 'Certified local historians, naturalists, and translators who provide deep, authentic, and private commentary at heritage sites.'
  }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full pb-24 font-normal">
      {/* Banner */}
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Our Offerings</span>
          <h1 className="text-section-title font-extrabold text-white">Luxury Travel Services</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            From chartered jet flights to elite local guide bookings, discover our dedicated concierge travel services.
          </p>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="section-pad bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <Card key={idx} className="p-8 space-y-6 flex flex-col items-start bg-white border border-border">
                  <div className="p-4 bg-teal-50 text-primary rounded-2xl">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-card-title text-heading font-bold" style={{ color: '#000' }}>{svc.title}</h3>
                    <p className="text-small text-paragraph font-normal leading-relaxed">{svc.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Box */}
      <section className="section-pad bg-light-gray/40 border-t border-border/50">
        <Container className="max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 rounded-full px-4.5 py-1.5 text-caption font-bold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Tailor-Made Excellence</span>
          </div>
          <h2 className="text-section-title text-heading tracking-tight">Need a Bespoke Service Package?</h2>
          <p className="text-body text-paragraph max-w-xl mx-auto font-normal leading-relaxed">
            Our luxury travel curators are ready to help you organize a private helicopter trip, corporate retreat, or customized wedding event.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="flex items-center space-x-2 shadow-soft font-bold">
                <span>Contact Travel Designer</span>
                <Compass className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
