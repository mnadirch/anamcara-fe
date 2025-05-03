import React, { useState, useRef, useEffect } from "react";
import { addComment, likeBlog, bookmarkBlog } from "../../services/blogService";
import author from "../../assets/icons/fa6-solid_user-pen.png";
import calender from "../../assets/icons/Vector (1).png";
import heart from "../../assets/icons/like.png";
import up from "../../assets/icons/Vector (2).png";
import down from "../../assets/icons/Vector (3).png";
import share from "../../assets/icons/Vector (4).png";
import bookmark from "../../assets/icons/Vector (5).png";
import commentsIcon from "../../assets/icons/Vector (6).png";
import view from "../../assets/icons/circum_read.png";
import pic from "../../assets/images/headimages/Ellipse 90.png";
import insta from "../../assets/icons/Group (1).png";
import fb from "../../assets/icons/Group.png";
import linkedin from "../../assets/icons/hugeicons_linkedin-01.png";
import filledheart from "../../assets/icons/Vector (11).png";
import filleddown from "../../assets/icons/Vector (9).png";
import filledup from "../../assets/icons/Vector (8).png";
import filledshare from "../../assets/icons/Vector (12).png";
import filledbookmark from "../../assets/icons/Vector (10).png";
import SideBar from "./sideBar";
import Reactions from "./reactions";
import SocialLoginModal from "./socialLoginModel";

import backgroundImage2 from "../../assets/images/backgrounds/pexels-pixabay-40185 1.png";

interface Blog {
  blogId: string;
  id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  posted_at?: string;
  likes_count?: number;
  comments_count?: number;
  bookmarks_count?: number;
  author?: {
    first_name: string;
    last_name: string;
  };
  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  views: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCard: Blog;
}

const BlogDetailModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  activeCard
}) => {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose(); // Close the modal
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(200);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showButton, setShowButton] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [notification, setNotification] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleIconClick = async (type: string) => {
    try {
      if (type === "upvote") {
        setIsUpvoted(!isUpvoted);
        setIsDownvoted(false);
      }

      if (type === "downvote") {
        setIsDownvoted(!isDownvoted);
        setIsUpvoted(false);
      }

      if (type === "share") {
        setIsShared(!isShared);
      }

      if (type === "bookmark") {
        setIsBookmarked(!isBookmarked);

        try {
          const response = await bookmarkBlog(activeCard.blogId);
          console.log("Bookmark response:", response);
        } catch (error) {
          console.error("Error bookmarking blog:", error);
          setIsBookmarked(isBookmarked);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error(`Error handling ${type} action:`, error);
    }
  };

  const handleLikeClick = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      const response = await likeBlog(activeCard.blogId);
      console.log("Like response:", response);
    } catch (error) {
      console.error("Error liking blog:", error);
      setIsLiked(isLiked);
      setLikeCount((prevCount) => (newLikedState ? prevCount - 1 : prevCount + 1));
      setIsModalOpen(true);
    }
  };

  const handleInputFocus = () => {
    setShowButton(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      setShowButton(false);
    }
  };

  const handleSubscribe = () => {
    console.log("Subscribe button clicked!");
    setShowNotification(true);

    setTimeout(() => {
      console.log("Hiding notification...");
      setShowNotification(false);
    }, 3000);
  };

  const handlePostComment = async () => {
    if (comment.trim()) {
      setIsSubmittingComment(true);

      try {
        const response = await addComment(activeCard.blogId, comment);
        console.log("Comment response:", response);
        setNotification("Comment Uploaded");
        setIsHighlighted(true);
        setCommentList((prev) => [...prev, comment]);
        setComment("");
        setShowButton(false);
        setTimeout(() => {
          setNotification("");
          setIsHighlighted(false);
        }, 3000);
      } catch (error) {
        console.error("Error posting comment:", error);
        setNotification("Failed to post comment. Please try again.");
        setIsModalOpen(true);
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "12 April 2024"; // Fallback date

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return "12 April 2024";
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">

      {/* card modal */}
      <div
        ref={modalRef} // Attach the ref to the modal content
        className="rounded-lg shadow-lg max-w-4xl w-full p-6 relative text-white bg-black overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-white hover:text-[#ADFF00] sm:block hidden"
        >
          ✕
        </button>

        {/* Scrollable Container */}
        <div className="max-h-[80vh] overflow-y-auto no-scrollbar px-4 pl-16" ref={scrollableRef}>
          {/* Image */}
          <img
            src={activeCard?.image_url || backgroundImage2}
            alt={activeCard.title}
            className="rounded-md w-full max-h-96 object-cover mb-6"
          />

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{activeCard.title}</h1>

          {/* Metadata and Icons */}
          <div className="flex items-center justify-between text-white text-sm mb-6 max-sm:mb-3">
            {/* Left Metadata */}
            <div
              className="flex items-center space-x-6 font-mowaq"
            >
              <div className="flex items-center">
                <img src={author} alt="Author Icon" className="w-4 h-4 max-sm:w-3 max-sm:h-3 mr-2" />
                <span className="text-xs sm:text-xs md:text-lg">
                  {activeCard.profiles ? `${activeCard.profiles.first_name} ${activeCard.profiles.last_name}` : 'Author Name'}
                </span>
              </div>

              <div className="flex items-center">
                <img
                  src={calender}
                  alt="Calendar Icon"
                  className="w-3 h-3 mr-2"
                />
                <span className="text-xs max-sm:text-xs md:text-lg">
                  {formatDate(activeCard.posted_at)}</span>
              </div>
            </div>
          </div>

          {windowWidth < 500 && (
            <div className="flex flex-row space-x-4 mb-3">
              {/* Upvote Button */}
              <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("upvote")}>
                <img src={isUpvoted ? filledup : up} alt="Upvote Icon" className="w-4 h-4" />
              </button>

              {/* Downvote Button */}
              <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("downvote")}>
                <img src={isDownvoted ? filleddown : down} alt="Downvote Icon" className="w-4 h-4" />
              </button>

              {/* Share Button */}
              <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("share")}>
                <img src={isShared ? filledshare : share} alt="Share Icon" className="w-4 h-4" />
              </button>

              {/* Social Media Icons */}
              {isShared && (
                <div className="flex flex-row items-center space-x-4 transition-transform duration-300">
                  <img src={fb} alt="Facebook Icon" className="w-5 h-5" />
                  <img src={insta} alt="Instagram Icon" className="w-5 h-5" />
                  <img src={linkedin} alt="LinkedIn Icon" className="w-5 h-5" />
                </div>
              )}

              {/* Bookmark Button */}
              <button
                className="hover:text-white transition flex items-center"
                onClick={() => handleIconClick("bookmark")}
              >
                <img
                  src={isBookmarked ? filledbookmark : bookmark}
                  alt="Bookmark Icon"
                  className="w-4 h-4 max-sm:w-3 max-sm:h-3"
                />
                {/* Modal */}
                <SocialLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </button>
            </div>
          )}

          {/* Main Content */}
          <div
            className="text-lg leading-relaxed mb-6 space-y-4 font-sans"
          >
            <p>{activeCard.content}</p>
          </div>

          {/* Comments, Views, and Action Icons Section */}
          <div className="mb-4 font-mowaq">
            <div className="flex items-center justify-between text-sm text-white">
              {/* Left Section: Comments and Views */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <img
                    src={commentsIcon}
                    alt="Comments Icon"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-xs sm:text-base md:text-lg">{commentList.length} comments</span>
                </div>
                <div className="flex items-center">
                  <img src={view} alt="Views Icon" className="w-4 h-4 mr-2" />
                  <span className="text-xs sm:text-base md:text-lg">
                    {activeCard.views} views</span>
                </div>
              </div>

              {/* Right Section: Action Icons */}
              <div className="flex items-center space-x-4">
                {/* Like Button */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleLikeClick}
                >
                  <img
                    src={isLiked ? filledheart : heart}
                    alt="Like Icon"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-xs sm:text-base md:text-lg">{likeCount}</span>
                </div>
                {windowWidth >= 600 && (
                  <div className="flex items-center space-x-4">
                    {/* Upvote Button */}
                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("upvote")}>
                      <img src={isUpvoted ? filledup : up} alt="Upvote Icon" className="w-4 h-4" />
                    </button>

                    {/* Downvote Button */}
                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("downvote")}>
                      <img src={isDownvoted ? filleddown : down} alt="Downvote Icon" className="w-4 h-4" />
                    </button>

                    {/* Share Button */}
                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("share")}>
                      <img src={isShared ? filledshare : share} alt="Share Icon" className="w-4 h-4" />
                    </button>

                    {/* Social Media Icons (Slide In) */}
                    {isShared && (
                      <div className="flex items-center space-x-4 transition-transform duration-300">
                        <img src={fb} alt="Facebook Icon" className="w-5 h-5" />
                        <img src={insta} alt="Instagram Icon" className="w-5 h-5" />
                        <img src={linkedin} alt="LinkedIn Icon" className="w-5 h-5" />
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("bookmark")}>
                      <img src={isBookmarked ? filledbookmark : bookmark} alt="Bookmark Icon" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Green Line */}
            <div className="border-t-2 border-[#ADFF00] mt-2"></div>
          </div>

          <div className="relative flex md:justify-center my-4">
            <Reactions />
          </div>

          {/* Comment Input */}
          <div
            className="flex flex-col space-y-4 mb-6 font-mowaq"
          >
            <div className="flex items-center space-x-4 w-full max-sm:w-1/2">
              <img
                src={pic}
                alt="User Avatar"
                className="sm-w-4 sm-w-4 w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="Comment your thoughts"
                className={`flex-1 bg-transparent border rounded-md px-4 py-2 text-[#ADFF00] text-xs sm:text-base md:text-lg placeholder-[#ADFF00] focus:outline-none ${isHighlighted
                  ? "border-[#BCFF9D] bg-[#ADFF00] text-black"
                  : "border-[#ADFF00]"
                  }`}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmittingComment}
              />
            </div>

            {/* Post Comment Button */}
            {showButton && (
              <div className="w-full flex justify-end">
                <button
                  onClick={handlePostComment}
                  className="relative px-6 py-3 font-mowaq w-[220px] shadow-btn-shadow text-lg font-bold text-black bg-[#ADFF00] rounded-md hover:bg-black hover:text-white transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingComment}
                >
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                  <div className="absolute inset-0 border-2 border-[#ADFF00] animate-border pointer-events-none"></div>
                </button>
              </div>
            )}

            {/* Notification */}
            {notification && (
              <div className="text-right text-white text-sm font-bold">
                {notification}
              </div>
            )}
          </div>

          {/* Display Posted Comments in Green Bubbles */}
          {commentList.length > 0 && (
            <div className="space-y-2 mb-6 font-mowaq">
              {commentList.map((singleComment, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {/* Avatar on the left */}
                  <img
                    src={pic}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />

                  {/* Bright-green bubble */}
                  <div
                    className="px-4 py-2 rounded-full text-black"
                    style={{
                      backgroundColor: "#ADFF00",
                    }}
                  >
                    {singleComment}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subscription Section */}
          <div className="text-center pt-6" style={{ fontFamily: "Mowaq, sans-serif" }}>
            <h3 className="text-lg font-bold text-white mb-4 font-mowaq">
              Want more tech insights? Subscribe and stay updated!
            </h3>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border border-[#ADFF00] rounded-md px-6 py-3 text-[#ADFF00] placeholder-[#ADFF00] w-full sm:w-2/3 focus:outline-none"
              />
              <button
                onClick={handleSubscribe}
                className="relative px-4 py-2 text-md font-bold text-black bg-[#ADFF00] rounded-md hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                style={{
                  fontFamily: "Mowaq, sans-serif",
                  boxShadow: "0px 0px 10px #3FA604",
                  width: "120px",
                }}
              >
                Subscribe
                <div className="absolute inset-0 border-2 border-[#ADFF00] animate-border pointer-events-none"></div>
              </button>
            </div>

            {showNotification && (
              <div className="fixed bottom-6 right-6 z-50 flex justify-center">
                <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg border-2 border-[#ADFF00] 
    animate-fade-in-out transition-opacity duration-500 w-max">
                  ✅ Subscription successful!
                </div>
              </div>
            )}

            <div className="pt-20"></div>
          </div>
        </div>

        {/* SideBar with scrollToTop callback */}
        <SideBar onScrollToTop={scrollToTop} onClose={onClose} />
      </div>
    </div>
  );
};

export default BlogDetailModal;