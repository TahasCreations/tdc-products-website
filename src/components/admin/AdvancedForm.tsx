'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: string) => string | null;
  };
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  disabled?: boolean;
}

interface AdvancedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitText?: string;
  loading?: boolean;
  className?: string;
}

export default function AdvancedForm({ 
  fields, 
  onSubmit, 
  submitText = 'Gönder',
  loading = false,
  className = ''
}: AdvancedFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize form data
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        initialData[field.name] = field.options[0].value;
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [fields]);

  const validateField = (name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} alanı zorunludur`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Type-specific validations
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Geçerli bir e-posta adresi girin';
      }
    }

    if (field.type === 'tel') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Geçerli bir telefon numarası girin';
      }
    }

    if (field.type === 'url') {
      try {
        new URL(value);
      } catch {
        return 'Geçerli bir URL girin';
      }
    }

    if (field.type === 'number') {
      if (isNaN(Number(value))) {
        return 'Geçerli bir sayı girin';
      }
    }

    // Custom validation rules
    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `En az ${field.validation.minLength} karakter olmalıdır`;
      }

      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `En fazla ${field.validation.maxLength} karakter olmalıdır`;
      }

      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return 'Geçersiz format';
        }
      }

      if (field.validation.custom) {
        return field.validation.custom(value);
      }
    }

    return null;
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const getFieldError = (name: string) => {
    return touched[name] && errors[name] ? errors[name] : null;
  };

  const getFieldStatus = (name: string) => {
    if (!touched[name]) return 'default';
    if (errors[name]) return 'error';
    if (formData[name] && !errors[name]) return 'success';
    return 'default';
  };

  const renderField = (field: FormField) => {
    const error = getFieldError(field.name);
    const status = getFieldStatus(field.name);
    const value = formData[field.name] || '';

    const baseClasses = `
      w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
      ${status === 'error' ? 'border-red-300 focus:ring-red-500' : 
        status === 'success' ? 'border-green-300 focus:ring-green-500' : 
        'border-gray-300 focus:ring-blue-500'}
      ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    `;

    const iconClasses = `
      absolute inset-y-0 right-0 pr-3 flex items-center
      ${status === 'error' ? 'text-red-500' : 
        status === 'success' ? 'text-green-500' : 
        'text-gray-400'}
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              rows={4}
              className={baseClasses}
            />
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              disabled={field.disabled}
              className={baseClasses}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={field.name}
              checked={value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              onBlur={() => handleBlur(field.name)}
              disabled={field.disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && (
              <p className="text-sm text-red-600 flex items-center ml-6">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'password':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={baseClasses}
              />
              <div className={iconClasses}>
                {status === 'success' && <CheckCircleIcon className="h-5 w-5" />}
                {status === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
                {status === 'default' && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[field.name] ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={field.type}
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={baseClasses}
              />
              {(status === 'success' || status === 'error') && (
                <div className={iconClasses}>
                  {status === 'success' && <CheckCircleIcon className="h-5 w-5" />}
                  {status === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
                </div>
              )}
            </div>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(renderField)}
      
      <div className="flex items-center justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Yükleniyor...
            </div>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
