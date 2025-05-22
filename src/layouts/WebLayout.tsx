import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/web/Navbar";
import Footer from "../components/web/Footer";

const WebLayout = () => {
    const location = useLocation();
    const show = location.pathname === "/home";

    return (
        <div className="w-full h-screen overflow-y-auto relative flex flex-col justify-center items-center">
            {location.pathname !== '/membership' && <Navbar />}

            <div className="w-full">
                <Outlet />
            </div>

            {show && <Footer />}
        </div>
    );
};

export default WebLayout;