import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import StatsCards from '../components/StatsCards';
import ProcessTable from '../components/ProcessTable';
import SchedulerPanel from '../components/SchedulerPanel';
import MemoryVisualizer from '../components/MemoryVisualizer';
import LogsPanel from '../components/LogsPanel';
import { fetchProcesses, fetchMemoryStatus, fetchLogs, fetchFileSystemStats } from '../services/api';

const Dashboard = () => {
    const [processes, setProcesses] = useState([]);
    const [memory, setMemory] = useState([]);
    const [logs, setLogs] = useState([]);
    const [storageStats, setStorageStats] = useState({ used: 0, total: 65536, percent: 0 });

    const loadData = async () => {
        try {
            const [procRes, memRes, logsRes, statsRes] = await Promise.all([
                fetchProcesses(),
                fetchMemoryStatus(),
                fetchLogs(50),
                fetchFileSystemStats()
            ]);
            setProcesses(procRes.data.data);
            setMemory(memRes.data.data);
            setLogs(logsRes.data.data);
            setStorageStats(statsRes.data.data);
        } catch (error) {
            console.error("DataLoader Error: Backend might not be running.");
        }
    };

    // Polling setup for active simulation changes
    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 3000); // Poll every 3 seconds for UI updates
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            <StatsCards processes={processes} memory={memory} storage={storageStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
                {/* Left Column - Processes and Memory */}
                <div className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden gap-4">
                    <ProcessTable processes={processes} reload={loadData} />
                    <div className="shrink-0">
                        <MemoryVisualizer memory={memory} reload={loadData} />
                    </div>
                </div>

                {/* Right Column - Controls and Logs */}
                <div className="col-span-1 flex flex-col gap-4 overflow-hidden h-full">
                    <SchedulerPanel reload={loadData} />
                    <div className="flex-1 overflow-hidden">
                        <LogsPanel logs={logs} reload={loadData} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
