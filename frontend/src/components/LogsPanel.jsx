import React, { useEffect, useRef } from 'react';
import { clearLogs } from '../services/api';

const LogsPanel = ({ logs, reload }) => {
    const endRef = useRef(null);

    const handleClear = async () => {
        try {
            await clearLogs();
            if (reload) reload();
        } catch (err) {
            console.error("Clear Logs Error:", err);
        }
    };

    // Auto scroll down
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-lg h-full flex flex-col font-mono text-xs">
            <div className="bg-dark-800 p-3 border-b border-dark-700 flex justify-between items-center text-gray-300">
                <span className="flex items-center gap-2 font-bold"><span className="text-brand-red">📄</span> System Logs</span>
                <div className="flex gap-2">
                    <button 
                        onClick={handleClear}
                        className="text-[10px] bg-dark-700 px-2 py-0.5 rounded border border-dark-600 hover:bg-red-900/40 hover:text-red-400 transition"
                    >
                        Clear
                    </button>
                    <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-dark-600 block"></span>
                        <span className="w-2 h-2 rounded-full bg-dark-600 block"></span>
                        <span className="w-2 h-2 rounded-full bg-dark-600 block"></span>
                    </div>
                </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2 text-gray-400">
                {logs.length === 0 && <span className="opacity-50">Waiting for events...</span>}
                {[...logs].reverse().map((log, i) => (
                    <div key={log._id || i} className="flex gap-3 hover:bg-dark-800/50 p-1 rounded transition">
                        <span className="text-gray-600 shrink-0 select-none">
                            {new Date(log.createdAt).toISOString().split('T')[1].replace('Z','')}
                        </span>
                        <span className={`shrink-0 font-bold w-12
                            ${log.level === 'INFO' ? 'text-brand-blue' : ''}
                            ${log.level === 'WARN' ? 'text-brand-yellow' : ''}
                            ${log.level === 'ERROR' ? 'text-brand-red' : ''}
                        `}>
                            [{log.level}]
                        </span>
                        <span className="text-gray-500 shrink-0 w-24">[{log.source}]</span>
                        <span className="break-words w-full text-gray-300">{log.message}</span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default LogsPanel;
