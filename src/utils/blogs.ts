import apiClient from "./apiClient";

interface Blog {
    id: string;
    title: string;
    author: string;
    authorId: string;
    published: string;
    likes: number;
    dislikes: number;
    content: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


// ===================== Blogs =======================
export const getBlogs = async (
    page = 1,
    limit = 10,
    authorId?: string
): Promise<any> => {
    try {
        const response = await apiClient.get<PaginatedResponse<Blog>>(
            `/blogs?page=${page}&limit=${limit}${authorId ? `&author_id=${authorId}` : ''}`
        );
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error fetching blogs:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch blogs'
        };
    }
};

export const getBlogById = async (id: string): Promise<any> => {
    try {
        const response = await apiClient.get<Blog>(`/blogs/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch blog!'
        };
    }
};

export const createBlog = async (
    blogData: {
        title: string;
        description?: string;
        content: string;
        image_url?: string;
        author_id?: string;
    }
): Promise<ApiResponse<Blog>> => {
    try {
        const response = await apiClient.post<Blog>('/blogs', blogData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error creating blog:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to create blog'
        };
    }
};

export const updateBlog = async (
    id: string,
    blogData: {
        title?: string;
        description?: string;
        content?: string;
        image_url?: string;
        author_id?: string;
    }
): Promise<ApiResponse<Blog>> => {
    if (!id) {
        const error = 'Blog ID is required for update';
        console.error(error);
        return {
            success: false,
            error
        };
    }

    try {
        const response = await apiClient.put<Blog>(`/blogs/${id}`, blogData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error(`Error updating blog ${id}:`, error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || `Failed to update blog ${id}`
        };
    }
};

export const deleteBlog = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/blogs/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error(`Error deleting blog ${id}:`, error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || `Failed to delete blog ${id}`
        };
    }
};


// ===================== Comments =======================
export const getComments = async (blog_id: string) => {
    try {
        const response = await apiClient.get(`/blogs/get-comments/${blog_id}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error adding comment to blog ${blog_id}:`, error);
        return { success: false, data: error };

    }
};

export const addComment = async (id: string, content: string) => {
    try {
        const data = {
            blog_id: id,
            content
        }
        const response = await apiClient.post(`/blogs/add-comment`, data);
        return response.data;
    } catch (error) {
        console.error(`Error adding comment to blog ${id}:`, error);
        throw error;
    }
};

export const updateComment = async (comment_id: string, content: string) => {
    try {
        const response = await apiClient.put(`/blogs/update-comment/${comment_id}`, { content });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteComment = async (comment_id: string) => {
    try {
        const response = await apiClient.delete(`/blogs/delete-comment/${comment_id}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const bookmarkBlog = async (id: string) => {
    try {
        const response = await apiClient.post(`/blogs/${id}/bookmark`);
        return response.data;
    } catch (error) {
        console.error(`Error bookmarking blog ${id}:`, error);
        throw error;
    }
};

export const likeBlog = async (id: string) => {
    try {
        const response = await apiClient.post(`/blogs/${id}/like`);
        return response.data;
    } catch (error) {
        console.error(`Error liking blog ${id}:`, error);
        throw error;
    }
};
