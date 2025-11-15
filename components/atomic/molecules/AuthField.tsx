import React from 'react';
import Label from '../atoms/Label';
import TextInput from '../atoms/TextInput';

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function AuthField({ label, name, type = 'text', value, placeholder, required, onChange, error }: Props) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <TextInput id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      {error && <p className="text-sm mt-1 text-[rgb(var(--primary-dark))]">{error}</p>}
    </div>
  );
}

