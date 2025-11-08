'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getIcon } from '../lib/getIcon';

export default function Sidebar({ role = 'admin' }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => pathname === path;

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
    { href: '/admin/requests', label: 'Blood Requests', icon: 'droplet' },
    { href: '/admin/donors', label: 'Donors', icon: 'users' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'chart' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  const donorLinks = [
    { href: '/donor/profile', label: 'My Profile', icon: 'user' },
    { href: '/donor/alerts', label: 'Alerts', icon: 'bell' },
    { href: '/donor/update', label: 'Update Info', icon: 'edit' },
  ];

  const links = role === 'admin' ? adminLinks : donorLinks;

  return (
    <aside 
      className={`
        bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 h-[calc(100vh-5rem)] sticky top-20 transition-all duration-300 ease-in-out overflow-hidden shadow-sm
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <button 
        className="w-full p-4 border-b border-gray-200 flex items-center justify-center hover:bg-red-50 transition-all duration-200 group"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isCollapsed ? 
            <path d="M9 18l6-6-6-6"/> : 
            <path d="M15 18l-6-6 6-6"/>
          }
        </svg>
      </button>

      <div className="py-4 px-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200 group
              ${isActive(link.href) 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-200' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:shadow-md'
              }
            `}
          >
            <span className="flex-shrink-0 transition-transform group-hover:scale-110">{getIcon(link.icon)}</span>
            {!isCollapsed && <span className="ml-3 text-sm font-semibold">{link.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}