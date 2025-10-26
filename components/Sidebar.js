'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

  const getIcon = (iconName) => {
    const icons = {
      grid: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
      droplet: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
      users: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      chart: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      settings: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2m13.2-5.2l-4.2-4.2m-2-2l-4.2-4.2"/></svg>,
      user: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      bell: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
      edit: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    };
    return icons[iconName];
  };

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
