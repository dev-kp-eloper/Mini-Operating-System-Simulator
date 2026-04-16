import SystemLog from '../models/SystemLog.js';

export const getLogs = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 100;
        const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(limit);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearLogs = async (req, res) => {
    try {
        await SystemLog.deleteMany({});
        res.status(200).json({ success: true, message: "Logs cleared successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
