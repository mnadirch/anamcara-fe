import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { IoMdClose } from "react-icons/io";
import { message, Avatar } from 'antd';
import supabase from '../../config/supabase';
import { formatDate } from "../../pages/admin";

interface ThreadReportType {
    key: string;
    id: number;
    reason: string;
    description: string | null;
    reporter_username: string;
    reporter_avatar_url: string;
    created_at: string;
}

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    selectedThread: string;
}

const ThreadReportsModal: React.FC<ModalProps> = ({ isOpen, setIsOpen, selectedThread }) => {
    const [reports, setReports] = useState<ThreadReportType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchThreadReports = async () => {
        if (!selectedThread) {
            setReports([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('thread_reports')
                .select(`
                    id,
                    reason,
                    description,
                    user_id,
                    created_at,
                    profiles!inner(avatar_url, first_name, last_name)
                `)
                .eq('thread_id', selectedThread)
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }
            if (data) {
                const formattedReports: ThreadReportType[] = data.map((report: any) => ({
                    key: report.id,
                    id: report.id,
                    reason: report.reason,
                    description: report.description,
                    reporter_username: `${report.profiles?.first_name} ${report.profiles?.last_name}` || 'Unknown User',
                    reporter_avatar_url: report.profiles?.avatar_url || '',
                    created_at: formatDate(report.created_at),
                }));
                setReports(formattedReports);
            }
        } catch (error: any) {
            console.error('Error fetching thread reports:', error.message);
            message.error(`Failed to load reports: ${error.message}`);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && selectedThread) {
            fetchThreadReports();
        } else if (!isOpen) {
            setReports([]);
        }
    }, [isOpen, selectedThread]);

    return (
        <ModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="w-[750px] md:w-[600px] lg:w-[750px]"
        >
            <IoMdClose
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-2xl cursor-pointer text-gray-400 hover:text-gray-200"
            />

            <div className="p-4 pt-8">
                <h3 className="font-mowaq text-xl text-white font-semibold mb-4 text-center">
                    Reports for Thread ID: <span className="text-[#A0FF06]">{selectedThread}</span>
                </h3>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className='flex items-center gap-2 text-gray-400'>
                            <div className='w-6 h-6 rounded-full border-t-2 border-l-2 border-[#A0FF06] animate-spin' />
                            Loading reports...
                        </div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No reports found for this thread.</div>
                ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-dark-scrollbar">
                        {reports.map((report) => (
                            <div key={report.key} className="bg-[#2a2a2a] p-4 rounded-lg shadow-md border border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white text-lg font-semibold capitalize">Reason: {report.reason}</h4>
                                    <span className="text-gray-400 text-sm">Report ID: {report.id}</span>
                                </div>
                                <p className="text-gray-300 mb-2">
                                    <span className="font-medium">Description:</span> {report.description || 'N/A'}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-400"> {/* Added items-center for vertical alignment */}
                                    <div className="flex items-center gap-2"> {/* Container for avatar and username */}
                                        {/* Avatar component */}
                                        <Avatar src={report.reporter_avatar_url} size="small" />
                                        <span>Reported By: <span className="text-[#A0FF06] font-medium">{report.reporter_username}</span></span>
                                    </div>
                                    <span>On: {report.created_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

export default ThreadReportsModal;