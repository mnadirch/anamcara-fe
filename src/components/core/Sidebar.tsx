import React from "react";
import { FaTags } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
    FaBlog,
    FaComments,
    FaChartBar,
    FaUsers,
    FaExclamationTriangle,
    FaLayerGroup,
} from "react-icons/fa";

const adminNavItems = [
    {
        title: "Dashbaord",
        path: "/admin/dashboard",
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: <FaChartBar className="md:text-lg text-base" />,
        gradient: "from-purple-500 to-indigo-500",
        glowColor: "#8B5CF6"
    },
    {
        href: "/admin/blogs",
        icon: <FaBlog className="md:text-lg text-base" />,
        label: "Blogs",
    },
    {
        href: "/admin/thread-categories",
        icon: <FaLayerGroup className="md:text-lg text-base" />,
        label: "Thread Categories",
    },
    {
        href: "/admin/threads",
        icon: <FaComments className="md:text-lg text-base" />,
        label: "Threads",
    },
    {
        href: "/admin/users",
        icon: <FaUsers className="md:text-lg text-base" />,
        label: "Users",
    },
    {
        href: "/admin/reports",
        icon: <FaExclamationTriangle className="md:text-lg text-base" />,
        label: "Reports",
    },
] as const;

const Sidebar: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="w-fit px-3 bg-black border-b border-[#0766FF]/30 shadow-[0px_0px_10px_#0766FF] flex flex-col items-center py-4 sm:py-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6 overflow-y-auto max-h-screen">
            <nav className="flex flex-col gap-4 sm:gap-6">
                {adminNavItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (pathname.startsWith(item.href) && item.href !== "/admin/blogs");
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg transition-all duration-200
                                ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700 hover:text-white"}
                            `}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
