import React, { useState, useEffect } from 'react';
import { getBlogs, deleteBlog } from '../../services/blogService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaCalendarAlt, FaSignOutAlt, FaArrowLeft} from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';

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

interface UserProfile {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
}

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-80 animate-fade-in border-[#A0FF06]">
                <div className="flex items-center mb-4 text-red-500">
                    <FaTrash size={24} className="mr-2" />
                    <h3 className="text-lg font-semibold text-[#A0FF06]">{title}</h3>
                </div>

                <p className="text-[#A0FF06] mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlogDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

    const getUserProfile = async () => {
        // This would be replaced with an actual API call
        return {
            id: 'mock-user-id',
            role: 'superadmin',
            first_name: 'Admin',
            last_name: 'User'
        };
    };

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await AuthService.signOut();
            setIsLogoutDialogOpen(false);
            window.location.href = '/auth/login'
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user profile
                const profile = await getUserProfile();
                setUserProfile(profile);

                // Fetch blogs
                const data = await getBlogs(page, 10, profile?.id);
                if (data && data.blogs) {
                    setBlogs(data.blogs);
                    setTotalPages(data.totalPages || 1);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load blogs. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);



    const handleDeleteClick = (blog: Blog) => {
        setBlogToDelete(blog);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!blogToDelete) return;

        try {
            setLoading(true);
            await deleteBlog(blogToDelete.id);

            // Refresh blog list after deletion
            const data = await getBlogs(page, 10);
            if (data && data.blogs) {
                setBlogs(data.blogs);
            }

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

    const handleViewBlog = (blog: Blog) => {
        setSelectedBlog(blog);
        setIsViewMode(true);
    };

    const handleCreateBlog = () => {
        navigate('/dashboard/blogs/create');
    };

    const handleEditBlog = (blogId: string) => {
        navigate(`/dashboard/blogs/edit/${blogId}`);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-white">My Blogs</h2>

                {/* User Profile Section */}
                <div className="flex items-center mb-6 p-3 bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#A0FF06] flex items-center justify-center text-black font-bold">
                        {userProfile?.first_name?.charAt(0).toUpperCase() || <FiUser size={18} />}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-white">
                            {userProfile?.first_name} {userProfile?.last_name}
                        </div>
                        <div className="text-xs text-gray-400">{userProfile?.role}</div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A0FF06]"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-400 text-center p-4">No blogs found</p>
                ) : (
                    <ul className="space-y-2">
                        {blogs.map((blog) => (
                            <li
                                key={blog.id}
                                className={`p-2 rounded-md cursor-pointer hover:bg-gray-700 ${selectedBlog?.id === blog.id ? 'bg-gray-700 border-l-4 border-[#A0FF06]' : ''}`}
                                onClick={() => handleViewBlog(blog)}
                            >
                                <div className="text-sm font-medium text-white truncate">{blog.title}</div>
                                <div className="text-xs text-gray-400">
                                    {blog.posted_at ? new Date(blog.posted_at).toLocaleDateString() : 'Draft'}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 bg-gray-700 rounded text-white">{page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogoutClick}
                    className="mt-6 w-full px-4 py-2 rounded-md border border-[#A0FF06] flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
                >
                    <FaSignOutAlt size={20} />
                    <span className="text-[#A0FF06]">Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
                    <h1 className="text-2xl font-bold text-white">Blog Dashboard</h1>

                    <div className="flex items-center">
                        <button
                            onClick={handleCreateBlog}
                            className="px-4 py-2 bg-[#A0FF06] text-black font-bold rounded-md hover:bg-opacity-90 flex items-center mr-4"
                        >
                            <FaPlus className="mr-2" />
                            Create Blog
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-[#A0FF06] flex items-center justify-center text-black font-bold">
                                {userProfile?.first_name?.charAt(0).toUpperCase() || <FiUser size={18} />}
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-white">
                                    {userProfile?.first_name} {userProfile?.last_name}
                                </div>
                                <div className="text-xs text-gray-400">{userProfile?.role}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                <div className="p-4">
                    {successMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
                
                {/* Content based on view mode */}
                <div className="p-4">
                    {!isViewMode ? (
                        // Blog List View
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <div className='flex items-center gap-2'>
                                        <div className='w-6 h-6 rounded-full border-t border-l border-white animate-spin' /> Loading...
                                    </div>
                                </div>
                            ) : blogs.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-gray-400">
                                    <p>No blogs found. Create your first blog using the button above!</p>
                                </div>
                            ) : (
                                blogs.map((blog) => (
                                    <div key={blog.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                        {blog.image_url && (
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={blog.image_url}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-white mb-2 truncate">{blog.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {blog.description || blog.content.substring(0, 100) + '...'}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-500">
                                                    {blog.posted_at ? new Date(blog.posted_at).toLocaleDateString() : 'Draft'}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewBlog(blog)}
                                                        className="p-2 bg-[#A0FF06] text-black rounded hover:bg-opacity-90"
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditBlog(blog.id)}
                                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(blog);
                                                        }}
                                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Single Blog View
                        selectedBlog && (
                            <div className="p-2">
                                <div className=" mb-4 ml-2">
                                        <button
                                            onClick={() => {
                                                setIsViewMode(false);
                                                setSelectedBlog(null);
                                            }}
                                            className="px-2 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                                        >
                                            <FaArrowLeft className="text-white" />
                                        </button>
                                    </div>
                            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                
                                {selectedBlog.image_url && (
                                    <div className="w-full h-64 overflow-hidden">
                                        <img
                                            src={selectedBlog.image_url}
                                            alt={selectedBlog.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center text-sm text-gray-400">
                                            <div className="flex items-center mr-4">
                                                <FaCalendarAlt className="mr-1" />
                                                <span>{selectedBlog.posted_at ? new Date(selectedBlog.posted_at).toLocaleDateString() : 'Draft'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaEye className="mr-1" />
                                                <span>{selectedBlog.views || 0} views</span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditBlog(selectedBlog.id)}
                                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(selectedBlog)}
                                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <h1 className="text-3xl font-bold mb-4 text-white">{selectedBlog.title}</h1>

                                    {selectedBlog.description && (
                                        <p className="text-gray-300 mb-6 italic">{selectedBlog.description}</p>
                                    )}

                                    <div className="prose text-gray-200 max-w-none">
                                        {selectedBlog.content}
                                    </div>

                                    
                                </div>
                            </div>
                        </div>
                        )
                    )}
                </div>
            </div>


            <ConfirmDialog
                isOpen={isLogoutDialogOpen}
                onClose={() => setIsLogoutDialogOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout from your account?"
                confirmButtonText="Logout"
            />
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete the blog titled "${blogToDelete?.title}"? This action cannot be undone.`}
                confirmButtonText="Delete"
            />
        </div>
    );
};

export default BlogDashboard;