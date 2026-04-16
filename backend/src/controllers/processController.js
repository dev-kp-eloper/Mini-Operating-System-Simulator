import processService from '../services/ProcessService.js';

export const createProcess = async (req, res) => {
    try {
        const process = await processService.createProcess(req.body);
        res.status(201).json({ success: true, data: process });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllProcesses = async (req, res) => {
    try {
        const processes = await processService.getAllProcesses();
        res.status(200).json({ success: true, data: processes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const killProcess = async (req, res) => {
    try {
        const process = await processService.killProcess(req.params.id);
        res.status(200).json({ success: true, data: process });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const wipeProcesses = async (req, res) => {
    try {
        await processService.deleteAllProcesses();
        res.status(200).json({ success: true, message: 'Wiped all processes' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
