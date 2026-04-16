import MemoryBlock from '../models/MemoryBlock.js';
import Process from '../models/Process.js';
import SystemLog from '../models/SystemLog.js';

class MemoryService {
    
    // Initialize OS RAM with multiple contiguous empty blocks
    async initMemory(totalBlocks = 10, blockSize = 1024) {
        await MemoryBlock.deleteMany({});
        
        let blocks = [];
        for (let i = 0; i < totalBlocks; i++) {
            blocks.push({
                blockId: `MB-${i}`,
                startAddress: i * blockSize,
                size: blockSize,
                isFree: true
            });
        }
        await MemoryBlock.insertMany(blocks);
        await this._log('INFO', `Memory Initialized: ${totalBlocks} blocks of ${blockSize} bytes.`);
        return blocks;
    }

    async getMemoryStatus() {
        return await MemoryBlock.find().populate('processId', 'pid name').sort({ startAddress: 1 });
    }

    // Allocate memory using FIRST-FIT algorithm
    async allocateMemory(processId, requiredSize) {
        const process = await Process.findById(processId);
        if(!process) throw new Error("Process not found");
        
        // Ensure memory isn't already allocated
        const existingAllocation = await MemoryBlock.findOne({ processId });
        if(existingAllocation) throw new Error("Process is already in memory");

        // Find first free block large enough
        const blocks = await MemoryBlock.find({ isFree: true }).sort({ startAddress: 1 });
        
        // Simple First Fit simulation
        const availableBlock = blocks.find(b => b.size >= requiredSize);
        if (!availableBlock) {
             await this._log('ERROR', `Out of Memory or No contiguous block large enough for process ${process.pid}`);
             throw new Error("Out of Memory. Wait for existing processes to terminate.");
        }

        availableBlock.isFree = false;
        availableBlock.processId = process._id;
        availableBlock.ownerName = `Process: ${process.pid}`;
        await availableBlock.save();

        await this._log('INFO', `Assigned ${requiredSize} bytes to ${process.pid} at block ${availableBlock.blockId}`);
        return availableBlock;
    }

    async allocateBuffer(name, requiredSize) {
        const blocks = await MemoryBlock.find().sort({ startAddress: 1 });
        const freeBlocks = blocks.filter(b => b.isFree);
        
        const availableBlock = freeBlocks.find(b => b.size >= requiredSize);
        if (!availableBlock) {
             const largestBlock = Math.max(...blocks.map(b => b.size));
             if (requiredSize > largestBlock) {
                 throw new Error(`File size (${requiredSize}B) exceeds the configured Memory Block Size (${largestBlock}B). Increase project block size in Settings.`);
             }
             throw new Error(`Insufficient contiguous RAM to buffer file ${name} (${requiredSize}B). Try terminating other processes.`);
        }

        availableBlock.isFree = false;
        availableBlock.ownerName = `Buffer: ${name}`;
        await availableBlock.save();
        await this._log('INFO', `Buffered file ${name} in block ${availableBlock.blockId}`);
        return availableBlock;
    }

    async deallocateMemory(processId) {
        const block = await MemoryBlock.findOne({ processId });
        if(!block) return null;

        block.isFree = true;
        block.processId = null;
        block.ownerName = null;
        await block.save();
        
        await this._log('INFO', `Deallocated memory at block ${block.blockId}`);
        return block;
    }

    async deallocateBuffer(name) {
        const block = await MemoryBlock.findOne({ ownerName: `Buffer: ${name}` });
        if(!block) return null;

        block.isFree = true;
        block.ownerName = null;
        block.processId = null;
        await block.save();
        await this._log('INFO', `Released buffer for ${name}`);
        return block;
    }

    async _log(level, message, details = {}) {
        await SystemLog.create({ level, source: 'MEMORY', message, details });
    }
}

export default new MemoryService();
