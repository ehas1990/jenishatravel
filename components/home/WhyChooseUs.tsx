import React from 'react';
import { Sparkles, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';

const featureList = [
  {
    icon: Compass,
    title: 'Curated Local Expertise',
    description: 'We partner with local guides and certified historians who unveil hidden alleys, private temples, and secret dining spots.'
  },
  {
    icon: Sparkles,
    title: '5-Star Accommodations',
    description: 'From luxury ryokans in Kyoto to award-winning cliffside villas in Positano, our hotels are handpicked for design and hospitality.'
  },
  {
    icon: ShieldCheck,
    title: '24/7 Personal Concierge',
    description: 'A dedicated travel coordinator stays on call throughout your journey to manage booking changes, custom requests, or emergencies.'
  },
  {
    icon: HeartHandshake,
    title: 'Seamless Tailor-Made Trips',
    description: 'Every itinerary is 100% customizable. You tell us your interest, pacing, and style, and we craft a flawless personal journey.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="section-pad bg-light-gray/40">
      <Container>
        <SectionHeading
          badge="Why VistaLuxe"
          title="Elevating Your Travel Experience"
          subtitle="We go beyond standard itineraries to craft rare, deeply personalized, and luxury journeys."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureList.map((feature, i) => {
            const IconComp = feature.icon;
            return (
              <Card key={i} className="p-8 space-y-6 flex flex-col items-start bg-white border border-border/50">
                <div className="bg-teal-50 p-4 rounded-2xl text-primary">
                  <IconComp className="w-8 h-8" />
                </div>
                <h3 className="text-card-title text-heading font-bold">
                  {feature.title}
                </h3>
                <p className="text-small text-paragraph font-normal leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
