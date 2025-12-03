'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/80 to-black/85"></div>
      
      <div className={`relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Save Lives?
        </h2>
        <p className="text-base md:text-lg text-white/80 mb-8">
          Join our community of blood donors and be a hero when it matters most
        </p>
        <Link 
          href="/donor/register" 
          className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Register Now
        </Link>
      </div>
    </section>
  );
}
