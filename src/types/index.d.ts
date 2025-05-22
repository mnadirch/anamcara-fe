export interface Thread {
    id: string;
    title: string;
    description: string;
    imgs: string[];
    category_name: string;
    category_id: string;
    author_name: string;
    author_id: string;
    publish_date: string;
    updated_at: string;
    total_likes: number;
    total_dislikes: number;
    keywords: string[];
    is_active: boolean;
    profiles: {
        avatar_url: string;
    };
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content: string;
  role: MessageRole;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
