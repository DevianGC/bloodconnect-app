'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 500);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center"
          style={{ transform: `scale(${1 + scrollY * 0.0003})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div 
        className="relative z-10 w-full max-w-4xl mx-auto px-6 py-32 text-center"
        style={{ opacity, transform: `translateY(${scrollY * 0.15}px)` }}
      >
        {/* Animated Heart */}
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-white p-5 rounded-full shadow-2xl">
              <svg 
                className="w-12 h-12 text-red-500 animate-[heartbeat_1.5s_ease-in-out_infinite]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
            <span className="text-white">Blood</span>
            <span className="text-red-500">Connect</span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-light text-white/90 mb-6">
            Olongapo City
          </p>
        </div>
        
        {/* Tagline */}
        <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-red-400 text-lg md:text-xl font-semibold mb-4">
            Centralized Blood Donor Communication & Alert System
          </p>
          
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Connecting blood donors, hospitals, and the City Health Office to save lives through coordinated emergency response.
          </p>
        </div>
        
        {/* Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/donor/register" 
            className="px-8 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-600/30"
          >
            Become a Donor
          </Link>
          
          <Link 
            href="/donor/login" 
            className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-full font-semibold border border-white/20 hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
        
        {/* Stats */}
        <div className={`grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
            <div className="text-sm text-white/60">Donors</div>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-white">1,200+</div>
            <div className="text-sm text-white/60">Lives Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
            <div className="text-sm text-white/60">Support</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300"
        style={{ opacity: opacity > 0.5 ? 1 : 0 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}