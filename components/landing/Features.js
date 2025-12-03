'use client';

import { useEffect, useRef, useState } from 'react';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Register as Donor",
      description: "Sign up with your blood type, contact information, and location to join our donor network",
      color: "from-red-500 to-red-600",
      step: "01"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: "Hospital Requests",
      description: "Hospitals submit urgent blood requests through the City Health Office portal",
      color: "from-blue-500 to-blue-600",
      step: "02"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      title: "Instant Alerts",
      description: "Matching donors receive immediate email and SMS alerts for emergency blood needs",
      color: "from-amber-500 to-orange-600",
      step: "03"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: "Save Lives",
      description: "Respond quickly to help patients in need and make a difference in your community",
      color: "from-emerald-500 to-green-600",
      step: "04"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 mb-3">
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How It <span className="text-red-600">Works</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Join our life-saving network in four simple steps
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mt-4"></div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-gray-50 hover:bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-md">
                {feature.step}
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                <div className="w-6 h-6 text-white">{feature.icon}</div>
              </div>
              
              {/* Content */}
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Connection lines (desktop only) */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10"></div>
      </div>
    </section>
  );
}
