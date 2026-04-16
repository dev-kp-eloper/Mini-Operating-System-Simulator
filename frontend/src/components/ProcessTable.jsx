import React, { useState } from 'react';
import { createProcess, killProcess, clearProcesses } from '../services/api';

const ProcessTable = ({ processes, reload }) => {
    const [name, setName] = useState('');
    const [burstTime, setBurstTime] = useState('');
    const [priority, setPriority] = useState('');
    const [memoryRequired, setMemoryRequired] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const SAMPLE_PROCESSES = [
        {name: "Kernel-Core", burstTime: 2, memoryRequired: 1024, priority: 1},
        {name: "UI-Renderer", burstTime: 4, memoryRequired: 2048, priority: 2},
        {name: "Network-Stack", burstTime: 3, memoryRequired: 1024, priority: 1},
        {name: "Chrome-Browser", burstTime: 10, memoryRequired: 4096, priority: 3},
        {name: "VS-Code", burstTime: 15, memoryRequired: 6144, priority: 2},
        {name: "Auth-Service", burstTime: 2, memoryRequired: 512, priority: 1},
        {name: "Background-Sync", burstTime: 6, memoryRequired: 1024, priority: 4},
        {name: "Data-Indexer", burstTime: 8, memoryRequired: 3072, priority: 3},
        {name: "Antivirus-Scan", burstTime: 12, memoryRequired: 2048, priority: 5},
        {name: "System-Update", burstTime: 5, memoryRequired: 1024, priority: 4},
        {name: "Email-Client", burstTime: 4, memoryRequired: 1536, priority: 3},
        {name: "Sticky-Note", burstTime: 1, memoryRequired: 256, priority: 5}
    ];

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createProcess({ name, burstTime: Number(burstTime), priority: Number(priority), memoryRequired: Number(memoryRequired) });
            setName(''); setBurstTime(''); setPriority(''); setMemoryRequired('');
            reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating process');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoadSamples = async () => {
        setIsSubmitting(true);
        try {
            for (const p of SAMPLE_PROCESSES) {
                await createProcess(p);
            }
            reload();
        } catch (err) {
            alert("Error loading samples: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKill = async (id) => {
        try {
            await killProcess(id);
            reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClear = async () => {
        try {
            await clearProcesses();
            reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col flex-1 h-full shadow-lg">
            <div className="p-4 border-b border-dark-700 bg-dark-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-brand-blue">💻</span> Process Queue
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={handleLoadSamples} 
                        disabled={isSubmitting}
                        className="text-xs bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-3 py-1 rounded hover:bg-brand-blue/30 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Loading...' : 'Load Samples'}
                    </button>
                    <button 
                        onClick={handleClear} 
                        disabled={isSubmitting}
                        className="text-xs bg-red-900/40 text-red-400 px-3 py-1 rounded hover:bg-red-900/60 transition disabled:opacity-50"
                    >
                        Wipe All
                    </button>
                </div>
            </div>
            
            {/* Create Process Form */}
            <form onSubmit={handleAdd} className="p-4 grid grid-cols-5 gap-3 bg-dark-900/50 border-b border-dark-700">
                <input required value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Proc Name" className="bg-dark-800 text-sm p-2 rounded border border-dark-600 focus:outline-none focus:border-brand-blue" />
                <input required value={burstTime} onChange={e=>setBurstTime(e.target.value)} type="number" placeholder="Burst (ms)" className="bg-dark-800 text-sm p-2 rounded border border-dark-600 focus:outline-none focus:border-brand-blue" />
                <input required value={priority} onChange={e=>setPriority(e.target.value)} type="number" placeholder="Priority (0=High)" className="bg-dark-800 text-sm p-2 rounded border border-dark-600 focus:outline-none focus:border-brand-blue" />
                <input required value={memoryRequired} onChange={e=>setMemoryRequired(e.target.value)} type="number" placeholder="Memory (bytes)" className="bg-dark-800 text-sm p-2 rounded border border-dark-600 focus:outline-none focus:border-brand-blue" />
                <button type="submit" className="bg-brand-blue text-white rounded font-medium hover:bg-blue-600 transition text-sm">Add Process</button>
            </form>

            <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs text-gray-500 uppercase bg-dark-900/50">
                        <tr>
                            <th className="px-3 py-2">PID</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">State</th>
                            <th className="px-3 py-2 text-center">Burst</th>
                            <th className="px-3 py-2 text-center">Mem</th>
                            <th className="px-3 py-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-500 italic">No processes in queue. Add one to begin.</td></tr>
                        )}
                        {processes.map(p => (
                            <tr key={p._id} className="border-b border-dark-700 hover:bg-dark-700/50">
                                <td className="px-3 py-2 font-mono text-xs">{p.pid}</td>
                                <td className="px-3 py-2 font-medium text-white">{p.name}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium
                                        ${p.state === 'RUNNING' ? 'bg-brand-green/20 text-brand-green' : ''}
                                        ${p.state === 'READY' || p.state === 'NEW' ? 'bg-brand-yellow/20 text-brand-yellow' : ''}
                                        ${p.state === 'WAITING' ? 'bg-orange-500/20 text-orange-400' : ''}
                                        ${p.state === 'TERMINATED' ? 'bg-gray-600/20 text-gray-400' : ''}
                                    `}>
                                        {p.state}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-center">{p.burstTime}</td>
                                <td className="px-3 py-2 text-center">{p.memoryRequired}B</td>
                                <td className="px-3 py-2 text-right">
                                    {p.state !== 'TERMINATED' && (
                                        <button onClick={() => handleKill(p._id)} className="text-brand-red hover:text-red-400 p-1">Kill</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcessTable;
