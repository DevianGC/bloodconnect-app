'use client';

import { useEffect, useRef, useState } from 'react';

export default function Stats({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: data?.donors || '500+', label: 'Registered Donors' },
    { value: data?.livesSaved || '150+', label: 'Lives Saved' },
    { value: data?.hospitals || '4', label: 'Partner Hospitals' },
    { value: data?.emergency || '24/7', label: 'Emergency Response' }
  ];

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/85"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Impact</h2>
          <p className="text-sm text-white/70">Making a difference in Olongapo City</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-105">
                <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-medium text-white/80">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
