import React, { useState, useEffect } from 'react';
import { FaCheck, FaImage, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createBlog, updateBlog, getBlogById } from '../../services/blogService';
import BlogPreview from './BlogPreview';
import RichTextEditor from './RichTextEditor';

interface BlogEditorProps {
    isEditing?: boolean;
    blogId?: string;
}

const BlogEditorPage: React.FC<BlogEditorProps> = ({ isEditing = false, blogId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(isEditing);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // If editing, fetch the blog data when component mounts
    useEffect(() => {
        const fetchBlogData = async () => {
            if (isEditing && blogId) {
                try {
                    setInitialLoading(true);
                    console.log('Fetching blog with ID:', blogId);
                    
                    // Make sure we're passing a string to getBlogById
                    const response = await getBlogById(String(blogId));
                    console.log('Blog data received:', response);
                    
                    if (response) {
                        setTitle(response.blog.title || '');
                        setDescription(response.blog.description || '');
                        setContent(response.blog.content || '');
                        setImageUrl(response.blog.image_url || '');
                        setError(null);
                    } else {
                        throw new Error('Blog not found');
                    }
                } catch (err) {
                    console.error('Error fetching blog data:', err);
                    setError('Failed to load blog data. Please try again later.');
                } finally {
                    setInitialLoading(false);
                }
            }
        };

        fetchBlogData();
    }, [isEditing, blogId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!title || !content) {
            setError('Title and content are required');
            return;
        }

        try {
            setLoading(true);

            const blogData = {
                title,
                description,
                content,
                image_url: imageUrl,
                // The author_id would be pulled from the user context in a real application
                author_id: 'mock-user-id'
            };

            if (isEditing && blogId) {
                await updateBlog(String(blogId), blogData);
                setSuccessMessage('Blog updated successfully!');
            } else {
                await createBlog(blogData);
                setSuccessMessage('Blog created successfully!');
            }

            // Show success message briefly before redirecting
            setTimeout(() => {
                navigate('/dashboard/blogs');
            }, 1500);
        } catch (err) {
            console.error('Error saving blog:', err);
            setError('Failed to save blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Loading state UI
    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0FF06] mb-4"></div>
                    <p className="text-white">Loading blog content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/dashboard/blogs')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-700"
                        title="Back to Dashboard"
                    >
                        <FaArrowLeft className="text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        {isEditing ? 'Edit Blog' : 'Create New Blog'}
                    </h1>
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

            {/* Main Content */}
            <div className="flex-1 p-4">
                {/* Side by side layout - Form and Preview */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Form Section - Left side */}
                    <div className="md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-white" htmlFor="title">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0FF06] text-white"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-white" htmlFor="description">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0FF06] text-white"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-white" htmlFor="imageUrl">
                                    Image URL
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="imageUrl"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#A0FF06] text-white"
                                    />
                                    <div className="flex items-center justify-center bg-gray-800 px-3 rounded-r-md border-t border-r border-b border-gray-600">
                                        <FaImage className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-white" htmlFor="content">
                                    Content *
                                </label>
                                <RichTextEditor value={content} onChange={setContent} />
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#A0FF06] text-black font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#A0FF06] focus:ring-opacity-50 flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                                            <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="mr-2" />
                                            {isEditing ? 'Update Blog' : 'Post Blog'}
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/blogs')}
                                    className="px-6 py-2 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section - Right side */}
                    <div className="revolving-line-border md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium mb-4 text-white">Preview</h3>
                        <div className="h-[600px] overflow-y-auto">
                            <BlogPreview
                                title={title}
                                description={description}
                                content={content}
                                imageUrl={imageUrl}
                                showFullContent={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditorPage;