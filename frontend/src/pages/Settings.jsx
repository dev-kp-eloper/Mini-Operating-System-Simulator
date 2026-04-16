import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { initMemory, clearProcesses } from '../services/api';

const Settings = () => {
    const [totalBlocks, setTotalBlocks] = useState(10);
    const [blockSize, setBlockSize] = useState(1024);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleInitMemory = async (e) => {
        e.preventDefault();
        try {
            await initMemory(totalBlocks, blockSize);
            setStatus({ type: 'success', message: `Memory reset to ${totalBlocks} blocks of ${blockSize} bytes.` });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || error.message });
        }
    };

    const handleClearProcesses = async () => {
        try {
            await clearProcesses();
            setStatus({ type: 'success', message: 'All processes wiped from system.' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || error.message });
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
                    <p className="text-gray-400">Configure core OS parameters.</p>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-lg border ${status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                        {status.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Memory Settings */}
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">Memory Configuration</h2>
                        <form onSubmit={handleInitMemory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Total Blocks</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={totalBlocks}
                                    onChange={(e) => setTotalBlocks(Number(e.target.value))}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Block Size (Bytes)</label>
                                <input
                                    type="number"
                                    min="256"
                                    step="256"
                                    value={blockSize}
                                    onChange={(e) => setBlockSize(Number(e.target.value))}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-purple hover:bg-purple-600 text-white font-medium py-2 rounded-lg transition">
                                Re-Initialize Memory Map
                            </button>
                        </form>
                        <p className="text-xs text-brand-purple mt-3">Warning: This will clear existing memory allocations unconditionally.</p>
                    </div>

                    {/* Process Settings */}
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">System Wipe</h2>
                            <p className="text-gray-400 mb-6">Remove all processes from the system queue, including those running and terminated.</p>
                        </div>
                        <button 
                            onClick={handleClearProcesses}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition"
                        >
                            Wipe All Processes
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
