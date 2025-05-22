import { useChat } from '../../../context/ChatProvider';
import { useState, useRef } from 'react';
import { FiMessageSquare, FiPlus, FiSettings, FiLogOut, FiSearch } from 'react-icons/fi';
import { IoNotificationsOff, IoNotificationsOutline } from "react-icons/io5";
import { Conversation as ConversationType } from '../../../types';
import { signOut } from '../../../utils/auth';
import LogoutConfirmModal from '../../dialogs/LogoutConfirmModal';


const chatIcons = [
    { id: 1, color: "#A0FF06" },
    { id: 2, color: "#1E90FF" },
    { id: 3, color: "#FF4500" },
    { id: 4, color: "#9932CC" },
    { id: 5, color: "#FF8C00" },
    { id: 6, color: "#00CED1" },
    { id: 7, color: "#FF1493" },
    { id: 8, color: "#32CD32" },
    { id: 9, color: "#FFD700" },
    { id: 10, color: "#8A2BE2" },
];
 
interface ChatSidebarProps {
    onToggleNotifications: () => void;
    isNotificationOff: boolean;
    isOpen: boolean;
    onClose?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onToggleNotifications, isNotificationOff, isOpen, onClose }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { conversations, currentConversation, setCurrentConversation, createConversation } = useChat();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleSelectConversation = (id: string) => {
        setCurrentConversation(conversations.find(conv => conv.id === id) as ConversationType);
        if (onClose && window.innerWidth < 768) onClose();
    };

    const handleCreateNewChat = () => {
        createConversation();
        if (onClose && window.innerWidth < 768) onClose();
    };

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await signOut();
            setIsLogoutDialogOpen(false);
            window.location.href = '/auth/login';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const firstRowIcons = chatIcons.slice(0, 5);
    const secondRowIcons = chatIcons.slice(5, 10);

    return (
        <div className={`h-full flex flex-col py-4 text-[#A0FF06] transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} relative overflow-hidden`}>
            <div className={`px-3 mb-4 w-full ${isOpen ? 'flex justify-end' : 'flex flex-col items-center gap-4'}`}>
                {isOpen ? (
                    <div className="flex space-x-4">
                        <div onClick={handleCreateNewChat} className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors">
                            <FiPlus size={20} />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors">
                            <FiSearch size={20} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div onClick={handleCreateNewChat} className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors">
                            <FiPlus size={20} />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors">
                            <FiSearch size={20} />
                        </div>
                    </>
                )}
            </div>

            {isOpen && (
                <div className="mb-6">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto pb-3 scrollbar-hide">
                        {firstRowIcons.map(icon => (
                            <div
                                key={icon.id}
                                className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#A0FF06] flex items-center justify-center mx-1 cursor-pointer bg-black"
                                style={{ background: `radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 100%), linear-gradient(45deg, ${icon.color}, transparent)` }}
                            >
                                <span className="text-lg font-bold text-[#A0FF06]">{icon.id}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex overflow-x-auto pt-2 scrollbar-hide ">
                        {secondRowIcons.map(icon => (
                            <div
                                key={icon.id}
                                className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#A0FF06] flex items-center justify-center mx-1 cursor-pointer bg-black"
                                style={{ background: `radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 100%), linear-gradient(45deg, ${icon.color}, transparent)` }}
                            >
                                <span className="text-lg font-bold text-[#A0FF06]">{icon.id}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isOpen && (
                <div className="flex flex-col items-center mb-4">
                    {chatIcons.slice(0, 3).map(icon => (
                        <div
                            key={icon.id}
                            className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#A0FF06] flex items-center justify-center mx-1 mb-2 cursor-pointer bg-black"
                            style={{ background: `radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 100%), linear-gradient(45deg, ${icon.color}, transparent)` }}
                        >
                            <span className="text-lg font-bold text-[#A0FF06]">{icon.id}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pt-2 scrollbar-hide w-full px-2 mt-4">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-[#A0FF06]">
                        <p>No conversations yet</p>
                        <p className="text-sm mt-1">Start a new chat to begin</p>
                    </div>
                ) : (
                    <>
                        {isOpen && <div className="text-sm font-medium pl-2 mb-2 text-[#A0FF06]">Today</div>}
                        <ul className="w-full">
                            {conversations.map((conversation) => (
                                <li key={conversation.id} className="mb-1">
                                    <button
                                        onClick={() => handleSelectConversation(conversation.id)}
                                        className={`p-2 w-full rounded-md flex items-center transition-colors  ${currentConversation?.id === conversation.id
                                            ? 'bg-gray-700 text-[#A0FF06]'
                                            : 'hover:bg-gray-800 text-gray-300'
                                            }`}
                                    >
                                        {!isOpen ? (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full  border border-[#A0FF06] flex items-center hover:bg-[#A0FF06] justify-center text-[#A0FF06]  hover:text-black">
                                                <FiMessageSquare size={20} className="" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center w-full">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full  border border-[#A0FF06] flex items-center justify-center mr-3">
                                                    <FiMessageSquare size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1 truncate text-left">
                                                    {conversation.title || `Chat ${conversation.id.substr(-4)}`}
                                                </div>
                                                {isOpen && (
                                                    <div className="text-gray-500 text-xs">•••</div>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className={`flex ${isOpen ? 'flex-col' : 'flex-col'} items-center gap-4 mt-4 w-full pt-2`}>
                {isOpen ? (
                    <>
                        <button
                            onClick={onToggleNotifications}
                            className="w-full px-4 py-2 rounded-md border border-[#A0FF06] flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                            {isNotificationOff ? (
                                <IoNotificationsOff size={20} />
                            ) : (
                                <IoNotificationsOutline size={20} />
                            )}
                            <span className="text-[#A0FF06]">Notifications</span>
                        </button>

                        <button className="w-full px-4 py-2 rounded-md border border-[#A0FF06] flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors">
                            <FiSettings size={20} />
                            <span className="text-[#A0FF06]">Settings</span>
                        </button>

                        <button
                            onClick={handleLogoutClick}
                            className="w-full px-4 py-2 rounded-md border border-[#A0FF06] flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                            <FiLogOut size={20} />
                            <span className="text-[#A0FF06]">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onToggleNotifications}
                            className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors mb-2"
                        >
                            {isNotificationOff ? (
                                <IoNotificationsOff size={20} />
                            ) : (
                                <IoNotificationsOutline size={20} />
                            )}
                        </button>

                        <button className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors mb-2">
                            <FiSettings size={20} />
                        </button>

                        <button
                            onClick={handleLogoutClick}
                            className="w-10 h-10 rounded-full border border-[#A0FF06] flex items-center justify-center cursor-pointer hover:bg-[#A0FF06] hover:text-black transition-colors"
                        >
                            <FiLogOut size={20} />
                        </button>
                    </>
                )}
            </div>

            <LogoutConfirmModal
                isOpen={isLogoutDialogOpen}
                onClose={() => setIsLogoutDialogOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};

export default ChatSidebar;
