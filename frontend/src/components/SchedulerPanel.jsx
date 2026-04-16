import React, { useState } from 'react';
import { runScheduler } from '../services/api';

const SchedulerPanel = ({ reload }) => {
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        try {
            await runScheduler(algorithm, timeQuantum);
            // In a real OS this would be socket pushed. We'll poll reload heavily after trigger.
            reload(); 
        } catch (err) {
            alert("Error running scheduler");
        }
        setIsRunning(false);
    };

    return (
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700 shadow-lg">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-brand-purple">⚙️</span> CPU Scheduler Setup
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Select Algorithm</label>
                    <select 
                        className="w-full bg-dark-900 border border-dark-600 text-sm text-gray-200 rounded p-2 focus:outline-none focus:border-brand-purple"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                    >
                        <option value="FCFS">First Come First Serve (FCFS)</option>
                        <option value="RR">Round Robin (RR)</option>
                        <option value="PRIORITY">Priority Scheduling</option>
                    </select>
                </div>

                {algorithm === 'RR' && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Time Quantum (ms)</label>
                        <input 
                            type="number" 
                            className="w-full bg-dark-900 border border-dark-600 text-sm text-gray-200 rounded p-2 focus:outline-none focus:border-brand-purple"
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(e.target.value)}
                        />
                    </div>
                )}

                <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className="w-full mt-4 bg-brand-purple hover:bg-purple-600 text-white font-medium py-3 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.3)] transition disabled:opacity-50"
                >
                    {isRunning ? 'Executing simulation...' : `Execute ${algorithm} Run`}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                    Loads READY processes from queue and simulates execution over time.
                </p>
            </div>
        </div>
    );
};

export default SchedulerPanel;
