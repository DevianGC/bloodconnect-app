'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-6 bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
          <button 
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-2xl leading-none p-2 transition-all duration-200" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
