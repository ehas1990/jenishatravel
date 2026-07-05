'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Calendar, Users, Percent, CheckCircle2, Ticket, Landmark, ShieldAlert, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PACKAGES } from '@/constants/data';
import { formatPrice } from '@/lib/utils';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPkgId, setSelectedPkgId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const packageIdParam = searchParams.get('packageId') || '';

  // Find active package
  const activePkg = useMemo(() => {
    return PACKAGES.find((p) => p.id === selectedPkgId) || PACKAGES[0];
  }, [selectedPkgId]);

  // Sync package selection with query params after mount
  useEffect(() => {
    if (packageIdParam) {
      setSelectedPkgId(packageIdParam);
    }
  }, [packageIdParam]);

  // Price calculations
  const pricePerTraveler = activePkg.discountPrice || activePkg.price;
  const subtotal = pricePerTraveler * travelersCount;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal - discountAmount + taxes;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = coupon.toUpperCase().trim();
    if (code === 'LUXURY10') {
      setAppliedDiscount(10);
      setCouponSuccess('10% off coupon code applied successfully!');
    } else if (code === 'WANDERLUST') {
      setAppliedDiscount(15);
      setCouponSuccess('15% off coupon code applied successfully!');
    } else {
      setCouponError('Invalid coupon code. Try LUXURY10 or WANDERLUST');
      setAppliedDiscount(0);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !travelDate) return;

    // Generate random receipt number
    const receipt = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptNumber(receipt);
    setBookingConfirmed(true);

    // Trigger celebration confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  if (bookingConfirmed) {
    return (
      <div className="flex flex-col w-full pb-24 pt-12 bg-light-gray/20 font-normal">
        <Container className="max-w-2xl text-center space-y-8">
          <div className="bg-emerald-50 text-success p-6 rounded-full w-fit mx-auto border border-emerald-100 shadow-soft">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-section-title text-heading font-extrabold tracking-tight">Voyage Confirmed!</h1>
            <p className="text-body text-paragraph max-w-md mx-auto">
              Thank you for booking with VistaLuxe. Your dedicated travel curator will email the complete itinerary details within 24 hours.
            </p>
          </div>

          {/* Receipt Card */}
          <Card className="p-8 border border-border bg-white text-left space-y-6 max-w-xl mx-auto shadow-medium">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-[12px] font-bold text-paragraph uppercase tracking-wider">Booking Receipt</span>
              <Badge variant="success" className="px-3.5 py-1 text-xs font-semibold">{receiptNumber}</Badge>
            </div>

            <div className="space-y-4 text-small">
              <div className="flex justify-between">
                <span className="text-paragraph">Selected Package</span>
                <span className="font-semibold text-heading truncate max-w-[250px]">{activePkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-paragraph">Lead Traveler</span>
                <span className="font-semibold text-heading">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-paragraph">Email Contact</span>
                <span className="font-semibold text-heading">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-paragraph">Travel Date</span>
                <span className="font-semibold text-heading">{travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-paragraph">Number of Guests</span>
                <span className="font-semibold text-heading">{travelersCount} guest(s)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-2 text-caption">
              <div className="flex justify-between text-small">
                <span className="text-paragraph">Subtotal</span>
                <span className="font-semibold text-heading">{formatPrice(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 text-small">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-small">
                <span className="text-paragraph">Local Taxes</span>
                <span className="font-semibold text-heading">{formatPrice(taxes)}</span>
              </div>
              <div className="flex justify-between text-[20px] font-heading font-extrabold text-heading pt-2 border-t border-border/30">
                <span>Total Charge</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </Card>

          <div className="pt-4">
            <Button variant="primary" size="md" onClick={() => router.push('/')}>
              Return to Homepage
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-24 pt-8 bg-light-gray/20 font-normal">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h1 className="text-section-title font-extrabold text-heading leading-tight tracking-tight">Confirm Booking</h1>
              <p className="text-small text-paragraph font-normal">
                Complete traveler information to lock in your custom dates and guide support.
              </p>
            </div>

            <Card className="p-8 border border-border shadow-soft bg-white">
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                
                {/* 1. Trip details */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-[18px] text-heading flex items-center gap-2 pb-2 border-b border-border/50">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Itinerary Selection</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Package Select */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Select Package</label>
                      <select
                        value={selectedPkgId}
                        onChange={(e) => setSelectedPkgId(e.target.value)}
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        {PACKAGES.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date select */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Travelers count */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Number of Guests</label>
                      <select
                        value={travelersCount}
                        onChange={(e) => setTravelersCount(Number(e.target.value))}
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n} guest{n > 1 && 's'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <span className="text-[11px] text-paragraph leading-normal">
                        Packages include multi-guest discounts for groups of 4 or more.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Traveler Details */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-[18px] text-heading flex items-center gap-2 pb-2 border-b border-border/50">
                    <User className="w-5 h-5 text-primary" />
                    <span>Lead Traveler Profile</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter lead traveler full name"
                      className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-heading uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full bg-light-gray/40 border border-border rounded-btn px-4 py-3 text-small text-heading focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-paragraph"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Secure Booking Notice */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-caption text-amber-800 font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-secondary" />
                  <p>
                    By clicking Confirm Booking, you reserve custom lodging allocations. No immediate charges are placed on credit cards. Your curator will arrange payment links on confirmation.
                  </p>
                </div>

                {/* Submit button */}
                <Button type="submit" variant="primary" size="lg" className="w-full flex items-center justify-center space-x-2 py-4 shadow-soft font-bold">
                  <span>Confirm Reservation</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>

              </form>
            </Card>
          </div>

          {/* Right Column: Checkout Pricing Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white border border-border rounded-card p-6 md:p-8 shadow-medium space-y-6">
              
              {/* Package card summary */}
              <div className="flex gap-4 pb-4 border-b border-border/50">
                <div className="w-24 h-20 rounded-btn overflow-hidden border border-border shrink-0">
                  <img src={activePkg.images[0]} alt={activePkg.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <Badge variant="primary" className="px-2 py-0.5 text-[10px]">{activePkg.category}</Badge>
                  <h4 className="font-heading font-bold text-small text-heading truncate">{activePkg.title}</h4>
                  <span className="text-[13px] text-paragraph block">{activePkg.duration}</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4.5 h-4.5 text-primary" />
                  <span>Promo Code</span>
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g., LUXURY10, WANDERLUST"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-grow bg-light-gray/40 border border-border rounded-btn px-4 py-2.5 text-small text-heading focus:outline-none focus:border-primary placeholder-paragraph"
                  />
                  <Button type="submit" variant="outline" size="sm" className="px-4 shrink-0">Apply</Button>
                </form>
                {couponError && <p className="text-danger text-[12px] font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-success text-[12px] font-semibold">{couponSuccess}</p>}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-border/50 space-y-3 text-caption">
                <div className="flex justify-between">
                  <span className="text-paragraph">{formatPrice(pricePerTraveler)} x {travelersCount} guest(s)</span>
                  <span className="font-semibold text-heading">{formatPrice(subtotal)}</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Coupon ({appliedDiscount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-paragraph">Local Taxes & Fees (5%)</span>
                  <span className="font-semibold text-heading">{formatPrice(taxes)}</span>
                </div>

                <div className="flex justify-between text-[22px] font-heading font-extrabold text-heading pt-3 border-t border-border/30">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Guarantee highlights */}
              <div className="pt-4 border-t border-border/50 space-y-2 text-caption text-paragraph">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Free itinerary modifications up to 30 days prior.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>VIP Lounge airport access coupons included.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <p className="text-small text-paragraph font-normal">Loading booking panel...</p>
      </div>
    }>
      <BookingFormContent />
    </Suspense>
  );
}
