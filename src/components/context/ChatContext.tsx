// src/context/ChatContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import ChatService from '../../services/ChatService';
import { useAuth } from './AuthContext';
import { Conversation, Message } from '../../types/chat';

interface ChatContextProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentMessages: Message[];
  loading: boolean;
  error: string | null;
  fetchConversations: () => void;
  createConversation: (title?: string) => Promise<Conversation | null>;
  deleteConversation: (id: string) => void;
  sendMessage: (content: string, systemPrompt?: string) => Promise<any>;
  clearChat: () => void;
  setCurrentConversation: (conv: Conversation | null) => void;
  updateConversationTitle: (id: string, newTitle: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) fetchConversations();
  }, [user, authLoading]);

  useEffect(() => {
    if (currentConversation?.id) loadConversationMessages(currentConversation.id);
    else setCurrentMessages([]);
  }, [currentConversation?.id]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await ChatService.getConversations();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (id: string) => {
    try {
      setLoading(true);
      const data = await ChatService.getMessages(id);
      setCurrentMessages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      setCurrentMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title = 'New Conversation') => {
    try {
      setLoading(true);
      const conversation = await ChatService.createConversation(title);
      setConversations([conversation, ...conversations]);
      setCurrentConversation(conversation);
      setCurrentMessages([]);
      return conversation;
    } catch (err: any) {
      setError(err.message || 'Failed to create conversation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateConversationTitle = async (id: string, newTitle: string) => {
    try {
      setLoading(true);
      await ChatService.updateConversationTitle(id, newTitle);
      setConversations(prev =>
        prev.map(conv => (conv.id === id ? { ...conv, title: newTitle } : conv))
      );
      if (currentConversation?.id === id) {
        setCurrentConversation({ ...currentConversation, title: newTitle });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update conversation title');
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      setLoading(true);
      await ChatService.deleteConversation(id);
      const updated = conversations.filter(conv => conv.id !== id);
      setConversations(updated);
      if (currentConversation?.id === id) {
        setCurrentConversation(updated[0] || null);
        setCurrentMessages([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete conversation');
    } finally {
      setLoading(false);
    }
  };

// In ChatContext.tsx
const sendMessage = async (content: string, systemPrompt?: string) => {
  try {
    let conversationId = currentConversation?.id;
    
    // If no current conversation, create one first
    if (!conversationId) {
      const newConv = await createConversation();
      if (!newConv) return null;
      conversationId = newConv.id;
    }

    // Add user message to UI immediately for better UX
    const tempUserMsg: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: conversationId,
      sender_id: user?.id || null,
      content: content,
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    setCurrentMessages(prev => [...prev.filter(Boolean), tempUserMsg]);
    
    try {
      // Send the message and get AI response
      const response = await ChatService.sendMessage(conversationId, content, systemPrompt);
      
      if (!response || !response.userMessage || !response.aiMessage) {
        console.error('Invalid response from sendMessage:', response);
        // Remove the temp message if we got an invalid response
        setCurrentMessages(prev => prev.filter(m => m && m.id !== tempUserMsg.id));
        setError('Failed to get a valid response from the AI');
        return null;
      }
      
      // Update messages with real IDs from server
      setCurrentMessages(prev => [
        ...prev.filter(m => m && m.id !== tempUserMsg.id),
        response.userMessage,
        response.aiMessage
      ].filter(Boolean)); // Filter out any null/undefined values
      
      // Check if this is the first message in the conversation and update title if needed
      if (currentMessages.length === 0 && currentConversation?.title === 'New Conversation') {
        // Generate a title based on the first message (truncate to reasonable length)
        const generatedTitle = content.length > 30 
          ? content.substring(0, 30) + '...' 
          : content;
        
        // Update the conversation title
        await updateConversationTitle(conversationId, generatedTitle);
      }
      
      // Refresh conversations to update order
      fetchConversations();
      
      return response;
    } catch (err: any) {
      // Remove the temp message if there was an error
      setCurrentMessages(prev => prev.filter(m => m && m.id !== tempUserMsg.id));
      throw err;
    }
  } catch (err: any) {
    setError(err.message || 'Failed to send message');
    return null;
  }
};

  const clearChat = async () => {
    if (!currentConversation) return;
    try {
      setLoading(true);
      // Note: You need to implement this endpoint in your backend
      await ChatService.clearMessages(currentConversation.id);
      setCurrentMessages([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear chat');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    conversations,
    currentConversation,
    currentMessages,
    loading,
    error,
    fetchConversations,
    createConversation,
    deleteConversation,
    sendMessage,
    clearChat,
    setCurrentConversation,
    updateConversationTitle,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};