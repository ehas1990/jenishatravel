'use client';

import React, { useState } from 'react';
import { Bold, Italic, Heading3, List, Link as LinkIcon, Eye, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function RichText({
  value,
  onChange,
  label,
  placeholder = 'Write details here...',
  error,
  required,
}: RichTextProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertFormat = (formatType: 'bold' | 'italic' | 'heading' | 'list' | 'link') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';

    switch (formatType) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `\n### ${selectedText || 'Heading'}\n`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](https://)`;
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);
    
    // Focus back and select inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 50);
  };

  // Convert markdown-like syntax to basic HTML for preview
  const parseMarkdown = (markdownText: string) => {
    if (!markdownText) return '<p class="text-paragraph/40 italic">Nothing to preview</p>';

    let html = markdownText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)\n/g, '<h4 class="text-[18px] font-bold text-heading mt-4 mb-2">$1</h4>')
      .replace(/\n- (.*?)/g, '<li class="ml-4 list-disc text-paragraph">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-primary underline font-medium">$1</a>')
      .replace(/\n/g, '<br />');

    return `<div class="prose max-w-none text-[15px] leading-relaxed text-paragraph">${html}</div>`;
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        {label && (
          <label className="text-[14px] font-heading font-semibold text-heading">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        
        {/* Write/Preview Tabs */}
        <div className="flex items-center gap-1 bg-light-gray border border-border rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded-md transition-colors cursor-pointer',
              activeTab === 'write'
                ? 'bg-white text-primary shadow-sm'
                : 'text-paragraph hover:text-heading'
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded-md transition-colors cursor-pointer',
              activeTab === 'preview'
                ? 'bg-white text-primary shadow-sm'
                : 'text-paragraph hover:text-heading'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-white">
        {activeTab === 'write' ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-light-gray/60 border-b border-border/80">
              <button
                type="button"
                onClick={() => insertFormat('bold')}
                className="p-1.5 text-paragraph hover:text-heading hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('italic')}
                className="p-1.5 text-paragraph hover:text-heading hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormat('heading')}
                className="p-1.5 text-paragraph hover:text-heading hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Heading"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('list')}
                className="p-1.5 text-paragraph hover:text-heading hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('link')}
                className="p-1.5 text-paragraph hover:text-heading hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Editor Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={6}
              className="w-full px-4 py-3 text-[15px] text-heading outline-none resize-y placeholder:text-paragraph/40 border-none focus:ring-0"
            />
          </>
        ) : (
          /* Preview Display */
          <div 
            className="w-full p-4 min-h-[194px] max-h-[400px] overflow-y-auto bg-slate-50/50"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
          />
        )}
      </div>

      {error && (
        <span className="text-[13px] font-medium text-rose-500">
          {error}
        </span>
      )}
    </div>
  );
}
