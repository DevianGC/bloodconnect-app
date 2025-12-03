'use client';

import { useEffect, useRef, useState } from 'react';

export default function BloodTypes() {
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

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Blood Types We Need</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Every blood type is valuable. Register today regardless of your type!
          </p>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {bloodTypes.map((type, index) => (
            <div 
              key={type}
              className={`group relative bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="text-center">
                <div className="text-xl md:text-2xl font-black text-white">{type}</div>
                <div className="text-[10px] text-red-100 font-medium hidden sm:block">Blood Type</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
