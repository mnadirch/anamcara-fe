import { useEffect, useState } from 'react';
import { FaPlus, FaShieldAlt, FaBlog, FaUsers, FaRocket, FaFire, FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getBlogs } from '../../utils/blogs';
import { getReportedThreads } from '../../utils/reports';
import { useAuth } from '../../context/AuthProvider';
import { getAllCategories } from '../../utils/threadcategories';
import supabase from '../../config/supabase';
import { LoadingOutlined } from '@ant-design/icons';

interface Blog {
    id: string;
    title: string;
    description?: string;
    content: string;
    image_url?: string;
    posted_at?: string;
    views?: number;
    author_id?: string;
}

interface ThreadReport {
    thread_id: string;
    title: string;
    total_reports: number;
    is_active: boolean;
}

interface CategoryType {
    key: string; // This is the actual ID from the backend
    id: string;  // This is the mapped index from original code, preserved
    category_name: string;
    category_slug: string;
    is_active: boolean;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [reports, setReports] = useState<ThreadReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalBlogsCount, setTotalBlogsCount] = useState(0);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUserCountOnly = async (): Promise<number> => {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }) // `head: true` avoids fetching all rows
            .eq('is_deleted', false);

        if (error) {
            console.error('Error fetching user count:', error);
            return 0;
        }

        return count || 0;
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch blogs
            if (userData?.id) {
                // Get recent blogs for display (limit 5)
                const blogsResponse: any = await getBlogs(0, 5, userData.id);
                if (blogsResponse.success) {
                    setBlogs(blogsResponse.data?.blogs || []);
                }

                // Get total count of all blogs
                const totalBlogsResponse: any = await getBlogs(0, 1000, userData.id); // Use a large limit to get all
                if (totalBlogsResponse.success) {
                    setTotalBlogsCount(totalBlogsResponse.data?.blogs?.length || 0);
                }
            }

            // Fetch reports
            const reportsResponse = await getReportedThreads();
            if (reportsResponse.success) {
                setReports(reportsResponse.data || []);
            }

            const categoriesResponse = await getAllCategories();
            if (categoriesResponse.success) {
                const formattedData = categoriesResponse.data.map((category: any, index: number) => ({
                    key: category.id,
                    id: String(index),
                    category_name: category.category_name,
                    category_slug: category.category_slug,
                    is_active: category.is_active,
                }));
                setCategories(formattedData);
            }
            const userCount = await fetchUserCountOnly();
            setTotalUsers(userCount);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userData]);

    const stats = {
        totalBlogs: totalBlogsCount, // Use the total count instead of blogs.length
        publishedBlogs: blogs.filter(blog => blog.posted_at).length,
        draftBlogs: blogs.filter(blog => !blog.posted_at).length,
        totalReports: reports.length,
        highRiskThreads: reports.filter(report => report.total_reports >= 15).length,
        activeThreads: reports.filter(report => report.is_active).length,
        inactiveThreads: reports.filter(report => !report.is_active).length,
        totalCategories: categories.length,
        activeCategories: categories.filter(cat => cat.is_active).length,
        totalUsers: totalUsers,
    };

    // Cyber-themed hex stat card - Enhanced for mobile
    const CyberStatCard = ({ icon: Icon, title, value, subtitle, accentColor, glowColor, bgClass }: any) => {
        // Responsive cut sizes
        const cutSize = 'clamp(12px, 3vw, 20px)';
        const clipPathValue = `polygon(0% 0%, calc(100% - ${cutSize}) 0%, 100% ${cutSize}, 100% 100%, ${cutSize} 100%, 0% calc(100% - ${cutSize}))`;

        return (
            <div className="relative group">
                {/* Background glow element */}
                <div
                    className={`absolute inset-0 ${bgClass} opacity-20 blur-md group-hover:opacity-40 transition-all duration-500`}
                    style={{ clipPath: clipPathValue }}
                ></div>

                {/* Main card element */}
                <div
                    className="relative bg-slate-900/90 border-2 border-slate-600/50 hover:border-cyan-400/70 p-3 sm:p-4 md:p-6 backdrop-blur-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/20"
                    style={{ clipPath: clipPathValue }}
                >
                    {/* Cyber grid overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
                        `,
                            backgroundSize: '15px 15px sm:20px sm:20px'
                        }}></div>

                    {/* Status indicator - Responsive positioning */}
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex items-center space-x-1">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${glowColor} rounded-full animate-pulse`}></div>
                        <span className="text-cyan-400 text-xs sm:text-xs font-mowaq uppercase tracking-wider hidden sm:inline">ACTIVE</span>
                    </div>

                    {/* Icon and value section - Responsive layout */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:justify-between mb-2 sm:mb-4 space-y-2 sm:space-y-0">
                        {/* Icon container - Responsive sizing */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${bgClass} rounded-lg flex items-center justify-center border border-cyan-400/30`}>
                            <Icon className="text-white text-base sm:text-lg md:text-xl" />
                        </div>
                        <div className="text-center sm:text-right">
                            <div className={`text-2xl sm:text-3xl md:text-4xl font-bold font-mono ${accentColor} tracking-wider`}>
                                {typeof value === 'number' && value > 999 ? `${(value / 1000).toFixed(1)}K` : value}
                            </div>
                        </div>
                    </div>

                    {/* Title and subtitle section - Responsive text */}
                    <div className="relative z-10 text-center sm:text-left">
                        <h3 className="text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 font-mowaq">{title}</h3>
                        <p className="text-slate-400 text-xs font-mowaq">{subtitle}</p>
                    </div>

                    {/* Cyber corner accents - Responsive sizing */}
                    <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-cyan-400/50"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-400/50"></div>
                </div>
            </div>
        );
    };

    const CyberActionCard = ({ icon: Icon, title, description, onClick, accentColor, bgGradient }: any) => (
        <div
            onClick={onClick}
            className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
        >
            {/* Glow effect - Responsive clip path */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${bgGradient} opacity-0 group-hover:opacity-60 blur transition-all duration-300`}
                style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}></div>

            {/* Main card - Responsive padding and clip path */}
            <div className="relative bg-slate-900/95 border-2 border-slate-600/50 hover:border-cyan-400/70 p-4 sm:p-5 md:p-6 backdrop-blur-lg transition-all duration-300"
                style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                {/* Circuit pattern - Responsive background size */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 2px, transparent 2px)
                `,
                    backgroundSize: '20px 20px sm:30px sm:30px',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}></div>

                {/* Icon - Responsive sizing */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${bgGradient} flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300 border border-cyan-400/30`}
                    style={{
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                    }}>
                    <Icon className="text-white text-lg sm:text-xl md:text-2xl" />
                </div>

                {/* Content - Responsive text sizes */}
                <div className="relative z-10 text-center">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 font-mowaq tracking-wide">{title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-mowaq">{description}</p>
                </div>

                {/* Status light - Responsive sizing */}
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>

                {/* Corner accent lines - Responsive sizing */}
                <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 bg-cyan-400/30 group-hover:bg-cyan-400/70 transition-colors duration-300"></div>
                <div className="absolute top-0 left-0 w-0.5 h-4 sm:h-6 bg-cyan-400/30 group-hover:bg-cyan-400/70 transition-colors duration-300"></div>

                <div className="absolute bottom-0 right-0 w-4 h-0.5 sm:w-6 sm:h-0.5 bg-cyan-400/30 group-hover:bg-cyan-400/70 transition-colors duration-300"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-4 sm:h-6 bg-cyan-400/30 group-hover:bg-cyan-400/70 transition-colors duration-300"></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
                {/* Animated background - Responsive grid size */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px sm:50px sm:50px',
                        animation: 'grid-move 20s linear infinite'
                    }}></div>
                </div>

                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex flex-col justify-center items-center h-[60vh]">
                        <div className="relative">
                            <LoadingOutlined
                                style={{ fontSize: window.innerWidth < 640 ? 36 : 48, color: '#00FFFF' }}
                                spin
                            />
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                        </div>
                        <div className="space-y-2 mt-2">
                            <p className="text-cyan-400 font-mowaq text-lg sm:text-xl font-bold tracking-wider">INITIALIZING DASHBOARD</p>
                            <div className="flex items-center justify-center space-x-1">
                                {[0, 0.2, 0.4].map((delay, i) => (
                                    <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${delay}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Floating particles - Responsive count */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(window.innerWidth < 640 ? 10 : 20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 p-3 sm:p-4 md:p-6">
                {/* Cyber Header - Responsive layout */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            {/* Logo - Responsive sizing */}
                            <div className="relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                                    {/* Outer glowing hexagon */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-[#0766FF] to-[#00DCFF]"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                            animation: 'pulse 2s ease-in-out infinite',
                                            boxShadow: '0 0 15px rgba(0, 220, 255, 0.4)',
                                        }}
                                    />
                                    {/* Inner content holder */}
                                    <div
                                        className="absolute inset-[3px] sm:inset-[4px] bg-slate-900 flex items-center justify-center overflow-hidden"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        }}
                                    >
                                        <FaRocket className="text-cyan-400 text-xl sm:text-2xl z-10" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mowaq text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                                    DASHBOARD
                                </h1>
                                <div className="text-cyan-300 text-xs sm:text-sm font-mono mt-1 opacity-80">
                                    SYSTEM_STATUS: ONLINE
                                </div>
                            </div>
                        </div>

                        {/* User info - Responsive visibility and sizing */}
                        <div className="w-full sm:w-auto">
                            <div className="bg-slate-900/90 border border-cyan-400/30 rounded-lg p-3 sm:p-4 backdrop-blur-lg">
                                <div className="text-cyan-400 font-mowaq text-xs space-y-1 text-center sm:text-left">
                                    <div className="truncate">USER: {userData?.email || 'ADMIN'}</div>
                                    <div>ACCESS: GRANTED</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid - Responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <CyberStatCard
                        icon={FaBlog}
                        title="TOTAL BLOGS"
                        value={stats.totalBlogs}
                        subtitle="System entities"
                        accentColor="text-cyan-400"
                        glowColor="bg-cyan-400"
                        bgClass="bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                    />
                    <CyberStatCard
                        icon={FaTags}
                        title="TOTAL CATEGORIES"
                        value={stats.totalCategories}
                        subtitle="Categories available"
                        accentColor="text-green-400"
                        glowColor="bg-green-400"
                        bgClass="bg-gradient-to-br from-green-500/20 to-emerald-600/20"
                    />
                    <CyberStatCard
                        icon={FaUsers}
                        title="TOTAL USERS"
                        value={stats.totalUsers}
                        subtitle="Registered members"
                        accentColor="text-blue-400"
                        glowColor="bg-blue-400"
                        bgClass="bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
                    />
                    <CyberStatCard
                        icon={FaShieldAlt}
                        title="REPORTS"
                        value={stats.totalReports}
                        subtitle="Security alerts"
                        accentColor="text-amber-400"
                        glowColor="bg-amber-400"
                        bgClass="bg-gradient-to-br from-amber-500/20 to-orange-600/20"
                    />
                </div>

                {/* Quick Actions - Responsive header and grid */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center mb-4 sm:mb-6">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center">
                                <FaFire className="text-white text-xs sm:text-sm" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white font-mowaq tracking-wider">QUICK_ACTIONS</h2>
                            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <CyberActionCard
                            icon={FaPlus}
                            title="CREATE BLOG"
                            description="Initialize new entity"
                            onClick={() => navigate('/admin/blogs/create')}
                            accentColor="cyan-400"
                            bgGradient="from-cyan-500 to-blue-600"
                        />
                        <CyberActionCard
                            icon={FaBlog}
                            title="MANAGE BLOGS"
                            description="Access entity database"
                            onClick={() => navigate('/admin/blogs')}
                            accentColor="purple-400"
                            bgGradient="from-purple-500 to-purple-600"
                        />
                        <CyberActionCard
                            icon={FaShieldAlt}
                            title="VIEW REPORTS"
                            description="Security monitoring"
                            onClick={() => navigate('/admin/reports')}
                            accentColor="orange-400"
                            bgGradient="from-orange-500 to-red-600"
                        />
                        <CyberActionCard
                            icon={FaTags}
                            title="CATEGORIES"
                            description="System classification"
                            onClick={() => navigate('/admin/thread-categories')}
                            accentColor="indigo-400"
                            bgGradient="from-indigo-500 to-purple-600"
                        />
                    </div>
                </div>

                {/* Activity Monitor - Responsive grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Recent Blogs Monitor */}
                    <div className="relative">
                        <div className="bg-slate-900/90 border-2 border-slate-600/50 rounded-lg backdrop-blur-lg overflow-hidden">
                            {/* Header - Responsive padding and text */}
                            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-slate-600/50 p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                                            <FaBlog className="text-white text-xs sm:text-sm" />
                                        </div>
                                        <span className="text-white font-mowaq font-bold tracking-wide text-sm sm:text-base">RECENT_BLOGS</span>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin/blogs')}
                                        className="text-cyan-400 hover:text-white font-mowaq text-xs sm:text-sm transition-colors duration-300 border border-cyan-400/30 hover:border-cyan-400 px-2 sm:px-3 py-1 rounded w-full sm:w-auto text-center"
                                    >
                                        ACCESS_ALL
                                    </button>
                                </div>
                            </div>

                            {/* Content - Responsive padding */}
                            <div className="p-3 sm:p-4 space-y-3">
                                {blogs.slice(0, 3).map((blog, index) => (
                                    <div key={index} className="bg-slate-800/50 border border-slate-600/30 rounded p-3 hover:border-cyan-400/50 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                                            <div className="flex-1 w-full sm:w-auto">
                                                <p className="text-white text-sm font-medium font-mowaq truncate mb-1">{blog.title}</p>
                                                <p className="text-slate-400 text-xs font-mowaq">
                                                    {blog.posted_at ? new Date(blog.posted_at).toLocaleDateString() : 'DRAFT_MODE'}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-mowaq font-bold border w-full sm:w-auto text-center ${blog.posted_at
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                }`}>
                                                {blog.posted_at ? 'LIVE' : 'DRAFT'}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {blogs.length === 0 && (
                                    <div className="text-center py-6 sm:py-8">
                                        <div className="text-slate-500 text-xl sm:text-2xl mb-2">📊</div>
                                        <p className="text-slate-500 font-mowaq text-sm">NO_DATA_AVAILABLE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Reports Monitor */}
                    <div className="relative">
                        <div className="bg-slate-900/90 border-2 border-slate-600/50 rounded-lg backdrop-blur-lg overflow-hidden">
                            {/* Header - Responsive padding and text */}
                            <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 border-b border-slate-600/50 p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center">
                                            <FaShieldAlt className="text-white text-xs sm:text-sm" />
                                        </div>
                                        <span className="text-white font-mowaq font-bold tracking-wide">SECURITY_ALERTS</span>
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin/reports')}
                                        className="text-orange-400 hover:text-white font-mowaq text-sm transition-colors duration-300 border border-orange-400/30 hover:border-orange-400 px-3 py-1 rounded"
                                    >
                                        ACCESS_ALL
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                {reports.slice(0, 3).map((report, index) => (
                                    <div key={index} className="bg-slate-800/50 border border-slate-600/30 rounded p-3 hover:border-orange-400/50 transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-medium font-mowaq truncate mb-1">{report.title}</p>
                                                <p className="text-slate-400 text-xs font-mowaq">
                                                    THREAT_LEVEL: {report.total_reports} reports
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-mowaq font-bold border ${report.total_reports >= 15
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                : report.total_reports >= 10
                                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                                                }`}>
                                                {report.total_reports >= 15 ? 'CRITICAL' : report.total_reports >= 10 ? 'HIGH' : 'LOW'}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {reports.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="text-slate-500 text-2xl mb-2">🛡️</div>
                                        <p className="text-slate-500 font-mowaq text-sm">SYSTEM_SECURE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;