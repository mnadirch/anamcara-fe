import { Table, Button, Dropdown, Empty, Switch, message } from 'antd';
import {
    MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { FaEye } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getReportedThreads } from '../../utils/reports';
import supabase from '../../config/supabase';
import ThreadReportsModal from '../../components/dialogs/ThreadReportsModal';

interface ThreadReportType {
    key: number;
    id: number;
    thread_id: string;
    thread_title: string;
    total_reports: number;
    status: 'active' | 'inactive';
}

const ReportsManagement = () => {
    const [viewOpen, setViewOpen] = useState<boolean>(false);
    const [selectedThread, setSelectedThread] = useState<string>("");
    const [threads, setThreads] = useState<ThreadReportType[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleThreadStatus = async (record: ThreadReportType) => {
        try {
            setLoading(true);

            const { error } = await supabase.from('threads')
                .update({ is_active: record.status !== 'active' })
                .eq('id', record.thread_id);

            if (error) {
                throw error;
            }

            message.success(`Thread ${record.status === 'active' ? 'inactive' : 'active'} successfully`);
            await fetchThreadReports();
        } catch (error) {
            message.error(`Failed to ${record.status === 'active' ? 'inactive' : 'active'} thread`);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (record: ThreadReportType) => {
        setSelectedThread(record.thread_id);
        setViewOpen(true);
    };

    const columns: ColumnsType<ThreadReportType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="text-gray-300 text-xs sm:text-sm">{Number(text) + 1}</span>,
        },
        {
            title: 'Thread ID',
            dataIndex: 'thread_id',
            key: 'thread_id',
            render: (text) => <span className="text-white text-xs sm:text-sm">{text}</span>,
        },
        {
            title: 'Thread Title',
            dataIndex: 'thread_title',
            key: 'thread_title',
            render: (text) => <span className="text-white text-xs sm:text-sm">{text}</span>,
        },
        {
            title: 'Total Reports',
            dataIndex: 'total_reports',
            key: 'total_reports',
            align: 'center',
            render: (text) => <span className="text-yellow-400 text-xs sm:text-sm">{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: 'active' | 'inactive', record) => (
                <Switch
                    checked={status === 'active'}
                    onChange={() => toggleThreadStatus(record)}
                    className={status === 'active' ? 'bg-[#34A853]' : 'bg-gray-500'}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: (
                                    <Button
                                        type="text"
                                        icon={<FaEye />}
                                        className="text-gray-300 hover:text-gray-100"
                                        onClick={() => handleViewDetails(record)}
                                    >
                                        View Details
                                    </Button>
                                ),
                            }
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

    const fetchThreadReports = async () => {
        setLoading(true);
        const response = await getReportedThreads();
        if (response.success) {
            const updatedData = response.data.map((item: any, index: number) => ({
                key: index,
                id: index,
                thread_id: item.thread_id,
                thread_title: item.title,
                total_reports: item.total_reports,
                status: item.is_active ? 'active' : 'inactive',
            }));
            setThreads(updatedData);
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchThreadReports();
    }, []);

    return (
        <>
            <div className="w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4">
                <h2 className="font-mowaq lg:text-3xl md:text-3xl text-xl text-white font-semibold mb-6">
                    Reports Management
                </h2>

                <div className="custom-dark-table-container">
                    <Table
                        columns={columns}
                        dataSource={threads}
                        loading={loading}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-gray-400">
                                            No thread reports available
                                        </span>
                                    }
                                />
                            )
                        }}
                        className="custom-dark-table"
                    />
                </div>
            </div>

            <ThreadReportsModal isOpen={viewOpen} setIsOpen={setViewOpen} selectedThread={selectedThread} />
        </>
    );
};

export default ReportsManagement;