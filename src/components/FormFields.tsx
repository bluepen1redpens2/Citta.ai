import React from 'react';
import { useFormSelector, useFormDispatch } from '../store/hooks';
import type { FormState } from '../store/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof FormState;
}

export const TextInput: React.FC<InputProps> = ({ label, name, ...props }) => {
  const value = useFormSelector((state) => state[name] as string);
  const errors = useFormSelector((state) => state.errors[name]);
  const { updateField } = useFormDispatch();

  const hasError = errors && errors.length > 0;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => updateField(name, e.target.value)}
        className={hasError ? 'input-error' : ''}
        {...props}
      />
      {hasError && (
        <div className="error-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {errors[0]}
        </div>
      )}
    </div>
  );
};

export const NumberInput: React.FC<InputProps> = ({ label, name, ...props }) => {
  const value = useFormSelector((state) => state[name] as number);
  const errors = useFormSelector((state) => state.errors[name]);
  const { updateField } = useFormDispatch();

  const hasError = errors && errors.length > 0;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="number"
        value={value !== undefined ? value : ''}
        onChange={(e) => updateField(name, e.target.value ? Number(e.target.value) : 0)}
        className={hasError ? 'input-error' : ''}
        {...props}
      />
      {hasError && (
        <div className="error-text">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {errors[0]}
        </div>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: keyof FormState;
  options: { label: string; value: string | number }[];
}

export const SelectInput: React.FC<SelectProps> = ({ label, name, options, ...props }) => {
  const value = useFormSelector((state) => state[name] as string | number);
  const errors = useFormSelector((state) => state.errors[name]);
  const { updateField } = useFormDispatch();

  const hasError = errors && errors.length > 0;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => updateField(name, e.target.value)}
        className={hasError ? 'input-error' : ''}
        {...props}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <div className="error-text">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {errors[0]}
        </div>
      )}
    </div>
  );
};
