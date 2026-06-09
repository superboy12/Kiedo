import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  label: string;
  className?: string;
  width?: string;
  height?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  className = '',
  width = '180px',
  height = 'auto',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className={`relative group inline-block ${className}`} style={{ width, height }}>
        <img src={value} alt="Uploaded" className="max-w-full max-h-full object-contain" style={{ width, height }} />
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${className}`}
      style={{ width, height: height === 'auto' ? '80px' : height }}
    >
      <Upload className="w-5 h-5 text-gray-400 mb-1" />
      <span className="text-sm text-gray-500 font-medium px-2 text-center">{label}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
