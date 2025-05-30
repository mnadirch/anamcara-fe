import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";
import DashboardNavbar from "../components/core/DashbaordNavbar";

const AdminLayout = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="w-full min-h-screen bg-black flex flex-col">
            {/* Fixed Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <DashboardNavbar />
            </div>

            {/* Content below navbar */}
            <div className="flex flex-1 pt-16">
                {/* Sidebar under navbar */}
                <Sidebar />

                {/* Main Content Area with responsive padding */}
                <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide px-3 sm:px-6 py-4 sm:py-6">
                    <div className="bg-black rounded-xl sm:rounded-2xl min-h-full px-3 py-4 sm:p-6 shadow-lg mt-2 sm:mt-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
