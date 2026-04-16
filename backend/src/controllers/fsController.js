import fsService from '../services/FileSystemService.js';
import MemoryService from '../services/MemoryService.js';

export const getFileSystem = async (req, res) => {
    try {
        const children = await fsService.getChildren(req.query.parentId || null);
        res.status(200).json({ success: true, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFileSystemStats = async (req, res) => {
    try {
        const stats = await fsService.getStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFileSystemItem = async (req, res) => {
    try {
        const item = await fsService.getItem(req.params.id);
        if(!item) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const openFile = async (req, res) => {
    try {
        const item = await fsService.getItem(req.params.id);
        if(!item || item.type !== 'FILE') throw new Error("File not found");

        // Simulate reading into RAM
        await MemoryService.allocateBuffer(item.name, item.size || 100); 
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const closeFile = async (req, res) => {
    try {
        const item = await fsService.getItem(req.params.id);
        if(!item) throw new Error("File not found");

        await MemoryService.deallocateBuffer(item.name);
        res.status(200).json({ success: true, message: "Buffer released" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createFileSystemItem = async (req, res) => {
    try {
        const { parentId, name, type, content } = req.body;
        const item = await fsService.createItem(parentId, name, type, content);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteFileSystemItem = async (req, res) => {
    try {
        const result = await fsService.deleteItem(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
