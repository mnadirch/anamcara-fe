import apiClient from "./apiClient";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const createThreadReport = async (data: any): Promise<any> => {
    try {
        const response = await apiClient.post(`/reports/create-report`, data);
        return {
            success: true,
            // @ts-ignore
            message: response.data.message || 'Thread Report created successfully'
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.response?.data.message || error.response?.data.error || 'An unexpected error occurred'
        };
    }
};

const deleteSpamThread = async (thread_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(`/threads/remove-spam-thread/${thread_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.response?.data.message || error.response?.data.error || 'An unexpected error occurred'
        };
    }
};

const getReportedThreads = async (): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/reports/get-all-reports`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            // @ts-ignore
            message: error.response?.data.message || error.response?.data.error || 'An unexpected error occurred'
        };
    }
}

export { createThreadReport, deleteSpamThread, getReportedThreads };