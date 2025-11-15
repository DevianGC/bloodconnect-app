'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ role = 'public' }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const navLinks = {
    admin: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/requests', label: 'Requests' },
      { href: '/admin/donors', label: 'Donors' },
      { href: '/admin/analytics', label: 'Analytics' },
      { href: '/admin/settings', label: 'Settings' },
    ],
    donor: [
      { href: '/donor/profile', label: 'Profile' },
      { href: '/donor/alerts', label: 'Alerts' },
      { href: '/donor/update', label: 'Update Info' },
    ],
    public: [
      { href: '/donor/register', label: 'Become a Donor' },
      { href: '/donor/login', label: 'Donor Login' },
      { href: '/admin/login', label: 'Admin Login' },
    ],
  };

  const currentLinks = navLinks[role] || [];

  const navLinkClass = (isActive) => 
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive 
        ? 'bg-red-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-md">
                <svg 
                  className="h-7 w-7 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">BloodConnect</span>
                <span className="block text-xs text-gray-500 font-medium">Olongapo</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center space-x-2">
            {currentLinks.map(({ href, label }) => (
              <Link 
                key={href}
                href={href} 
                className={`${navLinkClass(isActive(href))} transition-all duration-200`}
              >
                {label}
              </Link>
            ))}

            {(role === 'admin' || role === 'donor') && (
              <button 
                onClick={() => {
                  alert('Logout functionality will be connected to backend');
                  window.location.href = '/';
                }}
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}