import { Table, Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import { FaComments, FaCheckCircle, FaStar } from 'react-icons/fa';
import {
    DeleteOutlined,
    MoreOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import supabase from '../../config/supabase'; // Ensure this path is correct
import { useEffect, useState } from 'react';
import { Thread } from '../../types'; // Ensure this path and type definition are correct
import { FaEye } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import threadImg from '/public/icons/admin/2.jpeg';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
interface ThreadType {
    key: string; // This should be a unique identifier, ideally the thread's actual ID
    id: number; // A sequential ID for display purposes
    title: string;
    author: {
        username: string;
        avatar_url: string;
    };
    published: string;
    reactions: {
        likes: number;
        dislikes: number;
    };
    is_active: boolean;
    category_name: string;
}

const ThreadsManagement = () => {
    const location = useLocation();
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalThreads, setTotalThreads] = useState(0);
    const [loading, setLoading] = useState(false);

    const toggleThreadStatus = async (threadId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('threads')
                .update({ is_active: !currentStatus })
                .eq('id', threadId);

            if (error) {
                throw error;
            }

            message.success(`Thread ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            fetchData(); // Refresh the data
        } catch (error) {
            message.error(`Failed to ${currentStatus ? 'deactivate' : 'activate'} thread`);
            console.error('Error updating thread status:', error);
        }
    };

    const handleDeleteThread = async (threadId: string) => {
        try {
            const { error } = await supabase
                .from('threads')
                .update({ is_deleted: true })
                .eq('id', threadId);

            if (error) {
                throw error;
            }

            message.success(`Thread deleted successfully`);
            fetchData();
        } catch (error) {
            message.error(`Failed to delete thread`);
            console.error('Error updating thread status:', error);
        }
    };

    const getMenuItems = (record: ThreadType): MenuProps['items'] => [
        {
            key: 'view',
            label: (
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#0766FF]/20 rounded-lg transition-all duration-200">
                    <FaEye className="text-[#00DCFF] text-sm" />
                    <span className="text-white font-medium">View Thread</span>
                </div>
            ),
            onClick: () => {
                window.open(`http://localhost:3000/threads/${record.key}`, '_blank');
            }
        },
        {
            key: 'toggle_status',
            label: (
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#0766FF]/20 rounded-lg transition-all duration-200">
                    {record.is_active ? (
                        <>
                            <CloseOutlined className="text-orange-400 text-sm" />
                            <span className="text-white font-medium">Deactivate</span>
                        </>
                    ) : (
                        <>
                            <CheckOutlined className="text-green-400 text-sm" />
                            <span className="text-white font-medium">Activate</span>
                        </>
                    )}
                </div>
            ),
            onClick: () => toggleThreadStatus(record.key, record.is_active)
        },
        {
            key: 'delete',
            label: (
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 rounded-lg transition-all duration-200">
                    <DeleteOutlined className="text-red-400 text-sm" />
                    <span className="text-red-400 font-medium">Delete Thread</span>
                </div>
            ),
            onClick: () => handleDeleteThread(record.key)
        },
    ];

    const columns: ColumnsType<ThreadType> = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center',
            render: (text) => (
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0766FF] to-[#00DCFF] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{text}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00DCFF] rounded-full border-2 border-[#111823] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thread Details',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div className="flex flex-col gap-2 py-2">
                    <h3 className="text-white font-semibold text-base leading-tight hover:text-[#00DCFF] transition-colors cursor-pointer">
                        {text.length > 50 ? `${text.slice(0, 50)}...` : text}
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                            <div className="w-2 h-2 bg-[#0766FF] rounded-full"></div>
                            <span>{formatDate(record.published)}</span>
                        </div>
                        <div className="px-2 py-1 bg-[#0766FF]/20 text-[#00DCFF] rounded-full border border-[#0766FF]/30">
                            {record.category_name}
                        </div>
                    </div>
                </div>
            ),
            responsive: ['sm'],
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            width: 200,
            render: (author) => (
                <div className="flex items-center gap-4 py-2">
                    <div className="relative">
                        <Avatar
                            src={author.avatar_url}
                            size={44}
                            className="border-3 border-[#0766FF]/50 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#0766FF] to-[#00DCFF] rounded-full border-2 border-[#111823] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{author.username}</span>
                        <span className="text-gray-400 text-xs">Thread Author</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 140,
            align: 'center',
            render: (active) => (
                <div className="flex justify-center">
                    {active ? (
                        <div className="relative px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                                <span className="text-green-300 font-semibold text-xs">ACTIVE</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative px-4 py-2 bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/40 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300 font-semibold text-xs">INACTIVE</span>
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Engagement',
            key: 'reactions',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">↑</span>
                        </div>
                        <span className="text-green-300 font-bold text-sm">{record.reactions.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="w-3 h-3 bg-red-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">↓</span>
                        </div>
                        <span className="text-red-300 font-bold text-sm">{record.reactions.dislikes}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getMenuItems(record) }}
                    placement="bottomRight"
                    overlayClassName="custom-dropdown-menu"
                    trigger={['click']}
                >
                    <Button
                        shape="circle"
                        icon={<MoreOutlined className="text-xl" />}
                        className="border-0 bg-gradient-to-r from-[#0766FF]/30 to-[#00DCFF]/30 text-white hover:from-[#0766FF] hover:to-[#00DCFF] transition-all duration-300 shadow-lg hover:shadow-[#0766FF]/30 w-12 h-12"
                        size="large"
                    />
                </Dropdown>
            ),
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchData = async (retryCount = 0) => {
        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from('threads')
                .select(`
                    *,
                    profiles!inner(avatar_url)
                `)
                .eq('is_deleted', false)
                .order('publish_date', { ascending: true });

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                const formatted = data.map((thread: Thread, index: number) => ({
                    key: thread.id, // Use actual thread ID as key
                    id: index + 1, // Sequential ID for display
                    title: thread.title,
                    published: thread.publish_date,
                    is_active: thread.is_active,
                    reactions: {
                        likes: thread.total_likes || 0,
                        dislikes: thread.total_dislikes || 0
                    },
                    author: {
                        username: thread.author_name || 'Unknown',
                        avatar_url: thread.profiles?.avatar_url || '',
                    },
                    category_name: thread.category_name || 'Uncategorized',
                }));

                setThreads(formatted);
                setTotalThreads(data.length || 0);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
            if (retryCount < 3) {
                setTimeout(() => fetchData(retryCount + 1), 1000);
            } else {
                message.error('Failed to fetch threads after multiple attempts');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, location]);

    return (
        <div className="w-full rounded-2xl bg-[#111823] min-h-[calc(100vh-125px)] md:p-6 p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#0766FF]/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-[#00DCFF]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-[#0766FF]/5 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8">

                <div className="flex items-center gap-4 mb-6 flex-row justify-start">
                    {/* Hexagonal Badge */}
                    <div className="w-20 h-20 relative">
                        {/* Outer glowing hex border */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-[#0766FF] to-[#00DCFF]"
                            style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                animation: 'pulse 2s ease-in-out infinite',
                                boxShadow: '0 0 15px rgba(0, 220, 255, 0.5)',
                            }}
                        />
                        {/* Inner image container */}
                        <div
                            className="absolute inset-[4px] bg-[#0A0E1A] flex items-center justify-center overflow-hidden"
                            style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            }}
                        >
                            <img
                                src={threadImg}
                                alt="Threads"
                                className="w-full h-full object-cover"
                                style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Text Label */}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold font-mowaq text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                            MANAGE THREADS
                        </h1>
                        <div className="text-cyan-300 text-sm font-mono mt-1 opacity-80">
                            SYSTEM_STATUS: ONLINE
                        </div>
                    </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Threads */}
                    <div className="bg-gradient-to-br from-[#0766FF]/20 to-[#00DCFF]/10 rounded-xl p-4 border border-[#00DCFF]/30 relative overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(0,220,255,0.1)]">
                        {/* Glow Circle */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00DCFF]/10 rounded-full -translate-y-4 translate-x-4 blur-xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center justify-between">
                                {/* Text */}
                                <div>
                                    <p className="text-[#00CCFF]/80 text-sm mb-1 font-mowaq">Total Threads</p>
                                    <p className="text-3xl font-bold text-white font-mowaq">{totalThreads}</p>
                                </div>

                                {/* Icon Box */}
                                <div className="w-12 h-12 bg-[#0766FF]/40 border border-[#00DCFF]/30 rounded-xl flex items-center justify-center shadow-inner">
                                    <FaComments className="text-[#00DCFF] text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Active Threads */}
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        {/* Glow Circle */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-4 translate-x-4 blur-xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center justify-between">
                                {/* Text */}
                                <div>
                                    <p className="text-emerald-300/80 text-sm mb-1 font-mowaq">Active Threads</p>
                                    <p className="text-3xl font-bold text-white font-mowaq">{threads.filter(t => t.is_active).length}</p>
                                </div>

                                {/* Icon Box */}
                                <div className="w-12 h-12 bg-emerald-500/30 border border-green-400/30 rounded-xl flex items-center justify-center shadow-inner">
                                    <FaCheckCircle className="text-emerald-300 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Engagement */}
                    <div className="bg-gradient-to-br from-[#111823] to-[#00DCFF]/10 backdrop-blur-md border border-[#00DCFF]/30 rounded-xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,220,255,0.08)]">
                        {/* Glow Circle */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00DCFF]/10 rounded-full -translate-y-4 translate-x-4 blur-xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center justify-between">
                                {/* Text */}
                                <div>
                                    <p className="text-cyan-300/80 text-sm mb-1 font-mowaq">Total Engagement</p>
                                    <p className="text-3xl font-bold text-white font-mowaq">{threads.reduce((sum, t) => sum + t.reactions.likes, 0)}</p>
                                </div>

                                {/* Icon Box */}
                                <div className="w-12 h-12 bg-[#00DCFF]/30 border border-cyan-400/30 rounded-xl flex items-center justify-center shadow-inner">
                                    <FaStar className="text-cyan-300 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="relative z-10 bg-[#111823]/80 backdrop-blur-xl border border-[#0766FF]/20 rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[60vh]">
                        <div className="relative">
                            <LoadingOutlined
                                style={{ fontSize: 48, color: '#00FFFF' }} // Entity loader color
                                spin
                            />
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                        </div>
                        <div className="text-cyan-300 font-mono mt-4 text-lg">LOADING.THREADS...</div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={threads}
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalThreads,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total, range) => (
                                <span className="text-gray-400 font-medium">
                                    Showing {range[0]}-{range[1]} of {total} threads
                                </span>
                            ),
                            className: "custom-pagination"
                        }}
                        onChange={handleTableChange}
                        bordered={false}
                        scroll={{ x: 768 }}
                        className="custom-dark-table"
                        rowClassName={(record) =>
                            `hover:bg-[#0766FF]/10 transition-all duration-300 ${!record.is_active ? 'opacity-70' : ''
                            }`
                        }
                    />
                )}
            </div>

            <style >{`
                .custom-dark-table .ant-table {
                    background: transparent !important;
                    color: white !important;
                }
                
                .custom-dark-table .ant-table-thead > tr > th {
                    background: linear-gradient(135deg, #0766FF20, #00DCFF10) !important;
                    border-bottom: 2px solid #0766FF40 !important;
                    color: #00DCFF !important;
                    font-weight: 700 !important;
                    padding: 20px 16px !important;
                    font-size: 14px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                }
                
                .custom-dark-table .ant-table-tbody > tr > td {
                    background: transparent !important;
                    border-bottom: 1px solid #0766FF15 !important;
                    padding: 20px 16px !important;
                }
                
                .custom-dark-table .ant-table-tbody > tr:hover > td {
                    background: linear-gradient(135deg, #0766FF08, #00DCFF05) !important;
                    box-shadow: inset 0 0 20px rgba(7, 102, 255, 0.1) !important;
                }
                
                .custom-dropdown-menu .ant-dropdown-menu {
                    background: linear-gradient(135deg, #111823, #1a1f2e) !important;
                    border: 2px solid #0766FF30 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 20px 40px rgba(7, 102, 255, 0.3) !important;
                    backdrop-filter: blur(20px) !important;
                    padding: 8px !important;
                }
                
                .custom-dropdown-menu .ant-dropdown-menu-item {
                    color: white !important;
                    padding: 8px 4px !important;
                    margin: 4px 0 !important;
                    border-radius: 8px !important;
                }
                
                .custom-pagination .ant-pagination-item {
                    background: linear-gradient(135deg, #0766FF20, #00DCFF10) !important;
                    border: 1px solid #0766FF40 !important;
                    border-radius: 8px !important;
                }
                
                .custom-pagination .ant-pagination-item a {
                    color: #00DCFF !important;
                    font-weight: 600 !important;
                }
                
                .custom-pagination .ant-pagination-item-active {
                    background: linear-gradient(135deg, #0766FF, #00DCFF) !important;
                    border-color: #00DCFF !important;
                    box-shadow: 0 4px 20px rgba(7, 102, 255, 0.4) !important;
                }
                
                .custom-pagination .ant-pagination-item-active a {
                    color: white !important;
                }
                
                .custom-pagination .ant-pagination-prev, .custom-pagination .ant-pagination-next {
                    background: linear-gradient(135deg, #0766FF20, #00DCFF10) !important;
                    border: 1px solid #0766FF40 !important;
                    border-radius: 8px !important;
                }
                
                .custom-pagination .ant-pagination-prev:hover, .custom-pagination .ant-pagination-next:hover {
                    background: linear-gradient(135deg, #0766FF40, #00DCFF20) !important;
                }

                @keyframes animate-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                
                .animate-reverse {
                    animation-direction: reverse;
                }
            `}</style>
        </div>
    );
};

export default ThreadsManagement;