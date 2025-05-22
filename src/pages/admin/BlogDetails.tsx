import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiEye, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { deleteBlog, getBlogById } from '../../utils/blogs';
import DeleteBlogModal from '../../components/dialogs/DeleteBlogModal';
import { toast } from 'react-toastify';
import BlogPostWithComments from '../../components/admin/BlogPostWithComments';

interface Blog {
    id: string;
    title: string;
    description?: string;
    content: string;
    image_url?: string;
    posted_at?: string;
    views?: number;
    author_id?: string;
    profiles?: {
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
}

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDeleteConfirm = async () => {
        if (!id) return;

        try {
            const response = await deleteBlog(id);
            if (response.success) {
                // @ts-ignore
                toast.success(response.data?.message || "Blog deleted successfully!");
                navigate('/admin/blogs');
            } else {
                toast.error(response.error || "Failed to delete blog");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the blog");
        } finally {
            setIsDeleteOpen(false);
        }
    };

    const handleEdit = () => {
        if (!blog) return;
        navigate(`/admin/blogs/edit/${blog.id}`);
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);

                if (id) {
                    const response = await getBlogById(id);
                    if (response.success) {
                        // @ts-ignore
                        setBlog(response.data?.blog);
                    } else {
                        setError('Failed to load blog');
                    }
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                setError('An error occurred while loading the blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center py-10">
            <div className='flex items-center gap-2 text-gray-400'>
                <div className='w-6 h-6 rounded-full border-t-2 border-l-2 border-[#A0FF06] animate-spin' />
                Loading blogs...
            </div>
        </div>
    );

    if (error) return (
        <div className="text-white p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
                Go Back
            </button>
        </div>
    );

    if (!blog) return (
        <div className="text-white p-6 text-center">
            <p className="mb-4">Blog not found</p>
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
                Go Back
            </button>
        </div>
    );

    return (
        <>
            <div className='w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] py-8 px-4 sm:px-6 lg:px-8'>
                {/* Back button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <FiArrowLeft className="h-5 w-5 mr-2" />
                        Back to Blogs
                    </button>
                </div>

                {/* Blog header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {blog.title}
                            </h1>
                            {blog.description && (
                                <p className="text-lg text-gray-400 max-w-3xl">
                                    {blog.description}
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <FiEdit2
                                onClick={handleEdit}
                                className="flex items-center gap-2 text-xl text-gray-300 cursor-pointer hover:text-white transition-colors"
                            />

                            <FiTrash2
                                onClick={() => setIsDeleteOpen(true)}
                                className="flex items-center gap-2 text-xl text-gray-300 cursor-pointer hover:text-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center">
                            {blog.profiles?.avatar_url ? (
                                <img
                                    src={blog.profiles.avatar_url}
                                    alt={`${blog.profiles.first_name} ${blog.profiles.last_name}`}
                                    className="h-10 w-10 rounded-full mr-3 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Author';
                                    }}
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <span className="block text-white font-medium">{blog.profiles?.first_name} {blog.profiles?.last_name}</span>
                                <span className="text-xs">Author</span>
                            </div>
                        </div>

                        {blog.posted_at && (
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                                    <FiCalendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-white font-medium">
                                        {new Date(blog.posted_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-xs">Published</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                                <FiEye className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-white font-medium">
                                    {blog.views?.toLocaleString() || 0}
                                </span>
                                <span className="text-xs">Views</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured image */}
                {blog.image_url && (
                    <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image';
                            }}
                        />
                    </div>
                )}

                {/* Blog content */}
                <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed space-y-6">
                        {blog.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-lg">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <BlogPostWithComments id={id} />
            
            {/* Delete confirmation modal */}
            <DeleteBlogModal
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
            />
        </>

    );
};

export default BlogDetails;