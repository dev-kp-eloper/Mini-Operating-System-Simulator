import memoryService from '../services/MemoryService.js';

export const initMemory = async (req, res) => {
    try {
        const { totalBlocks, blockSize } = req.body;
        const blocks = await memoryService.initMemory(totalBlocks, blockSize);
        res.status(200).json({ success: true, data: blocks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMemoryStatus = async (req, res) => {
    try {
        const status = await memoryService.getMemoryStatus();
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
