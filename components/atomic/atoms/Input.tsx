import React from 'react';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  min?: number;
};

export default function Input({ id, name, type = 'text', value, onChange, placeholder, className = '', min }: InputProps) {
  const cls = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${className}`;
  return (
    <input id={id} name={name} type={type} value={value as any} onChange={onChange} placeholder={placeholder} className={cls} min={min} />
  );
}