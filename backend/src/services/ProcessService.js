import Process from '../models/Process.js';
import SystemLog from '../models/SystemLog.js';

class ProcessService {
    async createProcess(data) {
        const process = new Process({
            name: data.name,
            burstTime: data.burstTime,
            remainingTime: data.burstTime,
            priority: data.priority || 0,
            memoryRequired: data.memoryRequired || 0
        });
        
        await process.save();
        await this._log('INFO', `Process ${process.pid} (${process.name}) created.`);
        return process;
    }

    async getAllProcesses() {
        return await Process.find().sort({ createdAt: -1 });
    }

    async getProcessById(id) {
        return await Process.findById(id);
    }

    async killProcess(id) {
        const process = await Process.findById(id);
        if(!process) throw new Error("Process not found");
        
        process.state = 'TERMINATED';
        await process.save();
        await this._log('WARN', `Process ${process.pid} was forcefully manually killed.`);
        return process;
    }
    
    async deleteAllProcesses() {
        await Process.deleteMany({});
        await this._log('WARN', `All processes cleared from the system.`);
    }

    async _log(level, message, details = {}) {
        await SystemLog.create({ level, source: 'PROCESS', message, details });
    }
}

export default new ProcessService();
