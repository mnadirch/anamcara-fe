import React, { useState } from 'react'
import { FaUserEdit } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import Reactions from './Reactions';
import { addComment, likeBlog, bookmarkBlog } from "../../utils/blogs";
import {
    like,
    up,
    down,
    share,
    bookmark,
    liked,
    down_filled,
    up_filled,
    shared,
    bookmark_filled,
    facebook,
    instagram,
    linkedin,
    comments,
    view,
    user,
} from "../../../public";
import LoginModal from '../dialogs/LoginModal';

const BlogModalBody = ({ activeCard, windowWidth, scrollableRef }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(200);
    const [showNotification, setShowNotification] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [notification, setNotification] = useState("");
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState<string[]>([]);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

    return (
        <div className="max-h-[80vh] md:w-[calc(100%-60px)] w-[calc(100%-40px)] self-end overflow-y-auto no-scrollbar px-3 mt-4" ref={scrollableRef}>
            <img src={activeCard?.image_url} alt={activeCard.title} className="rounded-md w-full md:h-[400px] h-[240px] object-cover mb-6" />

            <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold mb-4">{activeCard.title}</h1>

            <div className="flex items-center gap-6 text-white text-sm font-mowaq py-5">
                <div className="flex items-center gap-3">
                    <FaUserEdit className='md:text-lg text-base cursor-pointer text-[#adff00]' />

                    <span className="text-[10px] sm:text-xs md:text-lg">
                        {activeCard.profiles ? `${activeCard.profiles.first_name} ${activeCard.profiles.last_name}` : 'Author Name'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <FaCalendarDays className='md:text-lg text-base cursor-pointer text-[#adff00]' />

                    <span className="text-[10px] sm:text-xs md:text-lg">
                        {formatDate(activeCard.posted_at)}
                    </span>
                </div>
            </div>

            {windowWidth < 500 && (
                <div className="flex flex-row space-x-4 py-5">
                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("upvote")}>
                        <img src={isUpvoted ? up_filled : up} alt="Upvote Icon" className="md:w-4 md:h-4 w-3 h-3" />
                    </button>

                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("downvote")}>
                        <img src={isDownvoted ? down_filled : down} alt="Downvote Icon" className="md:w-4 md:h-4 w-3 h-3" />
                    </button>

                    <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("share")}>
                        <img src={isShared ? shared : share} alt="Share Icon" className="md:w-4 md:h-4 w-3 h-3" />
                    </button>

                    {isShared && (
                        <div className="flex flex-row items-center space-x-4 transition-transform duration-300">
                            <img src={facebook} alt="Facebook Icon" className="md:w-4 md:h-4 w-3 h-3" />
                            <img src={instagram} alt="Instagram Icon" className="md:w-4 md:h-4 w-3 h-3" />
                            <img src={linkedin} alt="LinkedIn Icon" className="md:w-4 md:h-4 w-3 h-3" />
                        </div>
                    )}

                    <button
                        className="hover:text-white transition flex items-center"
                        onClick={() => handleIconClick("bookmark")}
                    >
                        <img
                            src={isBookmarked ? bookmark_filled : bookmark}
                            alt="Bookmark Icon"
                            className="md:w-4 md:h-4 w-3 h-3"
                        />
                        <LoginModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                    </button>
                </div>
            )}

            <div className="lg:text-lg md:text-base text-sm leading-relaxed mb-6 space-y-4 font-sans">
                <p>{activeCard.content}</p>
            </div>

            {/* Comments, Views, and Action Icons Section */}
            <div className="mb-4 font-mowaq">
                <div className="flex items-center md:justify-between text-sm text-white flex-wrap md:gap-4 gap-3">
                    {/* Left Section: Comments and Views */}
                    <div className="flex items-center md:gap-3 gap-3">
                        <div className="flex items-center">
                            <img
                                src={comments}
                                alt="Comments Icon"
                                className="md:w-4 md:h-4 w-3 h-3 mr-2"
                            />
                            <span className="text-xs md:text-base lg:text-lg">{commentList.length} comments</span>
                        </div>

                        <div className="flex items-center">
                            <img src={view} alt="Views Icon" className="w-4 h-4 mr-2" />
                            <span className="text-xs sm:text-base md:text-lg">
                                {activeCard.views} views</span>
                        </div>
                    </div>

                    {/* Right Section: Action Icons */}
                    <div className="flex items-center md:gap-4 gap-3">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={handleLikeClick}
                        >
                            <img
                                src={isLiked ? liked : like}
                                alt="Like Icon"
                                className="md:w-4 md:h-4 w-3 h-3 mr-2"
                            />
                            <span className="text-xs sm:text-base md:text-lg">{likeCount}</span>
                        </div>

                        {windowWidth >= 600 && (
                            <div className="flex items-center md:gap-4 gap-3">
                                {/* Upvote Button */}
                                <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("upvote")}>
                                    <img src={isUpvoted ? up_filled : up} alt="Upvote Icon" className="w-4 h-4" />
                                </button>

                                {/* Downvote Button */}
                                <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("downvote")}>
                                    <img src={isDownvoted ? down_filled : down} alt="Downvote Icon" className="w-4 h-4" />
                                </button>

                                {/* Share Button */}
                                <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("share")}>
                                    <img src={isShared ? shared : share} alt="Share Icon" className="w-4 h-4" />
                                </button>

                                {/* Social Media Icons (Slide In) */}
                                {isShared && (
                                    <div className="flex items-center space-x-4 transition-transform duration-300">
                                        <img src={facebook} alt="Facebook Icon" className="w-5 h-5" />
                                        <img src={instagram} alt="Instagram Icon" className="w-5 h-5" />
                                        <img src={linkedin} alt="LinkedIn Icon" className="w-5 h-5" />
                                    </div>
                                )}

                                {/* Bookmark Button */}
                                <button className="hover:text-white transition flex items-center" onClick={() => handleIconClick("bookmark")}>
                                    <img src={isBookmarked ? bookmark_filled : bookmark} alt="Bookmark Icon" className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Green Line */}
                <div className="border-t-2 border-[#ADFF00] mt-2"></div>
            </div>

            <div className="md:my-8 my-5">
                <Reactions />
            </div>

            {/* Comment Input */}
            <div className="flex flex-col space-y-4 mb-6 font-mowaq">
                <div className="flex items-center space-x-4 w-full max-sm:w-1/2">
                    <img
                        src={user}
                        alt="User Avatar"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    />
                    <input
                        type="text"
                        placeholder="Comment your thoughts"
                        className={`flex-1 bg-transparent border rounded-md md:px-4 px-2.5 md:py-2 py-1 text-[#ADFF00] text-xs sm:text-base md:text-lg placeholder-[#ADFF00] focus:outline-none ${isHighlighted
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
                                src={user}
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
                        <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg border-2 border-[#ADFF00]  animate-fade-in-out transition-opacity duration-500 w-max">
                            ✅ Subscription successful!
                        </div>
                    </div>
                )}

                <div className="pt-20"></div>
            </div>
        </div>
    )
}

export default BlogModalBody