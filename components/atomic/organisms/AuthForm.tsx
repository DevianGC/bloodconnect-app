import React, { useState } from 'react';
import Button from '../atoms/Button';
import AuthField from '../molecules/AuthField';
import type { FieldConfig } from '../../../types/auth';

type Props = {
  mode: 'login' | 'register';
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
  isLoading?: boolean;
  error?: string;
  submitLabel?: string;
};

export default function AuthForm({ mode, fields, onSubmit, isLoading = false, error, submitLabel }: Props) {
  const initial = Object.fromEntries(fields.map(f => [f.name, '']));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [localError, setLocalError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setLocalError('Something went wrong. Please try again.');
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {(error || localError) && (
        <div className="p-3 rounded-md border text-center bg-[rgb(var(--red-100))] text-[rgb(var(--red-700))] border-[rgb(var(--red-200))]">
          {error || localError}
        </div>
      )}

      {fields.map(f => (
        <AuthField
          key={f.name}
          label={f.label}
          name={f.name}
          type={f.type}
          value={values[f.name]}
          onChange={handleChange}
          placeholder={f.placeholder}
          required={f.required}
        />
      ))}

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? (mode === 'login' ? 'Signing in...' : 'Submitting...') : submitLabel || (mode === 'login' ? 'Sign In' : 'Submit')}
      </Button>
    </form>
  );
}

