import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  RemoveFormatting,
  Code,
  Eye,
  Type,
  Sparkles,
} from 'lucide-react';

interface RichParagraphEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  minHeight?: string;
  rows?: number;
}

export const RichParagraphEditor: React.FC<RichParagraphEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type your paragraph here...',
  label = 'Company Description / Overview Paragraph',
  helperText = 'Select any portion of text and click Bold, Italic, or Underline to format just like Microsoft Word.',
  minHeight = '100px',
  rows = 4,
}) => {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Keep editorRef innerHTML in sync with external value,
  // but avoid resetting while the user is actively focused and typing inside visual editor.
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (document.activeElement !== editorRef.current) {
        if (editorRef.current.innerHTML !== (value || '')) {
          editorRef.current.innerHTML = value || '';
        }
      }
    }
  }, [value, isSourceMode]);

  // Query formatting state of the current cursor selection
  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    } catch {
      // ignore
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateActiveFormats();
    }
  };

  const applyVisualFormat = (command: 'bold' | 'italic' | 'underline' | 'removeFormat') => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    try {
      document.execCommand(command, false);
      const updatedHtml = editorRef.current.innerHTML;
      onChange(updatedHtml);
      updateActiveFormats();
    } catch (e) {
      console.warn('execCommand error:', e);
    }
  };

  const applyTextareaTag = (tag: 'b' | 'i' | 'u') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const replacement = `${openTag}${selected || 'text'}${closeTag}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      ta.focus();
      if (selected.length > 0) {
        ta.setSelectionRange(start + openTag.length, end + openTag.length);
      } else {
        ta.setSelectionRange(start + openTag.length, start + openTag.length + 4);
      }
    }, 10);
  };

  const handleFormatClick = (command: 'bold' | 'italic' | 'underline') => {
    if (isSourceMode) {
      const tagMap: Record<string, 'b' | 'i' | 'u'> = {
        bold: 'b',
        italic: 'i',
        underline: 'u',
      };
      applyTextareaTag(tagMap[command]);
    } else {
      applyVisualFormat(command);
    }
  };

  const handleClearFormat = () => {
    if (isSourceMode) {
      // Strip html tags from current selection or whole text
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (start !== end) {
        const selected = value.substring(start, end);
        const stripped = selected.replace(/<[^>]*>?/gm, '');
        const nextVal = value.substring(0, start) + stripped + value.substring(end);
        onChange(nextVal);
      } else {
        const stripped = value.replace(/<[^>]*>?/gm, '');
        onChange(stripped);
      }
    } else {
      applyVisualFormat('removeFormat');
    }
  };

  // Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        applyVisualFormat('bold');
      } else if (key === 'i') {
        e.preventDefault();
        applyVisualFormat('italic');
      } else if (key === 'u') {
        e.preventDefault();
        applyVisualFormat('underline');
      }
    }
  };

  const cleanTextLength = (value || '').replace(/<[^>]*>?/gm, '').length;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#1a6c7a]" />
            <span>{label}</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {cleanTextLength} characters
          </span>
        </div>
      )}

      {/* Editor Container */}
      <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:border-[#1a6c7a] transition-all shadow-xs bg-white">
        {/* Word-like Formatting Toolbar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Main Formatting Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Bold Button */}
            <button
              type="button"
              onClick={() => handleFormatClick('bold')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer select-none ${
                activeFormats.bold && !isSourceMode
                  ? 'bg-[#1a6c7a] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="text-[11px]">Bold</span>
            </button>

            {/* Italic Button */}
            <button
              type="button"
              onClick={() => handleFormatClick('italic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer select-none ${
                activeFormats.italic && !isSourceMode
                  ? 'bg-[#1a6c7a] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
              <span className="text-[11px] italic">Italic</span>
            </button>

            {/* Underline Button */}
            <button
              type="button"
              onClick={() => handleFormatClick('underline')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer select-none ${
                activeFormats.underline && !isSourceMode
                  ? 'bg-[#1a6c7a] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
              <span className="text-[11px] underline">Underline</span>
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Remove Formatting */}
            <button
              type="button"
              onClick={handleClearFormat}
              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 text-xs transition cursor-pointer"
              title="Remove formatting / Clear styles"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switch (Word Visual vs HTML Source) */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => {
                if (isSourceMode) {
                  setIsSourceMode(false);
                }
              }}
              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                !isSourceMode
                  ? 'bg-white text-[#1a6c7a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Visual Word Mode (WYSIWYG)"
            >
              <Eye className="w-3 h-3" />
              <span>Word Mode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isSourceMode) {
                  setIsSourceMode(true);
                }
              }}
              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                isSourceMode
                  ? 'bg-white text-[#1a6c7a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="HTML Code View"
            >
              <Code className="w-3 h-3" />
              <span>HTML Source</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {!isSourceMode ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onSelect={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            className="w-full p-3 text-xs text-slate-800 leading-relaxed outline-none rich-footer-text rich-text-content bg-white"
            style={{ minHeight }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-300 outline-none leading-relaxed resize-y border-0"
            placeholder="Edit raw HTML tags (e.g. <b>text</b>, <i>text</i>, <u>text</u>)..."
          />
        )}
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
        <p className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>{helperText}</span>
        </p>
      </div>
    </div>
  );
};
