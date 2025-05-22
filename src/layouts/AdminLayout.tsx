import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";
import DashbaordNavbar from "../components/core/DashbaordNavbar";

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // if (loading) return <Loader />;

    return (
        <div className="w-full min-h-screen flex justify-end bg-black relative">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className={`${!isSidebarOpen ? 'w-[calc(100%-40px)]' : 'md:w-[calc(100%-330px)] sm:w-[calc(100%-40px)] w-[calc(100%-30px)]'} transition-all duration-300 h-screen overflow-y-auto top-0 right-0 flex flex-col pl-2 py-3`}>
                <div className="md:px-4 sm:px-2">
                    <DashbaordNavbar />
                </div>
                <div className="w-full md:px-4 sm:px-2 pb-5 flex-grow  pt-6">
                    <div className="w-full rounded-2xl bg-black h-full overflow-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;