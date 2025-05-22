import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    MdArticle,
    MdForum,
    MdReport,
    MdPeople,
    MdOutlineCategory,
} from "react-icons/md";
import { FcMenu } from "react-icons/fc";
import { logo } from "../../../public";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    active_icon: React.ReactNode;
    label: string;
    isActive: boolean;
    not_active?: boolean
    onClick?: () => void;
}

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userRole?: string;
}

const adminNavItems = [
    // {
    //     href: "/admin/home",
    //     icon: <MdHome size={20} />,
    //     active_icon: <MdHome size={20} className="text-primary" />,
    //     label: "Home",
    // },
    {
        href: "/admin/blogs",
        icon: <MdArticle size={20} />,
        active_icon: <MdArticle size={20} className="text-primary" />,
        label: "Blogs",
    },
    {
        href: "/admin/thread-categories",
        icon: <MdOutlineCategory size={20} />,
        active_icon: <MdOutlineCategory size={20} className="text-primary" />,
        label: "Thread Categories",
        // not_active: true,
    },
    {
        href: "/admin/threads",
        icon: <MdForum size={20} />,
        active_icon: <MdForum size={20} className="text-primary" />,
        label: "Threads",
    },
    {
        href: "/admin/users",
        icon: <MdPeople size={20} />,
        active_icon: <MdPeople size={20} className="text-primary" />,
        label: "Users",
    },
    {
        href: "/admin/reports",
        icon: <MdReport size={20} />,
        active_icon: <MdReport size={20} className="text-primary" />,
        label: "Reports",
    },
] as const;

const NavItem: React.FC<NavItemProps> = ({
    href,
    icon,
    active_icon,
    label,
    isActive,
    not_active,
    onClick
}) => (
    <li className="w-full">
        <Link to={href} onClick={onClick} className={`${not_active ? 'opacity-50 pointer-events-none' : ''}`}>
            <div
                className={`flex items-center gap-4 px-5 py-2 rounded-lg text-sm font-manrope transition-all
                ${isActive ? "bg-white/10 text-primary font-medium" : "font-normal bg-transparent"}`}
            >
                {isActive ? active_icon : icon}
                {label}
            </div>
        </Link>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    const location = useLocation();
    const pathname = location.pathname;
    const [isMobile, setIsMobile] = useState(false);

    const handleOverlayClick = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // Check on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div
                onClick={() => setIsSidebarOpen(prev => !prev)}
                className={`fixed left-0 top-0 ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'} transition-all duration-300 h-screen md:w-0 w-full bg-white/10 backdrop-blur-3xl z-40 flex flex-col items-center pt-4`}
            />

            {/* Main sidebar */}
            <div
                className={`fixed top-0 left-0 md:z-0 z-50 w-fit overflow-hidden md:translate-x-0 h-screen flex items-center justify-start`}
            >
                {/* Side ribbon */}
                <div className="bg-[#1b1b1b] md:w-12 w-9 h-full md:px-3 py-5 px-1.5 z-50 flex flex-col gap-8 items-center">
                    <FcMenu
                        className={'text-primary md:text-xl text-lg cursor-pointer'}
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    />
                </div>

                <div className={`bg-[#272727] p-4 flex flex-col justify-between h-screen transition-all duration-300 ${isSidebarOpen ?
                    'translate-x-0 pointer-events-auto  w-[280px] overflow-y-auto opacity-100'
                    : '-translate-x-full pointer-events-none w-0 overflow-hidden opacity-0'
                    }`}>
                    {/* Sidebar Top */}
                    <div className="w-full text-center flex flex-col">
                        <Link to={'/home'} className="w-full flex justify-center py-6 px-4">
                            <img src={logo} alt="logo" className="w-20" />
                        </Link>

                        <ul className="w-full pt-4 flex flex-col gap-3 text-nowrap">
                            {adminNavItems.map((item) => (
                                <React.Fragment key={item.href}>
                                    <NavItem
                                        {...item}
                                        onClick={handleOverlayClick}
                                        isActive={
                                            pathname === item.href ||
                                            (pathname.startsWith(item.href) && item.href !== "/admin/blogs")
                                        }
                                    />
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;