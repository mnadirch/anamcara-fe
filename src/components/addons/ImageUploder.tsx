import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaImage, FaSpinner, FaTimes, FaCheckCircle } from 'react-icons/fa';
import supabase from '../../config/supabase';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUpload: (url: string) => void;
  onImageClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImageUrl = '',
  onImageUpload,
  onImageClear
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewSrc, setPreviewSrc] = useState<string>(initialImageUrl);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewSrc(initialImageUrl);
      setUploadSuccess(true);
    }
  }, [initialImageUrl]);


  const createLocalPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const getConsistentUrl = (url: string): string => {

    const baseUrl = url.split('?')[0];

    return `${baseUrl}?t=${Date.now()}`;
  };

  const uploadToSupabase = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {

      createLocalPreview(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `blog_images/${fileName}`;


      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);


      const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) throw error;


      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }


      console.log('Uploaded Image URL:', publicUrlData.publicUrl);

      const consistentUrl = getConsistentUrl(publicUrlData.publicUrl);


      setPreviewSrc(consistentUrl);
      onImageUpload(consistentUrl);


      setUploadProgress(100);
      setUploadSuccess(true);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadSuccess(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    if (!file.type.includes('image/')) {
      setUploadError('Please select an image file');
      return;
    }


    if (file.size > 6 * 1024 * 1024) {
      setUploadError('Image size should be less than 6MB');
      return;
    }

    uploadToSupabase(file);
  };

  const handleClearImage = () => {
    setPreviewSrc('');
    setUploadError(null);
    setUploadSuccess(false);
    onImageClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageError = () => {

    if (!isUploading) {
      setUploadError('Image failed to load. Please try again or use a different image.');
    }
  };

  return (
    <div className="w-full">

      {previewSrc ? (
        <div className="relative mb-4 border-2 border-dashed border-gray-600 rounded-lg p-2 bg-gray-900">
          <div className="relative w-full h-48">
            <img
              src={previewSrc}
              alt="Blog cover"
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />

            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <FaSpinner className="animate-spin mx-auto mb-2" size={24} />
                  <p>Uploading...</p>
                </div>
              </div>
            )}

            {uploadSuccess && !isUploading && (
              <div className="absolute bottom-2 right-2 bg-green-600 text-white py-1 px-3 rounded-full flex items-center">
                <FaCheckCircle className="mr-1" />
                <span>Image uploaded successfully</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="mb-4 border-2 border-dashed border-gray-600 rounded-lg p-2 h-48 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <FaImage size={40} className="mx-auto mb-2" />
            <p>No image selected</p>
            <p className="text-sm">Upload a cover image in JPG, PNG, or WEBP format</p>
            <p className="text-xs mt-1">Maximum file size: 6MB</p>
          </div>
        </div>
      )}


      {isUploading && (
        <div className="w-full mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-[#A0FF06] h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}


      {uploadError && (
        <div className="text-red-500 text-sm p-2 mb-2 bg-red-100 bg-opacity-10 rounded">
          {uploadError}
        </div>
      )}


      <div className="flex flex-col space-y-2">

        <div className="flex">
          <label
            className={`flex-1 flex items-center justify-center px-4 py-2 ${isUploading || uploadSuccess ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#A0FF06] hover:bg-opacity-90'
              } text-black font-medium rounded-md cursor-pointer transition-all`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <FaCheckCircle className="mr-2" />
                Image Uploaded
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload Image
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isUploading || uploadSuccess}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;