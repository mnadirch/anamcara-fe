import React, { useRef, useEffect, useState } from "react";

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

interface CardsProps {
  selectedBlogId: string;
  setSelectedBlogId: (value: string) => void;
  blogs: Blog[] | undefined;
  loading: boolean;
}

const BlogCards: React.FC<CardsProps> = ({
  selectedBlogId,
  blogs,
  loading,
  setSelectedBlogId
}) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragDistance(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = clientX - startX;
    setDragDistance(distance);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 50;

    if (Math.abs(dragDistance) > swipeThreshold) {
      const direction = dragDistance > 0 ? -1 : 1;
      const blogLength = blogs?.length || 0;
      const currentIndex = blogs?.findIndex((blog) => blog.blogId === selectedBlogId) || 0;
      const nextIndex = (currentIndex + direction + blogLength) % blogLength;
      if (nextIndex >= 0 && nextIndex < blogLength) {
        const selectedCard = blogs && blogs[nextIndex];
        if (selectedCard?.blogId) {
          setSelectedBlogId(selectedCard.blogId);
        }
      }
    }
    setDragDistance(0);
  };

  const handleCardSelect = (blogId: string) => {
    if (!isDragging && blogId) {
      setSelectedBlogId(blogId);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-fit lg:h-full lg:pt-20 fixed bottom-0 left-0 flex flex-col lg:relative md:py-6 py-3">
      {blogs && blogs?.length > 0 ? (
        isMobile ? (
          <div className="w-full flex items-center h-full">
            <div
              className="w-full overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory touch-pan-x"
              ref={cardsRef}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{
                transform: `translateX(${dragDistance}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <div className="w-full flex h-full space-x-6 px-8 py-2">
                {blogs?.map((card) => {
                  const isActive = selectedBlogId === '' ? blogs[0].blogId : selectedBlogId;
                  return (
                    <div
                      key={card.id}
                      className={`bg-[#505050] bg-opacity-70 max-h-[240px] font-calibri flex-grow h-full text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer max-w-[300px] w-full snap-center flex flex-col justify-between shrink-0 transition-all duration-300 border-2 ${isActive === card.blogId ? 'opacity-100 border-[#ADFF00]' : ' scale-95 opacity-70 border-transparent'}`}
                      onClick={() => handleCardSelect(card.blogId)}
                    >
                      {/* Card content */}
                      <div className="h-[2px] w-full bg-gray-400 group-hover:bg-[#ADFF00] transition-all duration-300 mb-3 sm:mb-4" />

                      <h3 className="text-sm md:h-9 h-7 font-bold transition-transform duration-700 group-hover:translate-y-[-5px]">
                        {card.title.length > 40
                          ? `${card.title.slice(0, 40)}...`
                          : card.title}
                      </h3>

                      <p className="text-xs mt-2 h-20 transition-transform duration-400 group-hover:translate-y-[-3px]">
                        {card.description.length > 100
                          ? `${card.description.slice(0, 100)}...`
                          : card.description}
                      </p>
                    </div>
                  )
                }
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Vertical Layout */}
            <div className="flex flex-col items-center relative max-h-[calc(100vh-120px)] lg:px-10 px-5">
              {/* Scroll Up Button */}
              <button
                onClick={() => cardsRef.current?.scrollBy({ top: -200, behavior: "smooth" })}
                className="text-[#ADFF00] text-xl absolute z-10 top-[-15px] hover:text-[#8CC800] transition-colors"
              >
                ▲
              </button>

              {/* Scrollable Cards Container */}
              <div
                ref={cardsRef}
                className="overflow-y-auto flex flex-col space-y-4 scroll-smooth no-scrollbar md:mt-7 max-lg:mt-15 w-[340px]"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div
                      key={index}
                      className="relative bg-[#505050] min-h-[200px] bg-opacity-65 text-white p-6 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 w-full font-normal animate-pulse"
                    >
                      <div className="h-[2px] w-full bg-gray-400 mb-4"></div>
                      <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                    </div>
                  ))
                ) : (
                  blogs?.map((card) => {
                    const isActive = selectedBlogId === '' ? blogs[0].blogId : selectedBlogId;
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleCardSelect(card.blogId)}
                        className={`relative bg-[#505050] min-h-[200px] bg-opacity-65 text-white p-6 rounded-xl shadow-lg group overflow-hidden cursor-pointer transition-all duration-500 w-full font-normal border-2 ${isActive === card.blogId ? ' border-[#ADFF00]' : 'border-transparent'
                          }`}
                        style={{ fontFamily: '"Calibri", sans-serif' }}
                      >
                        <div className="h-[2px] w-full bg-gray-400 group-hover:bg-[#ADFF00] transition-all duration-300 mb-4" />

                        <h3 className="text-lg font-bold transition-transform duration-700 group-hover:translate-y-[-5px]">
                          {card.title.length > 60
                            ? `${card.title.slice(0, 60)}...`
                            : card.title}
                        </h3>

                        <p className="text-sm mt-2 transition-transform duration-400 group-hover:translate-y-[-3px]">
                          {card.description.length > 100
                            ? `${card.description.slice(0, 100)}...`
                            : card.description}
                        </p>
                      </div>
                    )
                  }
                  ))}
              </div>

              {/* Scroll Down Button */}
              <button
                onClick={() => cardsRef.current?.scrollBy({ top: 200, behavior: "smooth" })}
                className="text-[#ADFF00] text-xl mt-2 hover:text-[#8CC800] transition-colors"
              >
                ▼
              </button>
            </div>
          </>
        )) : (
        <div className="w-[320px] md:h-full lg:px-10 px-5  flex-grow flex items-center justify-center text-center ">
          No blog found!
        </div>
      )}
    </div>
  );
};

export default BlogCards;
