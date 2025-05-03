// src/services/blogService.ts
import api from './api'; // Adjust the import path as necessary
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Configure axios instance with authentication
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Get all blogs with pagination
// Get all blogs with pagination and optional author filter





/**
 * Fetch blogs with pagination and optional filtering
 * @param page - Page number to fetch
 * @param limit - Number of blogs per page
 * @param authorId - Optional filter for author ID
 * @returns - Promise with blog data and pagination info
 */
export const getBlogs = async (page = 1, limit = 10, authorId?: string) => {
  try {
    let url = `/blogs?page=${page}&limit=${limit}`;
    if (authorId) {
      url += `&author_id=${authorId}`;
    }
    const response = await api.get(url);
    console.log('Fetched Blogs:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Get a single blog by ID
export const getBlogById = async (id: string) => {
  if (!id) {
    console.error('Blog ID is required');
    throw new Error('Blog ID is required');
  }

  try {
    console.log(`Fetching blog with ID: ${id}`);
    const response = await api.get(`/blogs/${id}`);
    console.log('Blog data response:', response.data);
    
    if (!response.data) {
      throw new Error('Blog not found or empty response');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    throw error;
  }
};

// Like/unlike a blog
export const likeBlog = async (id: string) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking blog ${id}:`, error);
    throw error;
  }
};

// Bookmark/unbookmark a blog
export const bookmarkBlog = async (id: string) => {
  try {
    const response = await api.post(`/blogs/${id}/bookmark`);
    return response.data;
  } catch (error) {
    console.error(`Error bookmarking blog ${id}:`, error);
    throw error;
  }
};

// Add a comment to a blog
export const addComment = async (id: string, content: string) => {
  try {
    const response = await api.post(`/blogs/${id}/comment`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to blog ${id}:`, error);
    throw error;
  }
};

// Create a new blog
export const createBlog = async (blogData: {
  title: string;
  description?: string;
  content: string;
  image_url?: string;
  author_id?: string;
}) => {
  try {
    const response = await api.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update an existing blog
export const updateBlog = async (
  id: string,
  blogData: {
    title?: string;
    description?: string;
    content?: string;
    image_url?: string;
    author_id?: string;
  }
) => {
  if (!id) {
    console.error('Blog ID is required for update');
    throw new Error('Blog ID is required for update');
  }

  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    throw error;
  }
};

// Delete a blog
export const deleteBlog = async (id: string) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    throw error;
  }
};