import { Table, Avatar, Button, Dropdown, Empty } from 'antd';
import {
    MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { FaEye } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface ReportType {
    key: string;
    id: string;
    title: string;
    reporter: {
        name: string;
        email: string;
        avatar_url: string;
    };
    reported_item: string;
    report_type: string;
    status: string;
    created_at: string;
    resolved_at: string | null;
}

const ReportsManagement = () => {
    const [reports, setReports] = useState<ReportType[]>([]);
    const [loading, setLoading] = useState(false);

    // This would be your actual fetch function when you have data
    const fetchReports = async () => {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports([]); // Empty array since no data
        setLoading(false);
    };

    const columns: ColumnsType<ReportType> = [
        {
            title: 'Report Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span className="text-white">{text}</span>,
        },
        {
            title: 'Reporter',
            key: 'reporter',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Avatar src={record.reporter.avatar_url} />
                    <div>
                        <div className="text-white">{record.reporter.name}</div>
                        <div className="text-gray-400 text-xs">{record.reporter.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Reported Item',
            dataIndex: 'reported_item',
            key: 'reported_item',
            render: (text) => <span className="text-gray-300">{text}</span>,
        },
        {
            title: 'Type',
            dataIndex: 'report_type',
            key: 'report_type',
            align: 'center',
            render: (type: string) => (
                <div className='w-full flex justify-center text-sm'>
                    {type === 'spam' ? (
                        <div className='text-red-400 bg-red-400/10 px-4 text-center py-2 rounded-full'>Spam</div>
                    ) : type === 'inappropriate' ? (
                        <div className='text-yellow-400 bg-yellow-400/10 px-4 py-2 text-center rounded-full'>Inappropriate</div>
                    ) : (
                        <div className='text-blue-400 bg-blue-400/10 px-4 py-2 text-center rounded-full'>{type}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => (
                <div className='w-full flex justify-center'>
                    {status === 'resolved' ? (
                        <div className='text-green-400 bg-green-400/10 w-20 text-center py-2 rounded-full'>Resolved</div>
                    ) : status === 'pending' ? (
                        <div className='text-yellow-400 bg-yellow-400/10 w-20 py-2 text-center rounded-full'>Pending</div>
                    ) : (
                        <div className='text-red-400 bg-red-400/10 w-20 py-2 text-center rounded-full'>Rejected</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Reported At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <span className="text-gray-400">{new Date(text).toLocaleDateString()}</span>
            ),
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: () => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: (
                                    <Button type="text" icon={<FaEye />} className="text-gray-300 hover:text-gray-100">
                                        View Details
                                    </Button>
                                ),
                            },
                            {
                                key: 'resolve',
                                label: (
                                    <Button type="text" className="text-green-300 hover:text-green-100">
                                        Mark as Resolved
                                    </Button>
                                ),
                            },
                            {
                                key: 'reject',
                                label: (
                                    <Button type="text" className="text-red-300 hover:text-red-100">
                                        Reject Report
                                    </Button>
                                ),
                            },
                        ]
                    }}
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
        fetchReports();
    }, []);

    return (
        <div className="w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4">
            <h2 className="font-mowaq lg:text-3xl md:text-3xl text-xl text-white font-semibold mb-6">
                Reports Management
            </h2>

            <div className="custom-dark-table-container">
                <Table
                    columns={columns}
                    dataSource={reports}
                    loading={loading}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="text-gray-400">
                                        No reports available
                                    </span>
                                }
                            />
                        )
                    }}
                    className="custom-dark-table"
                />
            </div>
        </div>
    );
};

export default ReportsManagement;