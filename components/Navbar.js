'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ role = 'public' }) {
  const pathname = usePathname();
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
      { href: '/admin/login', label: 'Admin Login' },
    ],
  };

  const currentLinks = navLinks[role] || [];

  const navLinkClass = (isActive) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'text-gray-900 border-b-2 border-gray-900 bg-gray-50' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gray-900 p-2 rounded-lg">
                <svg 
                  className="h-6 w-6 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">BloodConnect</span>
                <span className="block text-xs text-gray-500">Olongapo</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {currentLinks.map(({ href, label }) => (
              <Link 
                key={href}
                href={href} 
                className={navLinkClass(isActive(href))}
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
                className="ml-3 px-4 py-2 bg-red-600 !text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 logout-btn-white"
                style={{ color: '#ffffff !important' }}
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