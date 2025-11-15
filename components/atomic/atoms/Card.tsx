import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  const cls = `bg-white border border-gray-200 rounded-2xl p-6 shadow-md ${className}`;
  return <div className={cls}>{children}</div>;
}