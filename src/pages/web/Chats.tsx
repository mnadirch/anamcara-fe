
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useChat } from '../../context/ChatProvider';
import ChatSidebar from '../../components/web/chats/ChatSidebar';
import ChatWindow from '../../components/web/chats/ChatWindow';
import ChatInput from '../../components/web/chats/ChatInput';
import DonationPanel from '../../components/web/chats/DonationPanel';
import { FiUser } from 'react-icons/fi';
import { logo, toggle, toggled, chat_robot, donation } from '../../../public';

const Chats: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationOff, setIsNotificationOff] = useState(false);
    const { userData, loading: authLoading } = useAuth();
    const { sendMessage } = useChat();

    const handleSidebarToggle = () => setSidebarOpen(prev => !prev);

    const handleToggleNotifications = () => setIsNotificationOff(prev => !prev);

    const handleSendMessage = async (message: string) => {
        try {
            await sendMessage(message);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const sidebar = document.querySelector('.sidebar');
            const toggleButton = document.querySelector('[aria-label="Toggle sidebar"]');
            if (
                isSidebarOpen &&
                sidebar && !sidebar.contains(e.target as Node) &&
                toggleButton && !toggleButton.contains(e.target as Node)
            ) {
                setSidebarOpen(false);
            }
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isSidebarOpen]);

    if (authLoading) return <div className="p-6 text-white">Loading profile...</div>;

    if (!userData) {
        return (
            <div className="text-white flex flex-col items-center justify-center h-screen gap-4">
                <h2>Unauthorized Access</h2>
                <p>Please login to continue.</p>
                <button className="bg-[#A0FF06] text-black px-4 py-2 rounded" onClick={() => navigate('/auth/login')}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black text-white">
            <img
                src={chat_robot}
                alt="Robot"
                className="w-[400px] h-[450px] absolute bottom-0 left-[55%] z-30"
            />

            {/* Header */}
            <header className="bg-black p-4 shadow-lg z-20 w-full">
                <div className="flex justify-between items-center w-full px-4 md:px-8">
                    <div className="flex items-center">
                        <button
                            className="text-[#A0FF06]"
                            onClick={handleSidebarToggle}
                            aria-label="Toggle sidebar"
                        >
                            <img
                                src={isSidebarOpen ? toggled : toggle}
                                alt="Toggle"
                                className="h-6 w-6"
                            />
                        </button>
                        <img src={logo} alt="Logo" className="hidden sm:block h-8 w-auto ml-4" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-[#A0FF06] flex items-center justify-center text-black font-bold">
                            {userData?.first_name?.charAt(0).toUpperCase() || <FiUser size={18} />}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className={`sidebar transition-all duration-300 ease-in-out bg-black z-40 ${isSidebarOpen ? 'w-64' : 'w-20'} ${window.innerWidth < 768 && !isSidebarOpen ? 'hidden' : 'block'}`}>
                    <ChatSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onToggleNotifications={handleToggleNotifications}
                        isNotificationOff={isNotificationOff}
                    />
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative bg-black">
                    <ChatWindow />
                    <ChatInput
                        onSendMessage={handleSendMessage}
                    />
                </div>

                {/* Donation Panel */}
                <DonationPanel donation={donation} />
            </div>
        </div>
    );
};

export default Chats;