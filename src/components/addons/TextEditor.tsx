import React, { useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaHeading, FaListUl, FaListOl, FaLink, FaImage } from 'react-icons/fa';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // Function to insert formatting at cursor position
  const insertFormatting = (startTag: string, endTag: string = '') => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      startTag + 
      selectedText + 
      endTag + 
      value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length, 
        start + startTag.length + selectedText.length
      );
    }, 0);
  };
  
  const insertLink = () => {
    if (!linkUrl) return;
    
    const linkMarkdown = `[${linkText || linkUrl}](${linkUrl})`;
    
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = 
      value.substring(0, start) + 
      linkMarkdown + 
      value.substring(end);
    
    onChange(newText);
    
    // Reset states
    setLinkUrl('');
    setLinkText('');
    setShowLinkInput(false);
    
    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
    }, 0);
  };
  
  const insertImage = () => {
    if (!imageUrl) return;
    
    const imageMarkdown = `![${imageAlt || 'image'}](${imageUrl})`;
    
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    
    const newText = 
      value.substring(0, start) + 
      imageMarkdown + 
      value.substring(start);
    
    onChange(newText);
    
    // Reset states
    setImageUrl('');
    setImageAlt('');
    setShowImageInput(false);
    
    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
    }, 0);
  };

  return (
    <div className="rich-text-editor border border-gray-600 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-800 border-b border-gray-600">
        <button 
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="p-2 rounded hover:bg-gray-700"
          title="Bold"
        >
          <FaBold />
        </button>
        
        <button 
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="p-2 rounded hover:bg-gray-700"
          title="Italic"
        >
          <FaItalic />
        </button>
        
        <button 
          type="button"
          onClick={() => insertFormatting('<u>', '</u>')}
          className="p-2 rounded hover:bg-gray-700"
          title="Underline"
        >
          <FaUnderline />
        </button>
        
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        
        <button 
          type="button"
          onClick={() => insertFormatting('## ', '')}
          className="p-2 rounded hover:bg-gray-700"
          title="Heading"
        >
          <FaHeading />
        </button>
        
        <button 
          type="button"
          onClick={() => insertFormatting('- ', '')}
          className="p-2 rounded hover:bg-gray-700"
          title="Bullet List"
        >
          <FaListUl />
        </button>
        
        <button 
          type="button"
          onClick={() => insertFormatting('1. ', '')}
          className="p-2 rounded hover:bg-gray-700"
          title="Numbered List"
        >
          <FaListOl />
        </button>
        
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        
        <button 
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-gray-700 ${showLinkInput ? 'bg-gray-700' : ''}`}
          title="Insert Link"
        >
          <FaLink />
        </button>
        
        <button 
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className={`p-2 rounded hover:bg-gray-700 ${showImageInput ? 'bg-gray-700' : ''}`}
          title="Insert Image"
        >
          <FaImage />
        </button>
      </div>
      
      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 bg-gray-700 border-b border-gray-600 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
          />
          <input
            type="text"
            placeholder="Link Text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
          />
          <button
            type="button"
            onClick={insertLink}
            className="px-3 py-1 bg-[#ADFF00] text-black rounded text-sm font-medium"
          >
            Insert
          </button>
        </div>
      )}
      
      {/* Image Input */}
      {showImageInput && (
        <div className="p-2 bg-gray-700 border-b border-gray-600 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
          />
          <input
            type="text"
            placeholder="Alt Text (optional)"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm min-w-[150px]"
          />
          <button
            type="button"
            onClick={insertImage}
            className="px-3 py-1 bg-[#ADFF00] text-black rounded text-sm font-medium"
          >
            Insert
          </button>
        </div>
      )}
      
      {/* Text Area */}
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 min-h-[200px] focus:outline-none resize-y"
        placeholder="Write your blog content here..."
      />
    </div>
  );
};

export default TextEditor;