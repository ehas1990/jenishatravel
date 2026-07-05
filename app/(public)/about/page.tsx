import React from 'react';
import { Sparkles, Compass, ShieldCheck, HeartHandshake, History, Award, Users } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const milestones = [
  { year: '2012', title: 'Agency Founded', desc: 'Started in New York with a team of three travel designers covering Italy and France.' },
  { year: '2016', title: 'Asian Expansion', desc: 'Opened a regional headquarters in Tokyo, Japan, securing custom access to temples in Kyoto.' },
  { year: '2020', title: 'Private Logistics Launch', desc: 'Partnered with regional aviation and yacht charters to facilitate private transfers.' },
  { year: '2025', title: 'Sustainable Luxury Award', desc: 'Recognized globally for eco-friendly resort collaborations and carbon-offsetting partnerships.' }
];

const teamMembers = [
  {
    name: 'Alexander Sterling',
    role: 'Managing Director & Founder',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300',
    bio: 'Spent 18 years exploring remote regions. Alexander designs our high-end European coastal itineraries.'
  },
  {
    name: 'Aiko Tanaka',
    role: 'Principal Designer - Asia Pacific',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300',
    bio: 'Kyoto native with deep connections. Aiko secures exclusive tea masters and temple accesses for our guests.'
  },
  {
    name: 'Björn Sigurdsson',
    role: 'Lead Adventure Guide - Nordic',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300',
    bio: 'Glaciologist and climber. Björn guides our private snow-jeep treks and ice-cave expeditions in Iceland.'
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-24 font-normal">
      {/* Banner */}
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Our Heritage</span>
          <h1 className="text-section-title font-extrabold text-white">The VistaLuxe Story</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            A premium agency creating rare, customized, and beautiful journeys for discerning global citizens.
          </p>
        </Container>
      </section>

      {/* Story & Achievements */}
      <section className="section-pad bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[12px] font-bold text-primary uppercase tracking-widest">About Our Agency</span>
              <h2 className="text-section-title text-heading tracking-tight">Designing Rare Encounters</h2>
              <p className="text-body text-paragraph leading-relaxed">
                VistaLuxe was founded on a simple premise: travel should be rare, beautiful, and deeply personal. We rejects generic packages and cookie-cutter tourist trails. Instead, we assemble custom voyages.
              </p>
              <p className="text-small text-paragraph leading-relaxed">
                Over the past 14 years, our team has built direct networks with local aristocrats, villa owners, private captains, and cultural guardians. This enables us to orchestrate moments that are otherwise inaccessible.
              </p>
            </div>
            
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Award, label: 'Bespoke Awards', val: '12' },
                  { icon: Users, label: 'Local Specialists', val: '45+' },
                  { icon: History, label: 'Years Experience', val: '14' },
                  { icon: Compass, label: 'Countries Covered', val: '30+' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Card key={idx} className="p-8 text-center bg-light-gray/40 border border-border/50 flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-teal-50 text-primary rounded-xl">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[36px] font-heading font-extrabold text-heading leading-none">{item.val}</span>
                      <span className="text-caption text-paragraph font-semibold uppercase tracking-wider">{item.label}</span>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad bg-light-gray/40 border-y border-border/50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="p-8 space-y-4 bg-white border border-border">
              <div className="p-3 bg-teal-50 text-primary rounded-2xl w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-card-title font-extrabold text-heading">Our Mission</h3>
              <p className="text-small text-paragraph leading-relaxed font-normal">
                To liberate travelers from the ordinary by crafting custom, all-inclusive journeys that respect local traditions, support local heritage economies, and rejuvenate the traveler’s soul.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-white border border-border">
              <div className="p-3 bg-amber-50 text-secondary rounded-2xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-card-title font-extrabold text-heading">Our Vision</h3>
              <p className="text-small text-paragraph leading-relaxed font-normal">
                To remain the global benchmark for bespoke luxury travel, championing deep cultural curiosity, ecological stewardship, and high-touch concierge hospitality.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="section-pad bg-white">
        <Container>
          <SectionHeading
            badge="Milestones"
            title="Our Journey Over Time"
            subtitle="Follow the key highlights and structural expansions of VistaLuxe Travel."
          />

          <div className="relative max-w-4xl mx-auto border-l-2 border-border pl-6 space-y-12">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-primary border-4 border-white shadow-soft" />
                
                <div className="space-y-2">
                  <Badge variant="secondary" className="px-3 py-0.5 text-xs font-bold font-heading">{ms.year}</Badge>
                  <h3 className="font-heading font-extrabold text-[20px] text-heading">{ms.title}</h3>
                  <p className="text-small text-paragraph max-w-xl font-normal leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="section-pad bg-light-gray/40 border-t border-border/50">
        <Container>
          <SectionHeading
            badge="Our Experts"
            title="Meet Our Travel Designers"
            subtitle="Our curators have spent decades mapping destinations, forging local alliances, and refining itineraries."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((team, idx) => (
              <Card key={idx} className="flex flex-col bg-white border border-border group overflow-hidden">
                <div className="h-72 overflow-hidden relative">
                  <img
                    src={team.avatar}
                    alt={team.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-[18px] text-heading group-hover:text-primary transition-colors">
                      {team.name}
                    </h4>
                    <p className="text-caption text-primary font-semibold uppercase tracking-wider">
                      {team.role}
                    </p>
                  </div>
                  <p className="text-caption text-paragraph leading-relaxed font-normal">
                    {team.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
