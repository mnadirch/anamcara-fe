import { Table, Button, Dropdown, Empty, Switch, message } from 'antd';
import {
    MoreOutlined,
} from '@ant-design/icons';


import { FaEye, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getReportedThreads } from '../../utils/reports';
import supabase from '../../config/supabase';
import ThreadReportsModal from '../../components/dialogs/ThreadReportsModal';
import { LoadingOutlined } from '@ant-design/icons';


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
            // Toggle based on current status
            const newStatus = record.status === 'active' ? false : true;
            const { error } = await supabase.from('threads')
                .update({ is_active: newStatus })
                .eq('id', record.thread_id);

            if (error) {
                throw error;
            }

            message.success(`Thread ${newStatus ? 'activated' : 'deactivated'} successfully`);
            await fetchThreadReports();
        } catch (error) {
            message.error(`Failed to ${record.status === 'active' ? 'deactivate' : 'activate'} thread`);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (record: ThreadReportType) => {
        setSelectedThread(record.thread_id);
        setViewOpen(true);
    };

    const columns = [
        {
            title: <span className="text-cyan-400 font-mono text-sm">ID</span>,
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (text: number) => (
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-300 font-mono text-xs">{String(text + 1).padStart(3, '0')}</span>
                </div>


            ),
        },
        {
            title: <span className="text-cyan-400 font-mono text-sm">THREAD_ID</span>,
            dataIndex: 'thread_id',
            key: 'thread_id',
            render: (text: string) => (
                <div className="bg-gray-800/50 px-3 py-1 rounded border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
                    <span className="text-green-400 font-mono text-xs">{text}</span>
                </div>
            ),
        },
        {
            title: <span className="text-cyan-400 font-mono text-sm">THREAD_TITLE</span>,
            dataIndex: 'thread_title',
            key: 'thread_title',
            render: (text: string) => (
                <div className="flex items-center space-x-2">
                    <FaShieldAlt className="text-purple-400 text-xs" />
                    <span className="text-white font-medium text-sm hover:text-cyan-300 transition-colors duration-200">{text}</span>
                </div>
            ),
        },
        {
            title: <span className="text-cyan-400 font-mowaq text-sm">REPORTS</span>,
            dataIndex: 'total_reports',
            key: 'total_reports',
            align: 'center' as const,
            render: (text: number) => (
                <div className="flex items-center justify-center">
                    <div className={`
                        px-3 py-1 rounded-full border-2 font-mono text-sm font-bold
                        ${text >= 20 ? 'bg-red-500/20 border-red-400 text-red-300' :
                            text >= 10 ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' :
                                'bg-green-500/20 border-green-400 text-green-300'}
                    `}>
                        {text}
                    </div>
                    {text >= 15 && <FaExclamationTriangle className="text-red-400 ml-2 animate-pulse" />}
                </div>
            ),
        },
        {
            title: <span className="text-cyan-400 font-mono text-sm">STATUS</span>,
            dataIndex: 'status',
            key: 'status',
            align: 'center' as const,
            render: (status: 'active' | 'inactive', record: ThreadReportType) => (
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <Switch
                            checked={status === 'active'}
                            onChange={() => toggleThreadStatus(record)}
                            className={`
                                cyber-switch transition-all duration-300
                                ${status === 'active' ? 'bg-green-500' : 'bg-gray-600'}
                            `}
                            checkedChildren={<span className="text-xs font-bold">ON</span>}
                            unCheckedChildren={<span className="text-xs font-bold">OFF</span>}
                        />
                        <div className={`
    absolute -inset-1 rounded-full blur-sm opacity-50 pointer-events-none
    ${status === 'active' ? 'bg-green-400' : 'bg-gray-500'}
`}></div>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="text-cyan-400 font-mono text-sm">ACTIONS</span>,
            key: 'actions',
            align: 'center' as const,
            width: 100,
            render: (_: any, record: ThreadReportType) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: (
                                    <Button
                                        type="text"
                                        icon={<FaEye className="text-cyan-400" />}
                                        className="text-gray-300 hover:text-cyan-300 bg-transparent border-none cyber-btn"
                                        onClick={() => handleViewDetails(record)}
                                    >
                                        Analyze Data
                                    </Button>
                                ),
                            }
                        ]
                    }}
                    placement="bottomRight"
                    overlayClassName="cyber-dropdown"
                >
                    <Button
                        shape="circle"
                        icon={<MoreOutlined className="text-lg" />}
                        className="bg-gray-800/50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 cyber-action-btn"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        animation: 'grid-move 20s linear infinite'
                    }}
                ></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        {/* Hexagon Icon Wrapper */}
                        <div className="w-20 h-20 relative">
                            {/* Outer Glowing Hex Border */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                                style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    boxShadow: '0 0 15px rgba(34,211,238,0.6)',
                                }}
                            />
                            {/* Inner Background & Icon */}
                            <div
                                className="absolute inset-[4px] bg-[#0A0E1A] flex items-center justify-center"
                                style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                }}
                            >
                                <FaShieldAlt className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Heading Text */}
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold font-mowaq text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                                REPORTS
                            </h1>
                            <div className="text-cyan-300 text-sm font-mono mt-1 opacity-80">
                                    SYSTEM_STATUS: ONLINE
                                </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-400/60 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-mono">TOTAL THREADS</p>
                                    <p className="text-2xl font-bold text-cyan-400">{threads.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-400/60 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-mono">HIGH RISK</p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {threads.filter(t => t.total_reports >= 15).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <FaExclamationTriangle className="text-yellow-400 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-lg p-4 hover:border-green-400/60 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-mono">ACTIVE</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        {threads.filter(t => t.status === 'active').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-mowaq text-white ">
                            THREAT ANALYSIS MATRIX
                        </h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm font-mono">SYSTEM ACTIVE</span>
                        </div>
                    </div>

                    <div className="cyber-table-container">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-[60vh]">
                                <div className="relative">
                                    <LoadingOutlined
                                        style={{ fontSize: 48, color: '#00FFFF' }}
                                        spin
                                    />
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                                </div>
                                <div className="text-cyan-300 font-mono mt-4 text-lg">LOADING.THREAD.DATA...</div>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={threads}
                                pagination={false}
                                className="cyber-table"
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <div className="text-center">
                                                    <p className="text-gray-400 font-mono mb-2">
                                                        NO THREAT DATA DETECTED
                                                    </p>
                                                    <div className="flex justify-center space-x-1">
                                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: '0.1s' }}
                                                        ></div>
                                                        <div
                                                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: '0.2s' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    ),
                                }}
                            />
                        )}
                        <ThreadReportsModal isOpen={viewOpen} setIsOpen={setViewOpen} selectedThread={selectedThread} />
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes grid-move {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                
                .cyber-table .ant-table {
                    background: transparent !important;
                    color: white !important;
                }
                
                .cyber-table .ant-table-thead > tr > th {
                    background: rgba(0, 255, 255, 0.1) !important;
                    border-bottom: 2px solid rgba(0, 255, 255, 0.3) !important;
                    color: #00ffff !important;
                    font-weight: bold !important;
                    padding: 16px 12px !important;
                }
                
                .cyber-table .ant-table-tbody > tr > td {
                    background: rgba(17, 24, 39, 0.5) !important;
                    border-bottom: 1px solid rgba(0, 255, 255, 0.1) !important;
                    padding: 16px 12px !important;
                    transition: all 0.3s ease !important;
                }
                
                .cyber-table .ant-table-tbody > tr:hover > td {
                    background: rgba(0, 255, 255, 0.05) !important;
                    box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.1) !important;
                }
                
                .cyber-switch.ant-switch-checked {
                    background: #10b981 !important;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5) !important;
                }
                
                .cyber-action-btn:hover {
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5) !important;
                    transform: scale(1.05) !important;
                }
                
                .cyber-dropdown .ant-dropdown-menu {
                    background: rgba(17, 24, 39, 0.95) !important;
                    border: 1px solid rgba(0, 255, 255, 0.3) !important;
                    backdrop-filter: blur(10px) !important;
                }
                
                .cyber-dropdown .ant-dropdown-menu-item {
                    color: #e5e7eb !important;
                }
                
                .cyber-dropdown .ant-dropdown-menu-item:hover {
                    background: rgba(0, 255, 255, 0.1) !important;
                }
                
                .ant-table-wrapper {
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }
                
                .ant-spin-dot-item {
                    background-color: #00ffff !important;
                }
            `}</style>
        </div>
    );
};

export default ReportsManagement;