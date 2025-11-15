import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gray';
  className?: string;
};

const variants: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  gray: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  const cls = `px-3 py-1 rounded-lg text-xs font-semibold ${variants[variant]} ${className}`;
  return <span className={cls}>{children}</span>;
}