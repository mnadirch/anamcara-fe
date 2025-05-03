// Define the role for each message (from the user or the assistant)
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string | null; // null for assistant messages
  content: string;
  role: MessageRole;
  created_at: string;
}

// One conversation belongs to one user and contains many messages
export interface Conversation {
  id: string;
  user_id: string;
  title: string; // can be AI-generated or user-edited
  created_at: string;
  updated_at: string;
}
