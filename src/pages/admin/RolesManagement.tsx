import { Table, Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import {
    DeleteOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import supabase from '../../config/supabase';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

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
    is_deleted: boolean;
}

const RolesManagement = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').eq('is_deleted', false);

        if (error) {
            message.error("Failed to load users.");
            console.error(error);
        } else {
            const formatted = data.map((user: any) => ({
                key: user.id,
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar_url: user.avatar_url,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active,
                is_deleted: user.is_deleted,
            }));

            setUsers(formatted);
            setTotalUsers(data.length);
        }
        setLoading(false);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_deleted: true })
                .eq('id', userId);

            if (error) throw error;
            message.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            message.error("Failed to delete user");
            console.error(error);
        }
    };

    const handleToggleActive = async (userId: string, newStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: newStatus })
                .eq('id', userId);

            if (error) throw error;
            message.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
            fetchUsers();
        } catch (error) {
            message.error("Failed to update status");
            console.error(error);
        }
    };

    const getMenuItems = (record: UserType): MenuProps['items'] => [
        {
            key: 'contact',
            label: (
                <Button
                    type="text"
                    icon={<FaEye />}
                    className="text-gray-300 hover:text-gray-100"
                    onClick={() => window.open(`mailto:${record.email}`, '_blank')}
                >
                    Contact
                </Button>
            ),
        },
        {
            key: 'toggle-active',
            label: (
                <Button
                    type="text"
                    className="text-yellow-300 hover:text-yellow-100"
                    onClick={() => handleToggleActive(record.id, !record.is_active)}
                >
                    {record.is_active ? 'Deactivate' : 'Activate'}
                </Button>
            ),
        },
        {
            key: 'delete',
            label: (
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => handleDeleteUser(record.id)}
                >
                    Delete
                </Button>
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
            minute: '2-digit',
        });
    };

    const columns: ColumnsType<UserType> = [
        {
            title: 'Avatar',
            dataIndex: 'avatar_url',
            key: 'avatar',
            render: (url) => <Avatar src={url} />,
            align: 'center',
        },
        {
            title: 'Name',
            key: 'name',
            render: (_, record) => (
                <span className="text-white capitalize">
                    {record.first_name} {record.last_name}
                </span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span className="text-gray-300">{text}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            render: (role: string) => (
                <div className='w-full flex justify-center text-sm'>
                    {role === 'superadmin' ? (
                        <div className='text-yellow-400 bg-yellow-400/10 px-4 text-center py-2 rounded-full italic'>Super Admin</div>
                    ) : role === 'user' ? (
                        <div className='text-blue-400 bg-blue-400/10 px-4 py-2 text-center rounded-full italic'>User</div>
                    ) : (
                        <div className='text-red-400 bg-red-400/10 px-4 py-2 text-center rounded-full italic'>{role}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            render: (_, record) => (
                <div className='w-full flex justify-center'>
                    {record.is_active ? (
                        <div className='text-green-400 bg-green-400/10 w-20 text-center py-2 rounded-full'>Active</div>
                    ) : (
                        <div className='text-red-400 bg-red-400/10 w-20 py-2 text-center rounded-full'>Inactive</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Joined At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <span className="text-gray-400">{formatDate(text)}</span>
            ),
            align: 'center',
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
                        icon={<MoreOutlined className="text-2xl" />}
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                    />
                </Dropdown>
            ),
        },
    ];

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize]);

    const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    return (
        <div className="w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4">
            <h2 className="font-mowaq lg:text-3xl md:text-3xl text-xl text-white font-semibold mb-6">
                Manage Users
            </h2>

            <div className="custom-dark-table-container">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className='flex items-center gap-2 text-gray-400'>
                            <div className='w-6 h-6 rounded-full border-t-2 border-l-2 border-[#A0FF06] animate-spin' />
                            Loading users...
                        </div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={users}
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: totalUsers,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                        }}
                        onChange={handleTableChange}
                        rowKey="id"
                        className="custom-dark-table"
                    />
                )}
            </div>
        </div>
    );
};

export default RolesManagement;
