import apiClient from './apiClient';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const getAllCategories = async (): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/categories/get-all-categories`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

const addCategory = async (data: any) => {
    try {
        const response = await apiClient.post(`/categories/create-category`, data);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.response?.data.error || 'An unexpected error occurred'
        };
    }
};

const updateCategory = async (category_id: string, data: any) => {
    try {
        const response = await apiClient.put(`/categories/update-category/${category_id}`, data);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

const deleteCategory = async (category_id: string) => {
    try {
        const response = await apiClient.delete(`/categories/delete-category/${category_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

const toggleCategoryStatus = async (category_id: string, is_active: boolean): Promise<ApiResponse<any>> => {
    try {
        const data = {
            is_active
        } as const;
        const response = await apiClient.put(`/categories/toggle-category-status/${category_id}`, data);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

export {
    getAllCategories,
    toggleCategoryStatus,
    addCategory,
    updateCategory,
    deleteCategory,
};