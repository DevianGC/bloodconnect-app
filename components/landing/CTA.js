
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/75 to-black/80"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl"  style={{ color: 'white' }}>
          Ready to Save Lives?
        </h2>
        <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed drop-shadow-lg" style={{ color: 'white' }}>
          Join our community of blood donors and be a hero when it matters most
        </p>
        <Link 
          href="/donor/register" 
          className="inline-block px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:from-red-700 hover:to-red-800 transform transition-all duration-200"  style={{ color: 'white' }}
        >
          Register Now
        </Link>
      </div>
    </section>
  );
}
