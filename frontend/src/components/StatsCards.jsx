import React from 'react';

const StatsCards = ({ processes, memory, storage }) => {
    const totalCurrentProcesses = processes.filter(p => !['TERMINATED'].includes(p.state)).length;
    const runningProcesses = processes.filter(p => p.state === 'RUNNING').length;
    const terminatedProcesses = processes.filter(p => p.state === 'TERMINATED').length;
    
    const usedMemoryBlocks = memory.filter(m => !m.isFree).length;
    const memoryUsagePercent = memory.length ? Math.round((usedMemoryBlocks / memory.length) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card title="Active Queue" value={totalCurrentProcesses} color="border-brand-blue" />
            <Card title="Running Cores" value={runningProcesses} color="border-brand-green" />
            <Card title="Completed Jobs" value={terminatedProcesses} color="border-gray-500" />
            <Card title="RAM Utilization" value={`${memoryUsagePercent}%`} color="border-brand-purple" />
            <Card title="Storage Usage" value={`${storage?.percent || 0}%`} color="border-orange-500" />
        </div>
    );
};

const Card = ({ title, value, color }) => (
    <div className={`bg-dark-800 p-4 rounded-xl border-l-4 ${color} shadow-lg flex flex-col justify-between`}>
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
    </div>
);

export default StatsCards;
