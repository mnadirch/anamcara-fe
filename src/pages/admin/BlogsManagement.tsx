import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteBlog, getBlogs } from '../../utils/blogs';
import { useAuth } from '../../context/AuthProvider';
import DeleteBlogModal from '../../components/dialogs/DeleteBlogModal';

interface Blog {
    id: string;
    title: string;
    description?: string;
    content: string;
    image_url?: string;
    posted_at?: string;
    views?: number;
    author_id?: string;
}

const BlogsManagement = () => {
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const { userData } = useAuth();

    const handleDeleteClick = (blog: Blog) => {
        setBlogToDelete(blog);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!blogToDelete) return;

        try {
            setLoading(true);
            await deleteBlog(blogToDelete.id);
            setOffset(0);
            setBlogs([]);
            fetchBlogs(0, true);

            setSuccessMessage('Blog deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error deleting blog:', err);
            setError('Failed to delete blog. Please try again.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
            setIsDeleteDialogOpen(false);
            setBlogToDelete(null);
        }
    };

    const handleCreateBlog = () => {
        navigate('/admin/blogs/create');
    };

    const handleEditBlog = (blogId: string) => {
        navigate(`/admin/blogs/edit/${blogId}`);
    };

    const handleViewBlog = (blogId: string) => {
        navigate(`/admin/blogs/blog-details/${blogId}`);
    };

    const handleLoadMore = () => {
        const newOffset = offset + limit;
        setOffset(newOffset);
        fetchBlogs(newOffset);
    };

    const fetchBlogs = async (currentOffset: number, reset: boolean = true) => {
        try {
            reset ? setLoading(true) : setLoadingMore(true);

            if (userData?.id) {
                const response: any = await getBlogs(currentOffset, limit, userData.id);

                if (response.success) {
                    const newBlogs = response.data?.blogs || [];

                    if (reset) {
                        setBlogs(newBlogs);
                    } else {
                        setBlogs(prev => [...prev, ...newBlogs]);
                    }

                    // If we get fewer blogs than the limit, there are no more to load
                    setHasMore(newBlogs.length === limit);
                } else {
                    setError(response.message || 'Failed to load blogs');
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load blogs. Please try again later.');
        } finally {
            reset ? setLoading(false) : setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (userData.id) {
            fetchBlogs(0, true);
        }
    }, [userData]);

    return (
        <div className='w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4'>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-white font-mowaq'>Manage Blogs</h2>
                    <p className="text-gray-400 text-sm mt-1">Create, edit, and manage your blog posts</p>
                </div>

                <button
                    onClick={handleCreateBlog}
                    className="flex items-center px-4 py-2 bg-[#A0FF06] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Create Blog
                </button>
            </div>

            {/* Alert Messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-300">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
                    {error}
                </div>
            )}

            {/* Blog List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className='flex items-center gap-2 text-gray-400'>
                        <div className='w-6 h-6 rounded-full border-t-2 border-l-2 border-[#A0FF06] animate-spin' />
                        Loading blogs...
                    </div>
                </div>
            ) : (
                <>
                    {blogs.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="text-gray-400 mb-4">No blogs found</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="bg-[#272727] rounded-lg overflow-hidden border border-gray-700 hover:border-[#A0FF06]/50 transition-colors flex flex-col gap-2">
                                    {blog.image_url && (
                                        <div
                                            className="h-48 overflow-hidden cursor-pointer"
                                            onClick={() => handleViewBlog(blog.id)}
                                        >
                                            <img
                                                src={blog.image_url}
                                                alt={blog.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image';
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3
                                            className="text-lg font-bold text-white mb-2 cursor-pointer hover:text-[#A0FF06] transition-colors"
                                            onClick={() => handleViewBlog(blog.id)}
                                        >
                                            {blog.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                                            {blog.description || blog.content.substring(0, 120) + '...'}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-gray-500">
                                                {blog.posted_at ? new Date(blog.posted_at).toLocaleDateString() : 'Draft'}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditBlog(blog.id)}
                                                    className="p-2 text-gray-300 hover:text-blue-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(blog);
                                                    }}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {blogs.length > 9 && hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="w-full flex items-center px-6 py-2 text-white bg-secondary font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className='w-5 h-5 rounded-full border-t-2 border-l-2 border-black animate-spin mr-2' />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        See More
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Delete confirmation modal */}
            <DeleteBlogModal
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default BlogsManagement;