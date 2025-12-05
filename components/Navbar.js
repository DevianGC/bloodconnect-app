'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar({ role = 'public' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinks = {
    admin: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/requests', label: 'Requests' },
      { href: '/admin/donors', label: 'Donors' },
      { href: '/admin/analytics', label: 'Analytics' },
      { href: '/admin/settings', label: 'Settings' },
    ],
    donor: [
      { href: '/donor/dashboard', label: 'Dashboard' },
      { href: '/donor/profile', label: 'Profile' },
      { href: '/donor/alerts', label: 'Alerts' },
      { href: '/donor/update', label: 'Update Info' },
    ],
    public: [
      { href: '/donor/register', label: 'Become a Donor' },
      { href: '/donor/login', label: 'Donor Login' },
      { href: '/admin/login', label: 'Admin' },
    ],
  };

  const currentLinks = navLinks[role] || [];

  const handleLogout = () => {
    localStorage.removeItem('donorUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    // Clear cookie
    document.cookie = "user_role=; path=/; max-age=0";
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white shadow-md py-2' 
        : isLandingPage 
          ? 'bg-transparent py-4' 
          : 'bg-white shadow-md py-2'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              isScrolled || !isLandingPage ? 'bg-red-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className={`text-lg font-bold transition-colors duration-300 ${
              isScrolled || !isLandingPage ? 'text-gray-900' : 'text-white drop-shadow-md'
            }`}>BloodConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {currentLinks.map(({ href, label }) => (
              <Link 
                key={href}
                href={href} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(href) 
                    ? 'bg-red-600 text-white' 
                    : isScrolled || !isLandingPage
                      ? 'text-gray-700 hover:text-red-600'
                      : 'text-white hover:text-white hover:bg-white/10 drop-shadow-md'
                }`}
              >
                {label}
              </Link>
            ))}

            {(role === 'admin' || role === 'donor') && (
              <button 
                onClick={handleLogout}
                className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all ${isScrolled || !isLandingPage ? 'text-gray-700' : 'text-white'}`}
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {currentLinks.map(({ href, label }) => (
            <Link 
              key={href}
              href={href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(href) 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}

          {(role === 'admin' || role === 'donor') && (
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium mt-2"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}