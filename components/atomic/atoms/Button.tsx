import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const base = 'px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
const variants: Record<string, string> = {
  primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  secondary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

export default function Button({ children, variant = 'primary', type = 'button', onClick, className = '', disabled = false }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}