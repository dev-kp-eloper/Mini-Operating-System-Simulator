import React, { useState, useEffect } from 'react';
import { initMemory } from '../services/api';

const MemoryVisualizer = ({ memory, reload }) => {
    
    const totalBlocksCount = memory.length;
    const blockSize = memory[0] ? memory[0].size : 1024; // fallback

    const handleReset = async () => {
        try {
            await initMemory(10, 1024); // Force reset to 10 blocks of 1KB
            reload();
        } catch(e) { console.error(e); }
    }

    return (
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700 shadow-lg mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-brand-green">💾</span> RAM Allocation (First-Fit)
                </h3>
                <button onClick={handleReset} className="text-xs border border-dark-600 hover:bg-dark-700 px-3 py-1 rounded transition text-gray-300">
                    Format RAM
                </button>
            </div>
            
            {memory.length === 0 ? (
                <div className="text-center py-6 text-gray-500 italic text-sm border border-dashed border-dark-600 rounded">
                    Memory not initialized. Click 'Format RAM'.
                </div>
            ) : (
                <div className="flex flex-wrap gap-1 border border-dark-700 p-2 rounded bg-dark-900 overflow-x-auto min-h-[100px] content-start">
                    {memory.map((block, idx) => (
                        <div 
                            key={block._id}
                            title={`Block ${block.blockId} | ${block.size}B | ${block.isFree ? 'Free' : `Used by ${block.processId?.pid}`}`}
                            className={`flex flex-col justify-center items-center rounded text-xs select-none relative group overflow-hidden border
                                ${block.isFree 
                                    ? 'bg-dark-800 border-dark-600 text-gray-500' 
                                    : 'bg-brand-blue/20 border-brand-blue text-blue-200'
                                }`}
                            style={{ flex: '1 1 8%', minWidth: '40px', height: '60px' }}
                        >
                            <span className="font-bold opacity-50 absolute -top-1 right-1 text-[10px]">{idx}</span>
                            {block.isFree ? 'FREE' : <span className="font-mono">{block.processId?.pid}</span>}
                            
                            {/* Hover info */}
                            <div className="absolute inset-0 bg-dark-900/90 text-white flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex text-[10px] p-1">
                                <span>{block.size}B</span>
                                <span>{block.startAddress}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>0x0000</span>
                <span>Max Capacity: {totalBlocksCount * blockSize} Bytes</span>
            </div>
        </div>
    );
};

export default MemoryVisualizer;
