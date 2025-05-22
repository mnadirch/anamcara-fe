import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { FiSend } from 'react-icons/fi';
import { FaPaperclip, FaImage, FaUpload } from 'react-icons/fa';

interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUploadToggle = () => {
        setShowUploadOptions((prev) => !prev);
    };

    const handleAttachFile = () => {
        alert('Attach file clicked');
        setShowUploadOptions(false);
    };

    const handleUploadPhoto = () => {
        alert('Upload photo clicked');
        setShowUploadOptions(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            try {
                setIsLoading(true);
                await onSendMessage(message.trim());
                setMessage('');
                if (textAreaRef.current) {
                    textAreaRef.current.style.height = '40px';
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent);
        }
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = '40px';
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = scrollHeight > 200 ? '200px' : `${scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="flex bg-opacity-80 z-20 relative mb-4">
            {/* Sidebar with Upload Icons */}
            <div className="flex flex-col items-center justify-end relative w-12 mr-2">
                <div className="relative flex flex-col items-center mb-8 ml-16">
                    {showUploadOptions && (
                        <div className="flex flex-col items-center gap-2 absolute bottom-14 z-10">
                            <button
                                type="button"
                                onClick={handleAttachFile}
                                className="w-9 h-9 rounded-full border-2 border-[#A0FF06] bg-gray-900 text-[#A0FF06] flex items-center justify-center hover:bg-[#A0FF06] hover:text-black transition"
                            >
                                <FaPaperclip size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleUploadPhoto}
                                className="w-9 h-9 rounded-full border-2 border-[#A0FF06] bg-gray-900 text-[#A0FF06] flex items-center justify-center hover:bg-[#A0FF06] hover:text-black transition"
                            >
                                <FaImage size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-[670px]">
                <div className={`relative flex items-end rounded-lg overflow-hidden bg-gray-900 border animate-rainbow hover:animate-rainbow-reverse focus-within:animate-rainbow-reverse transition-all duration-300`}>
                    <button
                        type="button"
                        onClick={handleUploadToggle}
                        className="w-9 h-9 rounded-full mb-2 ml-1 border-2 border-[#A0FF06] bg-gray-900 text-[#A0FF06] flex items-center justify-center hover:bg-[#A0FF06] hover:text-black transition"
                    >
                        <FaUpload size={16} />
                    </button>
                    
                    <textarea
                        ref={textAreaRef}
                        rows={1}
                        className="flex-1 p-3 pl-4 pr-12 resize-none max-h-[200px] focus:outline-none bg-gray-900 text-[#A0FF06] placeholder-[#A0FF06]"
                        placeholder="Ask me anything..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    
                    <button
                        type="submit"
                        className={`absolute bottom-2 right-2 p-2 rounded-full border transition-all duration-300 ${isLoading || !message.trim()
                            ? 'bg-gray-700 text-gray-400 border-gray-700'
                            : 'bg-[#A0FF06] text-black border-[#A0FF06] hover:bg-[#8CFF2F]'
                            }`}
                        disabled={isLoading || !message.trim()}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-[#8CFF2F] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FiSend size={16} />
                        )}
                    </button>
                </div>
                <div className="flex justify-end mt-2 px-2 text-xs text-[#A0FF06]">
                    <span>Press Enter to send, Shift + Enter for new line</span>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
