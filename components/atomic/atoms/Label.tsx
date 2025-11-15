import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
};

export default function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label {...props} className={`block text-sm font-medium text-[rgb(var(--gray-700))] mb-1 ${className}`}>
      {children}
    </label>
  );
}

