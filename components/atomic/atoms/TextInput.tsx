import React from 'react';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function TextInput({ className = '', ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={`w-full border border-[rgb(var(--gray-300))] rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] transition-all duration-200 hover:border-[rgb(var(--gray-400))] ${className}`}
    />
  );
}

