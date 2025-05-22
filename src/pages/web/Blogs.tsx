import React, { useEffect, useState } from 'react';
import BlogContent from '../../components/web/BlogContent';
import { getBlogs } from '../../utils/blogs';
import BlogCards from '../../components/web/BlogCards';
import Loader from '../../components/core/Loader';

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

const Blogs: React.FC = () => {
    const [activeCard, setActiveCard] = useState<Blog | null>(null);
    const [selectedBlogId, setSelectedBlogId] = useState<string>('');
    const [blogs, setBlogs] = useState<Blog[]>();
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [nextImage, setNextImage] = useState<string | null>(null);
    const [fadeIn, setFadeIn] = useState<boolean>(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await getBlogs(1, 10);

            if (response.success) {
                const updatedBlogs = response.data?.blogs.map((blog: Blog, index: number) => ({
                    ...blog,
                    id: index,
                    blogId: blog.id,
                }));
                setBlogs(updatedBlogs);
                setSelectedBlogId(response.data.blogs[0].id.toString());
                setNextImage(response.data.blogs[0].image_url)
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (nextImage) {
            requestAnimationFrame(() => {
                setFadeIn(true);
            });
            const timer = setTimeout(() => {
                setCurrentImage(nextImage);
                setNextImage(null);
                setFadeIn(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [nextImage]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        if (selectedBlogId !== '') {
            const selectedCard = blogs?.find((blog) => blog.blogId === selectedBlogId);
            if (selectedCard) {
                setActiveCard(selectedCard);
                if (selectedCard.image_url) {
                    setNextImage(selectedCard.image_url);
                }

            }
        }
    }, [selectedBlogId])

    if (loading) return <Loader />;
    
    return (

        <div className="relative w-full min-h-screen flex flex-col">
            {/* Background Image(s) */}
            <div className="fixed inset-0 w-full h-full z-0">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${currentImage})`,
                        filter: "brightness(0.6)",
                        opacity: 1,
                    }}
                />
                {nextImage && (
                    <div
                        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${fadeIn ? "opacity-100" : "opacity-0"
                            }`}
                        style={{
                            backgroundImage: `url(${nextImage})`,
                            filter: "brightness(0.6)",
                        }}
                    ></div>
                )}
            </div>

            {/* Main Layout */}
            <div className="w-full flex lg:flex-row flex-col-reverse h-screen overflow-hidden">
                <BlogCards
                    blogs={blogs}
                    loading={loading}
                    selectedBlogId={selectedBlogId}
                    setSelectedBlogId={setSelectedBlogId}
                />

                <div className="flex-grow flex lg:pt-20 w-full bg-black overflow-y-auto lg:px-20 sm:px-10 px-6">
                    <BlogContent
                        activeCard={activeCard}
                        selectedBlogId={selectedBlogId}
                    />
                </div>
            </div>
        </div>
    );
};

export default Blogs;