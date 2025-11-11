
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative text-white py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/80"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-pulse">
          <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl" style={{ color: 'white' }}>
          BloodConnect <span className="text-red-500">Olongapo</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold mb-4 text-white drop-shadow-lg" style={{ color: 'white' }}>
          Centralized Blood Donor Communication & Alert System
        </p>
        
        <p className="text-base md:text-lg mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed drop-shadow-md" style={{ color: 'white' }}>
          Connecting blood donors, hospitals, and the City Health Office to save lives through coordinated emergency response
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/donor/register" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 hover:from-red-700 hover:to-red-800 transform transition-all duration-200" style={{ color: 'white' }}
          >
            Become a Donor
          </Link>
          <Link 
            href="/donor/login" 
            className="donor-login-btn w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/80 rounded-xl font-bold text-lg hover:bg-white transition-all duration-200 shadow-xl"
          >
            Donor Login
          </Link>
        </div>
      </div>
    </section>
  );
}
