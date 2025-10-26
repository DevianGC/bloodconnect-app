export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-lg">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold">BloodConnect</h4>
              <p className="text-xs text-gray-400">Olongapo City</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Centralized blood donor communication and alert system for Olongapo City
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-lg font-bold mb-2 border-b border-gray-700 pb-2">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="/donor/register" className="hover:text-red-400 transition-colors flex items-center group">
              <span className="mr-2 text-red-500 group-hover:translate-x-1 transition-transform">→</span>
              Become a Donor
            </a></li>
            <li><a href="/donor/login" className="hover:text-red-400 transition-colors flex items-center group">
              <span className="mr-2 text-red-500 group-hover:translate-x-1 transition-transform">→</span>
              Donor Login
            </a></li>
            <li><a href="/admin/login" className="hover:text-red-400 transition-colors flex items-center group">
              <span className="mr-2 text-red-500 group-hover:translate-x-1 transition-transform">→</span>
              Admin Login
            </a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-lg font-bold mb-2 border-b border-gray-700 pb-2">Contact</h4>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span>📍</span>
              <span>Olongapo City Health Office</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>(047) 222-XXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span>
              <span>health@olongapo.gov.ph</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-lg font-bold mb-2 border-b border-gray-700 pb-2">Emergency Hotline</h4>
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 shadow-lg">
            <p className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🚨</span>
              <span  style={{ color: 'white' }}>911</span>
            </p>
            <p className="text-xs text-red-100 mt-1">24/7 Emergency Response</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-8 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} <span className="font-semibold text-gray-300">BloodConnect Olongapo</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-sm text-gray-400 hover:text-red-400 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">Made with ❤️ for the people of Olongapo City</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
