import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar role="public" />
      
      <main className="min-h-screen">
        {/* Hero Section */}
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

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Register as Donor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sign up with your blood type, contact information, and location to join our donor network
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hospital Requests</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hospitals submit urgent blood requests through the City Health Office
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Alerts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Matching donors receive immediate email alerts for emergency blood needs
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Save Lives</h3>
                <p className="text-gray-600 leading-relaxed">
                  Respond quickly to help patients in need and make a difference in your community
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative overflow-hidden text-white">
          {/* Background Image */}
          <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
          {/* Dark Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/80"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'white' }}>Our Impact</h2>
              <p className="text-gray-100 text-lg">Making a difference in Olongapo City</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>500+</div>
                  <div className="text-lg font-medium" style={{ color: 'white' }}>Registered Donors</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>150+</div>
                  <div className="text-lg font-medium" style={{ color: 'white' }}>Lives Saved</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>4</div>
                  <div className="text-lg font-medium" style={{ color: 'white' }}>Partner Hospitals</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>24/7</div>
                  <div className="text-lg font-medium" style={{ color: 'white' }}>Emergency Response</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blood Types Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Blood Types We Need</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every blood type is valuable. Register today regardless of your type!
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"  style={{ color: 'white' }}>
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type, index) => (
                <div 
                  key={type} 
                  className="group relative bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">{type}</div>
                    <div className="text-xs text-red-100 font-medium">Blood Type</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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

        {/* Info Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Important Information</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Eligibility Requirements</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Age 18-65 years old</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Weight at least 110 lbs (50 kg)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>In good health</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>No recent illnesses or infections</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Donation Frequency</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Wait 8 weeks (56 days) between donations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Maximum 6 donations per year</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>System tracks your eligibility automatically</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Privacy & Data</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Your information is secure and confidential</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Only used for emergency blood requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>You can opt out of alerts anytime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Compliant with Data Privacy Act</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
