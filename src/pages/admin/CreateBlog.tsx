import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, updateBlog, getBlogById } from '../../utils/blogs';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { Button, Card, Spin } from 'antd';

import ImageUploader from '../../components/addons/ImageUploder';
import BlogEditorPreview from '../../components/admin/BlogEditorPreview';


interface BlogEditorProps {
  blogId?: string;
}

const CreateBlog: React.FC<BlogEditorProps> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const currentBlogId = params.id;
  const [formData, setFormData] = useState({
    content: '',
    description: '',
    id: '',
    image_url: '',
    title: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(!currentBlogId);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    console.log(id, value)
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  const handleImageClear = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);

      const blogData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        image_url: formData.image_url,
        author_id: 'mock-user-id'
      };

      if (currentBlogId) {
        await updateBlog(String(currentBlogId), blogData);
        setSuccessMessage('Blog updated successfully!');
      } else {
        await createBlog(blogData);
        setSuccessMessage('Blog created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/blogs');
      }, 1500);
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        if (currentBlogId) {

          setInitialLoading(true);
          const response = await getBlogById(String(currentBlogId));
          if (response) {
            setFormData(response.data?.blog);
            setError(null);
          } else {
            throw new Error('Blog not found');
          }
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog data. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBlogData();
  }, [currentBlogId]);
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1b1b1b]">
        <div className="flex flex-col items-center">
          <Spin size="large" />
          <p className="text-white mt-4">Loading blog content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1b1b1b]">

      <div className="bg-[#272727] p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <Button
            type="text"
            icon={<FaArrowLeft />}
            onClick={() => navigate('/admin/blogs')}
            className="mr-4 text-white hover:text-[#A0FF06]"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {(currentBlogId) ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>
      </div>


      <div className="p-4">
        {successMessage && (
          <div className="bg-green-900/30 border-l-4 border-[#A0FF06] text-green-300 p-4 mb-6">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-300 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
      </div>


      <form onSubmit={handleSubmit} className="flex-1 p-4">
        <div className="flex flex-col md:flex-row gap-6">

          <Card className="md:w-1/2 bg-[#272727] border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData?.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-gray-700 focus:border-[#A0FF06] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A0FF06] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData?.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-gray-700 focus:border-[#A0FF06] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A0FF06] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Featured Image
                </label>
                <ImageUploader
                  initialImageUrl={formData.image_url}
                  onImageUpload={handleImageUpload}
                  onImageClear={handleImageClear}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white" htmlFor="content">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={formData?.content}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-gray-700 focus:border-[#A0FF06] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A0FF06] text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FaCheck className="mr-2" />}
                  loading={loading}
                  className="px-6 py-2 h-auto bg-[#A0FF06] hover:bg-[#A0FF06]/90 !text-black font-medium"
                >
                  {loading ?
                    ((currentBlogId) ? 'Updating...' : 'Creating...') :
                    ((currentBlogId) ? 'Update Blog' : 'Post Blog')
                  }
                </Button>

                <Button
                  type="default"
                  onClick={() => navigate('/admin/blogs')}
                  className="px-6 py-2 h-auto border-gray-700 text-gray-300 hover:text-white hover:border-[#A0FF06]/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>


          <Card className="md:w-1/2 bg-[#272727] border-gray-700">
            <h3 className="text-lg font-medium mb-4 text-white">Preview</h3>
            <div className="bg-[#1b1b1b] p-4 rounded border border-gray-700">
              <BlogEditorPreview
                title={formData.title}
                description={formData.description}
                content={formData.content}
                imageUrl={formData.image_url}
                showFullContent={true}
              />
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;