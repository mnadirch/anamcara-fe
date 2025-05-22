import { Table, Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import {
    DeleteOutlined,
    MoreOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import supabase from '../../config/supabase';
import { useEffect, useState } from 'react';
import { Thread } from '../../types';
import { FaEye } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

interface ThreadType {
    key: string;
    id: number;
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
            message.error(`Failed to deleted thread`);
            console.error('Error updating thread status:', error);
        }
    };

    const getMenuItems = (record: ThreadType): MenuProps['items'] => [
        {
            key: 'view',
            label: (
                <Button
                    type="text"
                    icon={<FaEye />}
                    className={`text-gray-300 hover:text-gray-100 ${!record.is_active && 'opacity-60'}`}
                    onClick={() => {
                        window.open(`http://localhost:3000/threads/${record.key}`, '_blank');
                    }}
                >
                    View
                </Button>
            ),
        },
        {
            key: '1',
            label: (
                <Button
                    type="text"
                    icon={record.is_active ? <CloseOutlined /> : <CheckOutlined />}
                    className="text-gray-300 hover:text-gray-100"
                    onClick={() => toggleThreadStatus(record.key, record.is_active)}
                >
                    {record.is_active ? 'Deactivate' : 'Activate'}
                </Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button
                    type="text" icon={<DeleteOutlined />}
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => handleDeleteThread(record.key)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const columns: ColumnsType<ThreadType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            render: (text) => <span className="text-white md:text-sm text-xs hover:underline cursor-pointer">{text}</span>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span className="text-white md:text-base text-sm capitalize">{text}</span>,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: (author) => (
                <div className="flex items-center gap-2">
                    <Avatar src={author.avatar_url} size="default" />
                    <span className="text-white md:text-base text-sm capitalize">{author.username}</span>
                </div>
            ),
        },
        {
            title: 'Published',
            dataIndex: 'published',
            key: 'published',
            align: 'center',
            render: (text) => <span className="text-white md:text-base text-sm capitalize">{formatDate(text)}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category_name',
            align: 'center',
            render: (name) => <span className="text-white md:text-base text-sm capitalize">{name}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            render: (active) => (
                <div className='w-full flex justify-center'>
                    {active ? (
                        <div className='text-green-400 bg-green-400/10 w-20 text-center py-2 rounded-full'>Active</div>
                    ) : (
                        <div className='text-red-400 bg-red-400/10 w-20 py-2 text-center rounded-full'>Inactive</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Reactions',
            key: 'reactions',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-center gap-4 md:text-base text-sm">
                    <span className="text-gray-300 space-x-1.5">
                        <span className='text-green-500 text-xl'>↑</span>{record.reactions.likes}
                    </span>
                    <span className="text-gray-300 space-x-1.5">
                        <span className='text-red-500 text-xl'>↓</span>{record.reactions.dislikes}
                    </span>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getMenuItems(record) }}
                    placement="bottomRight"
                    overlayClassName="custom-dropdown-menu"
                >
                    <Button
                        shape="circle"
                        icon={<MoreOutlined className='text-2xl' />}
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
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
                    key: thread.id,
                    id: index + 1,
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
        <div className='w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4'>
            <h2 className='font-mowaq lg:text-3xl md:text-3xl text-xl text-white font-semibold mb-6'>Manage Threads</h2>

            <div className="custom-dark-table-container">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className='flex items-center gap-2 text-gray-400'>
                            <div className='w-6 h-6 rounded-full border-t-2 border-l-2 border-[#A0FF06] animate-spin' />
                            Loading threads...
                        </div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={threads}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalThreads,
                            showSizeChanger: true,
                        }}
                        onChange={handleTableChange}
                        bordered={false}
                        className="custom-dark-table"
                    />)}
            </div>
        </div>
    );
};

export default ThreadsManagement;