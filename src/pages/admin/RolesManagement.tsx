import { Avatar, Button, Dropdown, MenuProps, message, Modal, Pagination, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined, // Example, if you add edit functionality
    LoadingOutlined,
    MailOutlined,
    MoreOutlined,
    UserOutlined, // For default avatar
} from '@ant-design/icons';
import supabase from '../../config/supabase'; // Ensure this path is correct
import { useEffect, useState } from 'react';
import usersImg from '/public/icons/admin/4.jpeg'; // Kept if still preferred for 'contact'

interface UserType {
    key: string;
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    is_deleted: boolean; // This field is used to filter, not usually displayed directly if soft delete
}

const RolesManagement = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9); // Adjusted for card layout (e.g., 3x3 grid)
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});


    const fetchUsers = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        const from = (page - 1) * size;
        const to = from + size - 1;

        const { data, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            message.error("Failed to load users.");
            console.error("Fetch users error:", error);
        } else if (data) {
            const formatted = data.map((user: any) => ({
                key: user.id,
                id: user.id,
                email: user.email,
                role: user.role || 'user', // Default role if null
                first_name: user.first_name || 'N/A',
                last_name: user.last_name || '',
                avatar_url: user.avatar_url,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active,
                is_deleted: user.is_deleted,
            }));
            setUsers(formatted);
            setTotalUsers(count || 0);
        }
        setLoading(false);
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        Modal.confirm({
            title: <span style={{ color: 'white' }}>Delete User</span>,
            content: <span style={{ color: '#E0E0E0' }}>{`Are you sure you want to delete ${userName}? This action is a soft delete.`}</span>,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            styles: {
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                content: { backgroundColor: '#1A202C', color: 'white' },
                header: { backgroundColor: '#1A202C', color: 'white', borderBottom: '1px solid #00DCFF' },
            },
            okButtonProps: { style: { backgroundColor: '#FF4D4F', borderColor: '#FF4D4F', color: 'white' } },
            cancelButtonProps: { style: { color: '#E0E0E0', borderColor: '#505050' } },
            onOk: async () => {
                setActionLoading(prev => ({ ...prev, [userId]: true }));
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ is_deleted: true, updated_at: new Date().toISOString() })
                        .eq('id', userId);

                    if (error) throw error;
                    message.success(`User ${userName} marked as deleted.`);
                    fetchUsers(currentPage, pageSize); // Refetch current page
                } catch (error: any) {
                    message.error("Failed to delete user.");
                    console.error("Delete user error:", error);
                } finally {
                    setActionLoading(prev => ({ ...prev, [userId]: false }));
                }
            },
        });
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean, userName: string) => {
        setActionLoading(prev => ({ ...prev, [userId]: true }));
        try {
            const newStatus = !currentStatus;
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: newStatus, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;
            message.success(`User ${userName} ${newStatus ? 'activated' : 'deactivated'}.`);
            // Optimistic update or refetch
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
            // fetchUsers(currentPage, pageSize); // Or refetch
        } catch (error: any) {
            message.error("Failed to update user status.");
            console.error("Toggle active error:", error);
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getMenuItems = (record: UserType): MenuProps['items'] => [
        {
            key: 'contact',
            icon: <MailOutlined style={{ color: '#00DCFF' }} />,
            label: (
                <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer" className="!text-gray-200 hover:!text-white">
                    Contact User
                </a>
            ),
        },
        {
            key: 'toggle-active',
            icon: record.is_active ? <CloseCircleOutlined style={{ color: '#FF7070' }} /> : <CheckCircleOutlined style={{ color: '#00DCFF' }} />,
            label: (
                <span onClick={() => handleToggleActive(record.id, record.is_active, `${record.first_name} ${record.last_name}`)} className="!text-gray-200 hover:!text-white">
                    {record.is_active ? 'Deactivate' : 'Activate'} User
                </span>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined style={{ color: '#FF4D4F' }} />,
            label: (
                <span onClick={() => handleDeleteUser(record.id, `${record.first_name} ${record.last_name}`)} className="!text-red-400 hover:!text-red-300">
                    Delete User
                </span>
            ),
            danger: true,
        },
    ];

    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePaginationChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const RoleTag: React.FC<{ role: string }> = ({ role }) => {
        let bgColor = 'bg-gray-500/20';
        let textColor = 'text-gray-300';
        let borderColor = 'border-gray-500';
        let glowColor = 'rgba(156, 163, 175, 0.3)';

        if (role === 'superadmin') {
            bgColor = 'bg-gradient-to-r from-yellow-400/30 to-orange-500/30';
            textColor = 'text-yellow-300';
            borderColor = 'border-yellow-400/70';
            glowColor = 'rgba(251, 191, 36, 0.4)';
        } else if (role === 'user') {
            bgColor = 'bg-gradient-to-r from-cyan-400/30 to-blue-500/30';
            textColor = 'text-cyan-300';
            borderColor = 'border-cyan-400/70';
            glowColor = 'rgba(0, 220, 255, 0.4)';
        } else if (role) {
            bgColor = 'bg-gradient-to-r from-blue-400/30 to-purple-500/30';
            textColor = 'text-blue-300';
            borderColor = 'border-blue-400/70';
            glowColor = 'rgba(59, 130, 246, 0.4)';
        }

        return (
            <div
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${bgColor} ${textColor} border ${borderColor} capitalize`}
                style={{
                    clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                    boxShadow: `0 0 15px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    textShadow: '0 0 8px currentColor',
                }}
            >
                {role}
            </div>
        );
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] p-4 md:p-8" style={{ backgroundColor: '#0A0E1A' }}>
            <div className="mb-8 flex items-center gap-4">
                {/* Hexagonal Icon Wrapper */}
                <div className="w-20 h-20 relative">
                    {/* Outer Glowing Border */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-[#0766FF] to-[#00DCFF]"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            animation: 'pulse 2s ease-in-out infinite',
                            boxShadow: '0 0 15px rgba(0, 220, 255, 0.5)',
                        }}
                    />
                    {/* Inner Container with Image */}
                    <div
                        className="absolute inset-[4px] bg-[#0A0E1A] flex items-center justify-center overflow-hidden"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                    >
                        <img
                            src={usersImg}
                            alt="Users"
                            className="w-full h-full object-cover"
                            style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            }}
                        />
                    </div>
                </div>

                {/* Text Heading */}
                <h1 className="text-4xl lg:text-5xl font-bold font-mowaq text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                    MANAGE USERS
                </h1>
                <div className="text-cyan-300 text-sm font-mono mt-1 opacity-80">
                    SYSTEM_STATUS: ONLINE
                </div>
            </div>

            {loading && users.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[calc(100vh-250px)]">
                    <div className="relative">
                        <LoadingOutlined
                            style={{ fontSize: 48, color: '#00FFFF' }}
                            spin
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                    </div>
                    <div className="text-cyan-300 font-mono mt-4 text-lg">LOADING.USERS...</div>
                </div>
            ) : !loading && users.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[calc(100vh-250px)] text-center">
                    <div className="text-6xl mb-4"></div>
                    <p className="text-cyan-300 font-mono text-xl mb-2">NO.USERS.FOUND</p>
                    <p className="text-gray-500 font-mono">Check your filters or add new users.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="relative group transition-all duration-500 ease-out hover:-translate-y-2"
                                style={{
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)',
                                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                {/* Cyberpunk border glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(0, 220, 255, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                                        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                                        filter: 'blur(1px)',
                                    }}
                                />

                                {/* Inner card content */}
                                <div
                                    className="relative p-6 h-full"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
                                        clipPath: 'polygon(2px 2px, calc(100% - 18px) 2px, calc(100% - 2px) 18px, calc(100% - 2px) calc(100% - 2px), 18px calc(100% - 2px), 2px calc(100% - 18px))',
                                    }}
                                >
                                    {/* Action Menu */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <Dropdown
                                            menu={{ items: getMenuItems(user) }}
                                            placement="bottomRight"
                                            trigger={['click']}
                                            overlayClassName="custom-dark-dropdown-menu"
                                            overlayStyle={{
                                                backgroundColor: '#1A232F',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(0, 220, 255, 0.2)',
                                            }}
                                        >
                                            <Button
                                                shape="circle"
                                                icon={<MoreOutlined className="text-lg text-gray-400 group-hover:text-cyan-400 transition-colors" />}
                                                className="!bg-black/30 hover:!bg-cyan-500/20 !border-cyan-500/50 backdrop-blur-sm"
                                                loading={actionLoading[user.id]}
                                                style={{
                                                    boxShadow: '0 0 15px rgba(0, 220, 255, 0.3)',
                                                }}
                                            />
                                        </Dropdown>
                                    </div>

                                    {/* User Info Section */}
                                    <div className="flex flex-col items-center text-center pt-4">
                                        {/* Avatar with cyberpunk frame */}
                                        <div className="relative mb-6">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-80"
                                                style={{
                                                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                                                    width: '90px',
                                                    height: '90px',
                                                    marginLeft: '-5px',
                                                    marginTop: '-5px',
                                                }}
                                            />
                                            <div
                                                className="relative bg-slate-900"
                                                style={{
                                                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                                                    width: '80px',
                                                    height: '80px',
                                                    padding: '2px',
                                                }}
                                            >
                                                <Avatar
                                                    size={76}
                                                    src={user.avatar_url}
                                                    icon={<UserOutlined />}
                                                    style={{
                                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* User Name */}
                                        <h3
                                            className="text-xl font-bold text-white capitalize truncate w-full mb-2"
                                            title={`${user.first_name} ${user.last_name}`}
                                            style={{
                                                textShadow: '0 0 10px rgba(0, 220, 255, 0.5)',
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {user.first_name} {user.last_name}
                                        </h3>

                                        {/* Email */}
                                        <p
                                            className="text-sm text-cyan-400 mb-4 truncate w-full font-mono"
                                            title={user.email}
                                            style={{ textShadow: '0 0 8px rgba(0, 220, 255, 0.3)' }}
                                        >
                                            {user.email}
                                        </p>

                                        {/* Role Tag */}
                                        <div className="mb-6">
                                            <RoleTag role={user.role} />
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div className="mt-auto pt-4 space-y-3">
                                        {/* Status Row */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">Status:</span>
                                            <div
                                                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${user.is_active
                                                    ? 'bg-gradient-to-r from-green-400/30 to-cyan-400/30 text-green-300 border-green-400/70'
                                                    : 'bg-gradient-to-r from-red-400/30 to-orange-400/30 text-red-300 border-red-400/70'}`}
                                                style={{
                                                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                                                    boxShadow: user.is_active
                                                        ? '0 0 10px rgba(34, 197, 94, 0.4)'
                                                        : '0 0 10px rgba(239, 68, 68, 0.4)',
                                                    textShadow: '0 0 8px currentColor',
                                                    border: '1px solid',
                                                    borderColor: user.is_active ? 'rgb(34 197 94 / 0.7)' : 'rgb(239 68 68 / 0.7)',
                                                }}
                                            >
                                                {user.is_active ? 'ONLINE' : 'OFFLINE'}
                                            </div>
                                        </div>

                                        {/* Date Info */}
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 font-mono uppercase tracking-wider">Joined:</span>
                                                <span className="text-gray-300 font-mono">{formatDate(user.created_at)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 font-mono uppercase tracking-wider">Updated:</span>
                                                <span className="text-gray-300 font-mono">{formatDate(user.updated_at)}</span>
                                            </div>
                                        </div>

                                        {/* Cyberpunk accent line */}
                                        <div
                                            className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4"
                                            style={{ boxShadow: '0 0 8px rgba(0, 220, 255, 0.5)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalUsers > pageSize && (
                        <div className="mt-12 flex justify-center pb-4">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalUsers}
                                onChange={handlePaginationChange}
                                showSizeChanger
                                pageSizeOptions={['9', '18', '27', '45']}
                                className="custom-dark-pagination"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RolesManagement;