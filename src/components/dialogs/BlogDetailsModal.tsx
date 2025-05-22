import React, { useState, useRef, useEffect } from "react";
import BlogSideRibbon from "../web/BlogSideRibbon";
import ModalWrapper from "./ModalWrapper";
import { IoMdClose } from "react-icons/io";
import BlogModalBody from "../web/BlogModalBody";

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
    setIsOpen: (value: boolean) => void;
    activeCard: Blog;
}

const BlogDetailModal: React.FC<ModalProps> = ({
    isOpen,
    setIsOpen,
    activeCard
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <ModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="max-w-4xl w-11/12 flex !bg-black"
            height="h-[90vh]"
        >

            <div className="w-full flex flex-col items-end h-full relative">
                <BlogModalBody activeCard={activeCard} windowWidth={windowWidth} scrollableRef={scrollableRef}  />
            </div>

            <BlogSideRibbon onScrollToTop={scrollToTop} onClose={() => setIsOpen(false)} />
            <IoMdClose
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-2xl cursor-pointer text-white hover:text-[#ADFF00]"
            />
        </ModalWrapper>
    );
};

export default BlogDetailModal;