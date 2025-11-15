import React from 'react';
import styles from '@/styles/admin.module.css';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value?: string | boolean | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  checked?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  checked = false
}) => {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value as string || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={styles.formField}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value as string || ''}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={styles.formField}
          >
            <option value="">Select {label}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={styles.checkbox}
          />
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value as string || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={styles.formField}
          />
        );
    }
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default FormField;
