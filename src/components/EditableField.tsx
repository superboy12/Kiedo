import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  align?: 'left' | 'right' | 'center';
  type?: 'text' | 'number';
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Type here...',
  multiline = false,
  align = 'left',
  type = 'text',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white border border-blue-400 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 resize-y min-h-[80px] ${alignClass} ${className}`}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white border border-blue-400 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 ${alignClass} ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div 
      className={`group relative cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 border border-transparent hover:border-gray-200 transition-colors ${alignClass} ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
      <Pencil className="w-3 h-3 text-blue-500 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
