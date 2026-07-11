'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Award, Zap, Gauge, Users, Trophy, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// High-quality premium vehicle showcase
const FEATURED_CARS = [
  {
    id: 1,
    make: 'Porsche',
    model: '911 Carrera GTS',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    price: '$142,600',
    specs: { hp: '473 HP', zeroToSixty: '3.2s', type: 'Gasoline' },
  },
  {
    id: 2,
    make: 'Tesla',
    model: 'Model S Plaid',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    price: '$89,990',
    specs: { hp: '1,020 HP', zeroToSixty: '1.99s', type: 'Electric' },
  },
  {
    id: 3,
    make: 'Mercedes-Benz',
    model: 'AMG GT R',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    price: '$165,000',
    specs: { hp: '577 HP', zeroToSixty: '3.5s', type: 'Gasoline' },
  },
  {
    id: 4,
    make: 'Audi',
    model: 'R8 V10 Performance',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800',
    price: '$196,800',
    specs: { hp: '602 HP', zeroToSixty: '3.1s', type: 'Gasoline' },
  },
  {
    id: 5,
    make: 'BMW',
    model: 'M8 Competition Gran Coupe',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    price: '$134,100',
    specs: { hp: '617 HP', zeroToSixty: '3.0s', type: 'Gasoline' },
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Vance',
    role: 'Venture Capitalist',
    content: 'AutoMoto completely redefined my car-buying experience. The transparency, prompt service, and collection of high-performance models are second to none.',
    rating: 5,
  },
  {
    name: 'Dr. Helena Rostova',
    role: 'Chief Medical Officer',
    content: 'The custom order service was seamless. They acquired my AMG GT R and delivered it straight to my estate. Absolute class and professional service.',
    rating: 5,
  },
  {
    name: 'Arthur Pendelton',
    role: 'Tech Founder',
    content: 'Excellent inventory management system. Being able to browse, review specifications, and secure the vehicle from the dashboard makes this a highly premium service.',
    rating: 5,
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const handleExploreClick = (e) => {
    e.preventDefault();
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-brand-bg text-brand-text">
      <Navbar />

      {/* Hero Section with premium background image */}
      <section
        className="relative min-h-screen flex items-center pt-24 pb-16 text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/hero_background_car.jpg')" }}
      >
        {/* Dark left gradient overlay to blend background text and highlight typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-start justify-center text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-1"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter italic uppercase leading-none">
              Auto<span className="text-accent">Moto</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-slate-100 italic uppercase">
              Drive Your Dreams
            </p>
          </motion.div>

          {/* Divider bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 w-20 bg-accent origin-left"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300"
          >
            Premium Cars. <span className="text-accent">Premium Experience.</span>
          </motion.p>

          {/* Skewed Explore Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4"
          >
            <button
              onClick={handleExploreClick}
              className="transform -skew-x-12 bg-accent hover:bg-accent/90 text-black font-extrabold text-sm tracking-wider uppercase px-8 py-3.5 shadow-lg shadow-accent/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span className="transform skew-x-12 block">
                Explore Now
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Vehicles Showcase */}
      <section id="featured" className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl scroll-mt-12">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Exclusive Showroom</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-text">Featured Masterpieces</p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CARS.map((car, idx) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden shadow-md group transition-all duration-300"
            >
              {/* Image with zoom effect */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-dark-bg/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-accent/40 text-accent text-sm font-extrabold tracking-wide">
                  {car.price}
                </div>
              </div>

              {/* Detail body */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{car.make}</span>
                  <h3 className="text-xl font-bold text-brand-text mt-0.5">{car.model}</h3>
                </div>

                {/* Grid specs */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-brand-border/60 py-3 text-center">
                  <div>
                    <div className="text-[10px] text-brand-muted uppercase font-medium">Power</div>
                    <div className="text-xs font-bold text-brand-text mt-0.5">{car.specs.hp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-brand-muted uppercase font-medium">0-60 mph</div>
                    <div className="text-xs font-bold text-brand-text mt-0.5">{car.specs.zeroToSixty}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-brand-muted uppercase font-medium">Engine</div>
                    <div className="text-xs font-bold text-brand-text mt-0.5">{car.specs.type}</div>
                  </div>
                </div>

                {/* CTAs */}
                <Link
                  href="/login"
                  className="w-full bg-black text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 hover:bg-black/90 transition-colors text-sm shadow active:scale-95"
                >
                  <span>Inquire Vehicle</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose AutoMoto (Service USP) */}
      <section id="about" className="py-24 bg-dark-bg text-dark-text scroll-mt-12 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Uncompromising Standards</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">Why Select AutoMoto</p>
            <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-dark-card p-8 rounded-2xl border border-dark-border space-y-4 hover:border-accent/45 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Certified Heritage</h3>
              <p className="text-sm text-dark-muted">Every car is vetted through strict mechanical and background reviews, receiving a Certified Performance badge.</p>
            </div>

            <div className="bg-dark-card p-8 rounded-2xl border border-dark-border space-y-4 hover:border-accent/45 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Secure Transactions</h3>
              <p className="text-sm text-dark-muted">Complete secure purchase workflows with clear digital transaction history and automatic receipt generation.</p>
            </div>

            <div className="bg-dark-card p-8 rounded-2xl border border-dark-border space-y-4 hover:border-accent/45 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Real-time Catalog</h3>
              <p className="text-sm text-dark-muted">Live inventory check. Filter options, restock speeds, and quantity details are constantly updated.</p>
            </div>

            <div className="bg-dark-card p-8 rounded-2xl border border-dark-border space-y-4 hover:border-accent/45 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Precision Delivery</h3>
              <p className="text-sm text-dark-muted">Concierge delivery directly to your garage. White-glove transportation services across the country.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Statistics */}
      <section className="py-20 bg-brand-bg transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-brand-border/60 pb-16">
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-text tracking-tight">120+</div>
              <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Premium Models</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-accent tracking-tight">99.4%</div>
              <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Client Satisfaction</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-text tracking-tight">12M+</div>
              <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Inventory Value ($)</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-accent tracking-tight">15k+</div>
              <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Deliveries Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-bg transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Elite Reviews</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-text">Client Testimonials</p>
            <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((test, idx) => (
              <div
                key={idx}
                className="bg-brand-card border border-brand-border p-8 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex text-amber-400">
                    {Array.from({ length: test.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-brand-text/90 line-clamp-4">
                    &ldquo;{test.content}&rdquo;
                  </p>
                </div>
                <div>
                  <div className="h-0.5 w-8 bg-brand-border mb-3" />
                  <h4 className="text-sm font-bold text-brand-text">{test.name}</h4>
                  <p className="text-[11px] text-brand-muted uppercase tracking-wide font-medium mt-0.5">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-dark-bg text-dark-text relative overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,101,0,0.12),transparent_45%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Drive the <span className="gold-text-gradient">Extraordinary</span>?
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-dark-muted font-light leading-relaxed">
            Create an account today to browse our fully updated real-time car listings, filter by technical options, and securely purchase your dream vehicle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl gold-gradient text-white font-bold px-8 py-3.5 hover:opacity-90 transition-opacity flex items-center justify-center text-sm"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border border-dark-border bg-dark-card/60 backdrop-blur px-8 py-3.5 hover:bg-dark-card transition-colors flex items-center justify-center text-sm"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
