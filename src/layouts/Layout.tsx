import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className='w-full flex justify-center min-h-screen overflow-y-auto'>
            <div className="w-full max-w-[1764px] flex-grow flex items-center justify-center px-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
