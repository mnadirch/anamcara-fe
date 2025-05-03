import React from "react";
import audio from "../../assets/icons/customer-service-line.svg";
import file from "../../assets/icons/attachment-line.svg";
import fb from "../../assets/icons/facebook-fill.svg";
import twitter from "../../assets/icons/twitter-x-line.svg";
import whatsapp from "../../assets/icons/whatsapp-line.svg";
import bookmark from "../../assets/icons/bookmark-line.svg";
import comment from "../../assets/icons/chat-4-fill.svg";
import scroll from "../../assets/icons/arrow-up-box-line.svg";

interface SideBarProps {
  onScrollToTop?: () => void;
  onClose?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ onScrollToTop, onClose }) => {
  // Example onClick handlers (replace with real functionality)
  const handleListenClick = () => {
    alert("Listen to the post");
  };

  const handleCopyLink = () => {
    alert("Link copied!");
  };

  const handleFacebookShare = () => {
    alert("Shared on Facebook!");
  };

  const handleXShare = () => {
    alert("Shared on X (Twitter)!");
  };

  const handleWhatsAppShare = () => {
    alert("Shared on WhatsApp!");
  };

  const handleBookmark = () => {
    alert("Bookmarked!");
  };

  const handleCommentSection = () => {
    alert("Opening comment section...");
  };

  const handleScrollToTop = () => {
    // If a parent component passes `onScrollToTop`, call it.
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      alert("Scrolling to top (implement me)!");
    }
  };
  return (
    <div
      className="
        absolute     
        left-4       
        top-1/2       
        transform -translate-y-1/2
        flex flex-col
        items-center
        space-y-4 
      "
    >
      {/* Listen icon */}
      <button
        onClick={handleListenClick}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={audio} alt="Listen" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Copy link icon */}
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={file} alt="Copy Link" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={fb} alt="Facebook" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* X (Twitter) */}
      <button
        onClick={handleXShare}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={twitter} alt="X" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={whatsapp} alt="WhatsApp" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Bookmark */}
      <button
        onClick={handleBookmark}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={bookmark} alt="Bookmark" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Comment */}
      <button
        onClick={handleCommentSection}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200"
      >
        <img src={comment} alt="Comments" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Scroll to top */}
      <button
        onClick={handleScrollToTop}
        className="w-10 h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full border flex items-center justify-center bg-blue-200 bg-gray-200"
      >
        <img src={scroll} alt="Scroll to top" className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Close button - Only visible on small screens */}
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-200 sm:hidden"
      >
        <span className="text-black text-lg">✕</span>
      </button>
    
    </div>
  );
};

export default SideBar;
