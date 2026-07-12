'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Award, Zap, Gauge, Users, Trophy, ChevronRight, Star, Calendar, Palette } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { vehicleService } from '@/services/api';

const TESTIMONIALS = [
  {
    name: 'Paras Shah',
    role: 'Venture Capitalist',
    content: 'AutoMoto completely redefined my car-buying experience. The transparency, prompt service, and collection of high-performance models are second to none.',
    rating: 5,
  },
  {
    name: 'Nirav Doshi',
    role: 'Chief Medical Officer',
    content: 'The custom order service was seamless. They acquired my AMG GT R and delivered it straight to my estate. Absolute class and professional service.',
    rating: 5,
  },
  {
    name: 'Viral Mehta',
    role: 'Tech Founder',
    content: 'Excellent inventory management system. Being able to browse, review specifications, and secure the vehicle from the dashboard makes this a highly premium service.',
    rating: 5,
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await vehicleService.getFeaturedVehicles();
        if (res.success && res.data?.length > 0) {
          setFeaturedCars(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    if (featuredCars.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredCars]);

  useEffect(() => {
    setMounted(true);
    const played = sessionStorage.getItem('automoto_intro_played') === 'true';
    if (!played) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('automoto_intro_played', 'true');
      }, 4200); // 4.2 seconds intro animation
      return () => clearTimeout(timer);
    }
  }, []);

  const handleExploreClick = (e) => {
    e.preventDefault();
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {mounted && showIntro ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Glow backdrop particles */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF6500]/10 blur-[120px] animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          </div>

          {/* Speedometer SVG stroke drawing */}
          <div className="z-10 mb-8 relative flex items-center justify-center w-64 h-32">
            <svg className="w-full h-full text-zinc-900" viewBox="0 0 200 100">
              <path
                d="M20,90 A80,80 0 0,1 180,90"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.path
                d="M20,90 A80,80 0 0,1 180,90"
                fill="none"
                stroke="#FF6500"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
              />
              <motion.line
                x1="100"
                y1="90"
                x2="40"
                y2="40"
                stroke="#FF6500"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{ originX: '100px', originY: '90px' }}
                initial={{ rotate: -60 }}
                animate={{ rotate: [-60, 60, -60, 0] }}
                transition={{ duration: 3.5, ease: 'easeInOut', times: [0, 0.45, 0.8, 1], delay: 0.2 }}
              />
            </svg>
          </div>

          {/* Pulsing brand logo text */}
          <div className="z-10 flex flex-col items-center text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="flex flex-col items-center space-y-1"
            >
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic uppercase text-white leading-none">
                Auto<span className="text-accent">Moto</span>
              </h1>
              <p className="text-xs tracking-[0.45em] text-zinc-400 font-bold uppercase mt-1">
                Drive Your Dreams
              </p>
            </motion.div>

            {/* Premium Loading Progress Streak line */}
            <div className="w-48 h-0.5 bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 3.8, ease: 'easeInOut', repeat: 0 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#FF6500] to-transparent"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col overflow-x-hidden bg-brand-bg text-brand-text"
        >
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
      <section id="featured" className="py-24 px-4 sm:px-10 lg:px-16 w-full scroll-mt-12">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Exclusive Showroom</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-text">Featured Masterpieces</p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {featuredLoading ? (
          <div className="h-96 rounded-3xl bg-brand-card/40 border border-brand-border flex items-center justify-center animate-pulse">
            <span className="text-sm text-brand-muted">Fetching masterpieces...</span>
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="py-20 text-center text-brand-muted text-sm font-light">
            No premium vehicles available in the showroom currently.
          </div>
        ) : (
          <div className="relative rounded-3xl border border-brand-border bg-brand-card hover:border-[#FF6500]/25 overflow-hidden shadow-2xl p-6 sm:p-10 min-h-[500px] flex flex-col xl:flex-row items-center gap-8 xl:gap-12 w-full transition-all duration-300">
            
            {/* Carousel Navigation Arrow Buttons */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? featuredCars.length - 1 : prev - 1))}
              className="absolute left-4 z-25 p-3 bg-black/75 border border-zinc-800 rounded-xl hover:bg-[#FF6500] hover:border-[#FF6500] text-white hover:text-black transition-all cursor-pointer hidden sm:block shadow-lg"
            >
              <ChevronRight className="h-5 w-5 transform rotate-180" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredCars.length)}
              className="absolute right-4 z-25 p-3 bg-black/75 border border-zinc-800 rounded-xl hover:bg-[#FF6500] hover:border-[#FF6500] text-white hover:text-black transition-all cursor-pointer hidden sm:block shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Left Column: Image Slideshow Frame */}
            <div className="w-full xl:w-[55%] h-72 sm:h-96 xl:h-[500px] relative rounded-2xl overflow-hidden bg-white border border-brand-border/60 group shrink-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featuredCars[currentIndex].VehicleId}
                  src={featuredCars[currentIndex].ImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
                  alt={`${featuredCars[currentIndex].Make} ${featuredCars[currentIndex].Model}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
            </div>

            {/* Right Column: Dynamic Spec Details */}
            <div className="w-full xl:w-[45%] space-y-6 flex flex-col justify-between h-full flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredCars[currentIndex].VehicleId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                        {featuredCars[currentIndex].CategoryName}
                      </span>
                      <span className="text-[#FF6500] text-xl font-black">
                        ${parseFloat(featuredCars[currentIndex].Price).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-brand-text mt-2 leading-none tracking-tight">
                      {featuredCars[currentIndex].Make} {featuredCars[currentIndex].Model}
                    </h3>
                  </div>

                  {/* Specs Glass Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-1">
                      <div className="p-2 rounded-lg bg-[#FF6500]/10 text-[#FF6500]">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <span className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold block">Year</span>
                        <p className="text-sm font-extrabold text-brand-text break-words whitespace-normal">{featuredCars[currentIndex].ManufactureYear}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-1">
                      <div className="p-2 rounded-lg bg-[#FF6500]/10 text-[#FF6500]">
                        <Palette className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <span className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold block">Color</span>
                        <p className="text-sm font-extrabold text-brand-text break-words whitespace-normal">{featuredCars[currentIndex].Color || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block mb-1">Overview</span>
                    <p className="text-sm text-brand-muted leading-relaxed font-light line-clamp-4">
                      {featuredCars[currentIndex].Description || 'Experience pure performance. This masterpiece represents the standard of engineering design, crafted to deliver unmatched speed, elegance, and handling.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FF6500] to-amber-500 hover:from-[#ff761a] hover:to-amber-600 text-white font-extrabold py-3.5 px-8 rounded-xl transition-all text-sm shadow-lg shadow-[#FF6500]/25 active:scale-[0.98] w-full sm:w-auto justify-center"
                    >
                      <span>Inquire Vehicle</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Dot Navigators */}
              <div className="flex items-center space-x-2.5 pt-4">
                {featuredCars.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex ? 'w-8 bg-[#FF6500]' : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
