import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const navLinkClass = (path) => `flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
        location.pathname === path ? 'bg-dark-700 text-white' : 'text-gray-400 hover:bg-dark-700 hover:text-white'
    }`;

    return (
        <aside className="w-56 bg-dark-800 border-r border-dark-700 min-h-screen flex flex-col">
            <div className="p-4 border-b border-dark-700">
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-brand-blue">⚡</span> OS Engine
                </h1>
            </div>
            <nav className="flex-1 p-3 space-y-1">
                <Link to="/" className={navLinkClass('/')}>
                    <span className="text-brand-blue">📊</span>
                    Dashboard
                </Link>
                <Link to="/fs" className={navLinkClass('/fs')}>
                    <span className="text-brand-green">📁</span>
                    File System
                </Link>
                <Link to="/settings" className={navLinkClass('/settings')}>
                    <span className="text-brand-purple">⚙️</span>
                    Settings
                </Link>
            </nav>
            <div className="p-4 border-t border-dark-700 text-xs text-gray-500 text-center">
                v1.0.0-beta
            </div>
        </aside>
    );
};

export default Sidebar;
