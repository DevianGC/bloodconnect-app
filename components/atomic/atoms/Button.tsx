import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-dark))] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

