import React from 'react';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';

interface BlogPreviewProps {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  showFullContent?: boolean; // Add option to show full content
}

const BlogPreview: React.FC<BlogPreviewProps> = ({
  title,
  description,
  content,
  imageUrl,
  showFullContent = false
}) => {
  // Format content for display
  const displayContent = content 
    ? (showFullContent ? content : (content.length > 200 ? `${content.substring(0, 200)}...` : content))
    : 'Your blog content will appear here. Start typing in the content field to see a preview.';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg  overflow-hidden">
      {/* Blog Image */}
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, replace with placeholder
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image';
            }}
          />
        </div>
      )}
      
      {/* Blog Content */}
      <div className="p-6">
      <div className=" bg-gray-900 rounded-lg p-6 relative w-full">
        {/* Header with meta info */}
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <div className="flex items-center mr-4">
            <FaCalendarAlt className="mr-1" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FaEye className="mr-1" />
            <span>0 views</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 text-white">{title || 'Blog Title Preview'}</h2>
        
        {/* Description */}
        <p className="text-gray-300 mb-4 italic">
          {description || 'No description provided'}
        </p>
        
        {/* Content Preview */}
        <div className="prose text-gray-200 mb-4 max-h-full overflow-y-auto whitespace-pre-line break-words w-full">
          {displayContent}
        </div>
        
        {/* Preview Label */}
        <div className="absolute top-2 right-2 bg-[#A0FF06] text-black text-xs font-bold px-2 py-1 rounded-md">
          PREVIEW
        </div>
      </div>
      </div>
    </div>
  );
};

export default BlogPreview;