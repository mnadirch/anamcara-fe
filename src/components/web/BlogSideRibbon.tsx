import React from "react";
import {
  LiaHeadphonesAltSolid,
} from "react-icons/lia";
import {
  RiAttachmentLine,
  RiFacebookFill,
  RiTwitterXFill,
  RiWhatsappLine,
  RiBookmarkLine,
} from "react-icons/ri";
import { BiSolidComment } from "react-icons/bi";
import { RiArrowUpLine } from "react-icons/ri";

interface SideBarProps {
  onScrollToTop?: () => void;
  onClose?: () => void;
}

const BlogSideRibbon: React.FC<SideBarProps> = ({ onScrollToTop, onClose }) => {
  const iconActions = [
    {
      icon: <LiaHeadphonesAltSolid className="text-lg sm:text-xl" />,
      label: "Listen",
      onClick: () => alert("Listen to the post"),
    },
    {
      icon: <RiAttachmentLine className="text-lg sm:text-xl" />,
      label: "Copy Link",
      onClick: () => alert("Link copied!"),
    },
    {
      icon: <RiFacebookFill className="text-lg sm:text-xl" />,
      label: "Facebook",
      onClick: () => alert("Shared on Facebook!"),
    },
    {
      icon: <RiTwitterXFill className="text-lg sm:text-xl" />,
      label: "Twitter/X",
      onClick: () => alert("Shared on X (Twitter)!"),
    },
    {
      icon: <RiWhatsappLine className="text-lg sm:text-xl" />,
      label: "WhatsApp",
      onClick: () => alert("Shared on WhatsApp!"),
    },
    {
      icon: <RiBookmarkLine className="text-lg sm:text-xl" />,
      label: "Bookmark",
      onClick: () => alert("Bookmarked!"),
    },
    {
      icon: <BiSolidComment className="text-lg sm:text-xl" />,
      label: "Comment",
      onClick: () => alert("Opening comment section..."),
    },
    {
      icon: <RiArrowUpLine className="text-lg sm:text-xl" />,
      label: "Scroll to top",
      onClick: () =>
        onScrollToTop
          ? onScrollToTop()
          : alert("Scrolling to top (implement me)!"),
    },
  ];

  return (
    <div
      className="
        absolute left-0 px-3 py-6 top-1/2 transform -translate-y-1/2 h-full
        flex flex-col justify-center items-center gap-5 z-10 bg-black
      "
    >
      {iconActions.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          title={item.label}
          className="md:w-10 md:h-10 h-6 w-6 text-black sm:w-10 sm:h-10 cursor-pointer rounded-full border flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
        >
          {item.icon}
        </button>
      ))}

      {/* Close button for small screens */}
      <button
        onClick={onClose}
        className="md:w-10 md:h-10 h-6 w-6 rounded-full border flex items-center justify-center bg-gray-200 sm:hidden"
      >
        <span className="text-black text-lg">✕</span>
      </button>
    </div>
  );
};

export default BlogSideRibbon;
