export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-2 mb-1">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-lg">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-white text-base font-bold">BloodConnect</h4>
              <p className="text-xs text-gray-400">Olongapo City</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Centralized blood donor communication and alert system for Olongapo City
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-base font-bold mb-2 border-b border-gray-700 pb-2">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/donor/register" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Become a Donor
              </a>
            </li>
            <li>
              <a href="/donor/login" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Donor Login
              </a>
            </li>
            <li>
              <a href="/admin/login" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Admin Login
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-base font-bold mb-1 border-b border-gray-700 pb-2">Contact</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>Olongapo City Health Office</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>09304433316</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>health@olongapo.gov.ph</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-base font-bold mb-1 border-b border-gray-700 pb-2">Emergency Hotline</h4>
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-3 shadow-lg">
            <p className="text-2xl font-extrabold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span>911</span>
            </p>
            <p className="text-xs text-red-100 mt-1">24/7 Emergency Response</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">
              © {currentYear} <span className="font-semibold text-gray-300">BloodConnect Olongapo</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-xs text-gray-400 hover:text-red-400 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">Made with <span className="text-red-500">♥</span> for the people of Olongapo City</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
