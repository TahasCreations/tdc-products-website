"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Radio,
  FileText,
  Trash2,
  Copy,
  Edit3,
  Save
} from 'lucide-react';

type FieldType = 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormBuilderProps {
  fields?: FormField[];
  onChange?: (fields: FormField[]) => void;
}

const FIELD_TYPES = [
  { type: 'text' as FieldType, icon: Type, label: 'Text' },
  { type: 'email' as FieldType, icon: Mail, label: 'Email' },
  { type: 'tel' as FieldType, icon: Phone, label: 'Phone' },
  { type: 'date' as FieldType, icon: Calendar, label: 'Date' },
  { type: 'textarea' as FieldType, icon: FileText, label: 'Textarea' },
  { type: 'select' as FieldType, icon: Radio, label: 'Select' },
  { type: 'checkbox' as FieldType, icon: CheckSquare, label: 'Checkbox' },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields = [],
  onChange
}) => {
  const [formFields, setFormFields] = useState<FormField[]>(fields);
  const [editingField, setEditingField] = useState<string | null>(null);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };

    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);
    onChange?.(updatedFields);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    const updatedFields = formFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    );
    setFormFields(updatedFields);
    onChange?.(updatedFields);
  };

  const removeField = (id: string) => {
    const updatedFields = formFields.filter(field => field.id !== id);
    setFormFields(updatedFields);
    onChange?.(updatedFields);
  };

  const duplicateField = (id: string) => {
    const field = formFields.find(f => f.id === id);
    if (field) {
      const newField = { ...field, id: `field_${Date.now()}` };
      const updatedFields = [...formFields, newField];
      setFormFields(updatedFields);
      onChange?.(updatedFields);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Form Builder</h3>
          <p className="text-xs text-gray-600">Form alanları ekle ve düzenle</p>
        </div>
      </div>

      {/* Add Field Buttons */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Alan Türleri
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="p-3 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center gap-1"
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {formFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Henüz alan eklenmedi. Yukarıdan bir alan türü seçin.
          </div>
        ) : (
          formFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-3"
            >
              {editingField === field.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Placeholder"
                  />
                  {(field.type === 'select' || field.type === 'radio') && (
                    <div className="text-xs text-gray-600">
                      Options: {field.options?.join(', ')}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      />
                      Required
                    </label>
                    <button
                      onClick={() => setEditingField(null)}
                      className="ml-auto px-3 py-1 bg-green-600 text-white rounded text-xs font-medium"
                    >
                      <Save className="w-3 h-3 inline mr-1" />
                      Kaydet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{field.label}</div>
                      <div className="text-xs text-gray-500">{field.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingField(field.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => duplicateField(field.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Çoğalt"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Form Preview */}
      {formFields.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-semibold text-gray-700 mb-2">Önizleme</div>
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    {field.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

