'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageAction } from '@/actions/upload';
import { useToast } from './Toast';

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  label = 'Upload Image',
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const images = multiple 
    ? (Array.isArray(value) ? value : value ? [value] : []) 
    : (typeof value === 'string' && value ? [value] : []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    if (!multiple && files.length > 1) {
      showToast('Only one image can be uploaded', 'error');
      return;
    }

    if (multiple && images.length + files.length > maxFiles) {
      showToast(`Maximum limit is ${maxFiles} images`, 'error');
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [...images];

    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Format validation
        if (!allowedTypes.includes(file.type)) {
          showToast(`File "${file.name}" has an invalid format. Only JPG, JPEG, PNG, and WEBP images are supported.`, 'error');
          continue;
        }

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
          showToast(`File "${file.name}" exceeds the 5MB size limit`, 'error');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        const res = await uploadImageAction(formData);
        
        if (res.error) {
          showToast(res.error, 'error');
        } else if (res.url) {
          if (multiple) {
            uploadedUrls.push(res.url);
          } else {
            uploadedUrls[0] = res.url;
            break;
          }
        }
      }

      if (multiple) {
        onChange(uploadedUrls);
      } else {
        onChange(uploadedUrls[0] || '');
      }
      showToast('Image(s) uploaded successfully!', 'success');
    } catch (err) {
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) processFiles(files);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (multiple) {
      const updated = images.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span className="text-[14px] font-heading font-semibold text-heading">
          {label}
        </span>
      )}
      
      {/* Upload Box */}
      {(!multiple && images.length > 0) ? null : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => !disabled && handleDragOver(e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => !disabled && handleDrop(e)}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-primary bg-teal-50/30' 
              : 'border-border hover:border-primary/50 bg-light-gray/20 hover:bg-light-gray/50'
          } ${isUploading || disabled ? 'pointer-events-none opacity-60 bg-light-gray/40' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={multiple}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <span className="text-[14px] font-medium text-paragraph">Uploading images, please wait...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-teal-50 text-primary rounded-full">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-heading">
                  Click to upload or drag & drop
                </p>
                <p className="text-[12px] text-paragraph mt-1">
                  Supports PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Previews grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video w-full rounded-xl overflow-hidden border border-border group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Upload preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-soft"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
