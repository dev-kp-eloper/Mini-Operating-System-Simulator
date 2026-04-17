import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-dark-900 overflow-hidden text-gray-200">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-dark-800 border-b border-dark-700 px-4 py-2 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-base font-medium text-white">System Supervisor</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                            <span className="text-xs text-gray-400">System Online</span>
                        </div>
                    </div>
                </header>
                <main className="p-4 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
