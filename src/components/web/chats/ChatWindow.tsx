import { useEffect, useRef } from 'react';
import { useChat } from '../../../context/ChatProvider';
import { FaRobot, FaUser } from 'react-icons/fa';

const TypingIndicator: React.FC = () => (
    <div className="flex space-x-1 p-2">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="w-2 h-2 bg-[#A0FF06] rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
        ))}
    </div>
);

const ChatWindow: React.FC = () => {
    const { currentMessages, loading, currentConversation } = useChat();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const amOrPm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        const formattedHours = hours.toString().padStart(2, '0');
        return `${formattedHours}:${minutes} ${amOrPm}`;
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);

    if (!currentConversation) {
        return (
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-transparent z-10 scrollbar-hide">
                <div className="text-center max-w-md mx-auto bg-black bg-opacity-60 p-6 rounded-lg border border-[#A0FF06] shadow-lg shadow-green-500/20">
                    <div className="mb-4 text-green-400">
                        <FaRobot size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-[#A0FF06] mb-2">Start a new conversation</h3>
                    <p className="text-gray-400">
                        Select an existing conversation from the sidebar or create a new one to begin chatting with the AI assistant.
                    </p>
                </div>
            </div>
        );
    }

    const validMessages = Array.isArray(currentMessages) ? currentMessages.filter(msg => msg && msg.role && msg.content) : [];

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-transparent z-20 relative w-[700px] scrollbar-hide ml-8">
            {!validMessages.length ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md mx-auto bg-black bg-opacity-60 p-6 rounded-lg border border-[#A0FF06] shadow-lg shadow-green-500/20">
                        <div className="mb-4 text-[#A0FF06]">
                            <FaRobot size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-[#A0FF06] mb-2">
                            How can I assist you today?
                        </h3>
                        <p className="text-gray-400">
                            Ask me anything about the world atmosphere or any other topic. I'm here to help!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {validMessages.map((message, index) => (
                        <div
                            key={message.id || `msg-${index}`}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center border border-[#A0FF06] shadow-[0_0_6px_#A0FF06]
                      ${message.role === 'user' ? 'bg-transparent text-[#A0FF06]' : 'bg-transparent text-[#A0FF06]'}`}
                                    >
                                        {message.role === 'user' ? <FaUser size={14} /> : <FaRobot size={14} />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="rounded-lg p-3 border border-[#A0FF06] bg-transparent shadow-[inset_0_0_6px_#A0FF06,_0_0_8px_#A0FF06]">
                                        <div className="text-sm text-[#A0FF06] whitespace-pre-wrap">{message.content}</div>
                                        <div className="text-[10px] text-right mt-1 text-white">{formatTime()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start px-4 py-2">
                            <div className="flex max-w-[80%]">
                                <div className="flex-shrink-0 mr-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 text-[#A0FF06] border border-[#A0FF06] flex items-center justify-center shadow-[0_0_5px_#A0FF06]">
                                        <FaRobot size={14} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="p-3 text-white bg-gray-900 border border-[#A0FF06] shadow-[0_0_8px_#A0FF06] rounded-lg font-mono text-sm whitespace-pre-wrap">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};

export default ChatWindow;