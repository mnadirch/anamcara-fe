import { Conversation, Message } from "../types";
import apiClient from "./apiClient";

interface ConversationResponse {
    success: boolean;
    data: any;
}

interface MessagesResponse {
    success: boolean;
    data: {
        userMessage: Message;
        assistantMessage: Message;
    };
}

// Get all chats
export const getConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get<ConversationResponse>('/conversations');
    return response.data.data;
};

// Fetch a single conversation with its messages
export const getConversation = async (id: string): Promise<{ conversation: Conversation; messages: Message[] }> => {
    if (!id) throw new Error("Conversation ID is required");
    const response = await apiClient.get<ConversationResponse>(`/conversations/${id}`);
    return response.data.data;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
    if (!conversationId) throw new Error("Conversation ID is required");
    const response = await apiClient.get<ConversationResponse>(`/chat/messages/${conversationId}`);
    return response.data.data;
};

// Create a new conversation
export const createChat = async (title: string = 'New Conversation'): Promise<Conversation> => {
    if (!title.trim()) throw new Error("Title cannot be empty");
    const response = await apiClient.post<ConversationResponse>('/conversations', { title });
    return response.data.data;
};

// Update conversation title
export const updateChatTitle = async (id: string, title: string): Promise<Conversation> => {
    if (!id) throw new Error("Conversation ID is required");
    if (!title.trim()) throw new Error("Title cannot be empty");
    const response = await apiClient.put<ConversationResponse>(`/conversations/${id}`, { title });
    return response.data.data;
};

// Delete a conversation
export const deleteChat = async (id: string): Promise<{ success: boolean; data: any }> => {
    if (!id) throw new Error("Conversation ID is required");
    const response = await apiClient.delete<ConversationResponse>(`/conversations/${id}`);
    return response.data;
};

// Send a message in a conversation and get AI response
export const sendChatMessage = async (
    conversationId: string,
    message: string,
    systemPrompt?: string
): Promise<{ userMessage: Message; aiMessage: Message }> => {
    if (!conversationId) throw new Error("Conversation ID is required");
    if (!message.trim()) throw new Error("Message cannot be empty");

    const response = await apiClient.post<MessagesResponse>('/chat/send', {
        conversationId,
        content: message,
        systemPrompt,
        isFirstMessage: true // Used to determine title update logic on the backend
    });

    return {
        userMessage: response.data.data.userMessage,
        aiMessage: response.data.data.assistantMessage
    };
};

// Clear messages from a conversation
export const clearMessages = async (conversationId: string): Promise<{ success: boolean; data: any }> => {
    if (!conversationId) throw new Error("Conversation ID is required");
    const response = await apiClient.delete<ConversationResponse>(`/chat/messages/${conversationId}`);
    return response.data;
};
