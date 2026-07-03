'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';

const offices = [
  {
    city: 'New York Headquarters',
    address: '600 Fifth Avenue, Suite 1400, New York, NY 10020',
    phone: '+1 (800) 555-0199',
    email: 'nyc@vistaluxe-travel.com'
  },
  {
    city: 'Tokyo Office',
    address: 'Gionmachi Minamigawa, Higashiyama Ward, Kyoto 605-0074',
    phone: '+81 (3) 5555-0144',
    email: 'tokyo@vistaluxe-travel.com'
  },
  {
    city: 'Milan Office',
    address: 'Via Montenapoleone 8, 20121 Milano, Italy',
    phone: '+39 (02) 555-0188',
    email: 'milan@vistaluxe-travel.com'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
  };

  return (
    <div className="flex flex-col w-full pb-24 font-normal">
      {/* Banner */}
      <section className="relative py-24 bg-dark-bg text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        
        <Container className="relative z-10 space-y-4">
          <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">Connect with us</span>
          <h1 className="text-section-title font-extrabold text-white">Contact Travel Curator</h1>
          <p className="text-body text-slate-300 max-w-xl mx-auto">
            Ready to design a custom voyage? Reach out to our design consultants to start planning.
          </p>
        </Container>
      </section>

      {/* Main Grid: Form and Info */}
      <section className="section-pad bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Form Block */}
            <div className="lg:col-span-7">
              <Card className="p-8 border border-border shadow-soft bg-white">
                {submitted ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="bg-emerald-50 text-success p-5 rounded-full w-fit mx-auto border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-card-title text-heading font-bold">Inquiry Sent Successfully!</h3>
                      <p className="text-small text-paragraph max-w-sm mx-auto font-normal">
                        Our luxury travel curator will review your destination details and reach out within 24 hours.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-card-title text-heading font-bold">Plan Your Itinerary</h3>
                      <p className="text-caption text-paragraph">
                        Provide your traveler specifications and we will assign a dedicated planner to your itinerary.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email"
                          className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone"
                          className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Preferred Destination</label>
                        <select
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Destination</option>
                          <option value="Kyoto">Kyoto, Japan</option>
                          <option value="Amalfi">Amalfi Coast, Italy</option>
                          <option value="Iceland">Iceland</option>
                          <option value="Bali">Bali, Indonesia</option>
                          <option value="Swiss">Swiss Alps</option>
                          <option value="Paris">Paris, France</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Describe Your Vision</label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your dates, group size, and interests..."
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph resize-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" size="md" className="w-full flex items-center justify-center space-x-2 py-3.5 shadow-soft">
                      <Send className="w-4.5 h-4.5" />
                      <span>Submit Request</span>
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h3 className="text-card-title text-heading font-extrabold">Concierge Details</h3>
                <p className="text-small text-paragraph leading-relaxed">
                  Call or email our central line if you need fast support with bookings or cancellations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-teal-50 text-primary p-3.5 rounded-2xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-paragraph uppercase tracking-wider block">Central Phone Line</span>
                    <span className="font-heading font-semibold text-heading text-small">+1 (800) 555-0199</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-teal-50 text-primary p-3.5 rounded-2xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-paragraph uppercase tracking-wider block">Central Email Address</span>
                    <span className="font-heading font-semibold text-heading text-small">concierge@vistaluxe-travel.com</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-teal-50 text-primary p-3.5 rounded-2xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-paragraph uppercase tracking-wider block">Concierge Hours</span>
                    <span className="font-heading font-semibold text-heading text-small">Monday – Sunday • 24 Hours Standby</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Global Offices Section */}
      <section className="section-pad bg-light-gray/40 border-t border-border/50">
        <Container>
          <SectionHeading
            badge="Our Offices"
            title="VistaLuxe Office Addresses"
            subtitle="Visit our designers in person at our central city locations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <Card key={idx} className="p-8 space-y-4 bg-white border border-border flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-[18px] text-heading">{office.city}</h4>
                  <div className="flex items-start space-x-2 pt-2">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-small text-paragraph leading-relaxed font-normal">{office.address}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50 space-y-2 text-caption">
                  <div className="flex justify-between">
                    <span className="text-paragraph">Phone</span>
                    <span className="font-semibold text-heading">{office.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-paragraph">Email</span>
                    <span className="font-semibold text-primary">{office.email}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Google Map Mockup */}
      <section className="section-pad bg-white">
        <Container>
          <div className="aspect-[16/6] bg-slate-900 rounded-[32px] overflow-hidden border border-border relative flex items-center justify-center text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200")' }}
            />
            <div className="relative z-10 text-center space-y-4 max-w-sm p-4">
              <MapPin className="w-12 h-12 text-secondary mx-auto animate-pulse" />
              <h3 className="font-heading font-bold text-[22px]">Office Location Navigation</h3>
              <p className="text-caption text-slate-300 font-normal">
                Maps and routing coordinates are active. Request shuttle pickup via phone panel.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
