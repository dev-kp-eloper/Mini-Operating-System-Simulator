import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-dark-900 overflow-hidden text-gray-200">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-medium text-white">System Supervisor</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-brand-green shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                            <span className="text-sm text-gray-400">System Online</span>
                        </div>
                    </div>
                </header>
                <main className="p-6 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
