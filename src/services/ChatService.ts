// src/lib/ChatService.ts
import api from './api';
import { Conversation, Message } from '../types/chat';

interface ConversationResponse {
  success: boolean;
  data: any;
}

interface MessagesResponse {
  success: boolean;
  data: {
    userMessage: Message;
    assistantMessage: Message; // Note: This matches what the backend returns
  };
}

const ChatService = {
  // Fetch all conversations for the logged-in user
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<ConversationResponse>('/conversations');
    return response.data.data;
  },

  // Fetch a single conversation with its messages
  getConversation: async (id: string): Promise<{ conversation: Conversation, messages: Message[] }> => {
    const response = await api.get<ConversationResponse>(`/conversations/${id}`);
    return response.data.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<ConversationResponse>(`/chat/messages/${conversationId}`);
    return response.data.data;
  },

  // Create a new conversation
  createConversation: async (title: string = 'New Conversation'): Promise<Conversation> => {
    const response = await api.post<ConversationResponse>('/conversations', { title });
    return response.data.data;
  },

  // Update conversation title
  updateConversationTitle: async (id: string, title: string): Promise<Conversation> => {
    const response = await api.put<ConversationResponse>(`/conversations/${id}`, { title });
    return response.data.data;
  },

  // Delete a conversation
  deleteConversation: async (id: string): Promise<{ success: boolean; data: any; }> => {
    const response = await api.delete<ConversationResponse>(`/conversations/${id}`);
    return response.data;
  },

  // Send a message in a conversation and get AI response
  sendMessage: async (
    conversationId: string,
    message: string,
    systemPrompt?: string
  ): Promise<{ userMessage: Message, aiMessage: Message }> => {
    const response = await api.post<MessagesResponse>('/chat/send', {
      conversationId,
      content: message,
      systemPrompt,
      isFirstMessage: true // Add this flag to let backend know if title should be updated
    });

    // Fix the property name mismatch
    return {
      userMessage: response.data.data.userMessage,
      aiMessage: response.data.data.assistantMessage  // Map assistantMessage to aiMessage
    };
  },

  // Clear messages from a conversation
  clearMessages: async (conversationId: string): Promise<{ success: boolean; data: any; }> => {
    const response = await api.delete<ConversationResponse>(`/chat/messages/${conversationId}`);
    return response.data;
  }
};

export default ChatService;