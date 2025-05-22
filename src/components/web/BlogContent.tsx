import React, { useState } from "react";
import BlogDetailModal from "../dialogs/BlogDetailsModal";
import LoginModal from "./../dialogs/LoginModal";
import { FaThumbsUp, FaBell, FaComment, FaShare, FaBookmark } from "react-icons/fa";

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

interface ContentProps {
    activeCard: Blog | null;
    selectedBlogId: string;
}

const BlogContent: React.FC<ContentProps> = ({ activeCard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [hasNotified, setHasNotified] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);
    const [hasShared, setHasShared] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(activeCard?.likes_count || 0);
    const [comments, setComments] = useState(activeCard?.comments_count || 0);
    const [bookmarks, setBookmarks] = useState(activeCard?.bookmarks_count || 0);
    const [shares, setShares] = useState(45);

    const actions = [
        {
            icon: FaThumbsUp,
            state: liked,
            count: likes,
            toggle: () => toggleState(setLiked, setLikes, liked, likes),
        },
        {
            icon: FaBell,
            state: hasNotified,
            count: "Notify",
            toggle: () => !hasNotified && setHasNotified(true),
        },
        {
            icon: FaComment,
            state: hasCommented,
            count: comments,
            toggle: () => toggleState(setHasCommented, setComments, hasCommented, comments),
        },
        {
            icon: FaShare,
            state: hasShared,
            count: shares,
            toggle: () => toggleState(setHasShared, setShares, hasShared, shares),
        },
    ]

    if (!activeCard) {
        return (
            <div className="w-full flex items-center justify-center h-full text-center">
                <p>No blog selected. Please select a blog to view its content.</p>
            </div>
        );
    }

    const toggleState = (
        stateSetter: React.Dispatch<React.SetStateAction<boolean>>,
        countSetter: React.Dispatch<React.SetStateAction<number>>,
        currentState: boolean,
        count: number
    ) => {
        stateSetter(!currentState);
        countSetter(currentState ? count - 1 : count + 1);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div
            className="w-full h-full lg:pb-0 pb-20 md:pt-20 pt-[110px] flex font-calibri md:px-10 px-5">
            <div className="w-full transition-all duration-700 ease-in-out opacity-100 visible z-10">
                <div className="md:w-4/5 w-full flex flex-col justify-center">
                    {/* Title */}
                    <h1 className="text-xl font-mowaq max-sm:text-xl md:text-3xl lg:text-4xl font-bold mb-2 max-sm:mb-1.5 md:mb-3 lg:mb-4 leading-tight">
                        {activeCard.title}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-xs lg:text-2xl mb-3 sm:mb-4 md:mb-4 lg:mb-5 leading-relaxed opacity-60">
                        {activeCard.content.length > 200
                            ? `${activeCard.content.slice(0, 200)}...`
                            : activeCard.content.length > 100
                                ? `${activeCard.content.slice(0, 100)}...`
                                : activeCard.content}
                    </p>

                    {/* Action buttons and social interactions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-8">
                        <button
                            onClick={openModal}
                            className="px-4 py-2 text-sm font-medium border border-[#ADFF00] bg-[#ADFF00] text-black hover:bg-black hover:text-white transition-all duration-300"
                        >
                            Read the Story
                        </button>

                        <div className="flex items-center gap-4 sm:gap-8 mt-3 sm:mt-0 text-white">
                            {actions.map(({ icon: Icon, state, count, toggle }, i) => (
                                <div key={i} className="flex flex-col items-center cursor-pointer" onClick={toggle}>
                                    <Icon size={18} className={`transition ${state ? "text-[#ADFF00]" : "text-white"} hover:text-[#ADFF00]`} />
                                    <span className="text-sm sm:text-base mt-1">{count}</span>
                                </div>
                            ))}

                            {/* Bookmark Icon */}
                            <div className="flex flex-col items-center cursor-pointer">
                                <FaBookmark
                                    size={18}
                                    className={`transition cursor-pointer ${isBookmarked ? "text-[#ADFF00]" : "text-white"} hover:text-[#ADFF00]`}
                                    onClick={() => {
                                        setIsSocialModalOpen(true);
                                        setIsBookmarked(!isBookmarked);
                                        setBookmarks(isBookmarked ? bookmarks - 1 : bookmarks + 1);
                                    }}
                                />
                                <LoginModal isOpen={isSocialModalOpen} setIsOpen={setIsSocialModalOpen} />
                                <span className="text-sm sm:text-base mt-1">{bookmarks}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Detail Modal */}
            <BlogDetailModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                activeCard={activeCard}
            />
        </div>
    );
};

export default BlogContent;