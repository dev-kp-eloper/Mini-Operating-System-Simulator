import Process from '../models/Process.js';
import MemoryService from './MemoryService.js';
import SystemLog from '../models/SystemLog.js';

class SchedulerService {
    
    // Helper for real-time simulation
    async _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async runFCFS() {
        // Fetch all READY or NEW processes
        const processes = await Process.find({ state: { $in: ['NEW', 'READY'] } }).sort({ arrivalTime: 1 });
        if(processes.length === 0) return { message: "No processes to schedule", timeline: [] };

        const timeline = [];
        let currentTime = 0;

        for (let process of processes) {
            // Allocate memory if not allocated
            if(process.memoryRequired > 0) {
                try {
                    await MemoryService.allocateMemory(process._id, process.memoryRequired);
                } catch(e) {
                    await this._log('WARN', `FCFS: Skipped ${process.pid} due to Memory Limit.`);
                    continue; // Skip execution if no memory
                }
            }

            process.state = 'RUNNING';
            await process.save();
            await this._log('INFO', `FCFS: ${process.pid} is running.`);

            // Simulation step logic
            timeline.push({
                pid: process.pid,
                startTime: currentTime,
                endTime: currentTime + process.burstTime
            });

            // "Real-time" delay to let frontend fetch and visualize RAM usage
            await this._simulateDelay(process.burstTime * 1000);

            currentTime += process.burstTime;

            process.remainingTime = 0;
            process.completionTime = currentTime;
            process.turnAroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnAroundTime - process.burstTime;
            process.state = 'TERMINATED';
            await process.save();

            await MemoryService.deallocateMemory(process._id);
        }

        await this._log('INFO', `FCFS Execution completed.`, { timeline });
        return { message: "FCFS executed successfully", timeline };
    }

    async runRoundRobin(timeQuantum = 2) {
        const processes = await Process.find({ state: { $in: ['NEW', 'READY', 'WAITING'] } }).sort({ arrivalTime: 1 });
        if(processes.length === 0) return { message: "No processes to schedule", timeline: [] };

        let queue = [...processes];
        let currentTime = 0;
        const timeline = [];

        while(queue.length > 0) {
            let process = queue.shift();
            
            // Allocate memory conceptually if first time
            if(process.state === 'NEW' && process.memoryRequired > 0) {
                try {
                    await MemoryService.allocateMemory(process._id, process.memoryRequired);
                } catch(e) {
                    await this._log('WARN', `RR: Skipped ${process.pid} - Memory Limit.`);
                    continue; 
                }
            }

            process.state = 'RUNNING';
            await process.save();
            
            let execTime = Math.min(process.remainingTime, timeQuantum);
            
            timeline.push({
                pid: process.pid,
                startTime: currentTime,
                endTime: currentTime + execTime
            });

            // "Real-time" delay to let frontend fetch and visualize RAM usage
            await this._simulateDelay(execTime * 1000);

            currentTime += execTime;
            process.remainingTime -= execTime;

            if(process.remainingTime > 0) {
                process.state = 'WAITING';
                await process.save();
                queue.push(process); // add back to end of queue
            } else {
                process.completionTime = currentTime;
                process.turnAroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnAroundTime - process.burstTime;
                process.state = 'TERMINATED';
                await process.save();
                
                await MemoryService.deallocateMemory(process._id);
            }
        }

        await this._log('INFO', `Round Robin (TQ=${timeQuantum}) execution completed.`, { timeline });
        return { message: "Round Robin executed successfully", timeline };
    }

    async runPriority() {
         // Lower number priority runs first
        const processes = await Process.find({ state: { $in: ['NEW', 'READY'] } }).sort({ priority: 1, arrivalTime: 1 });
        if(processes.length === 0) return { message: "No processes to schedule", timeline: [] };

        const timeline = [];
        let currentTime = 0;

        for (let process of processes) {
             if(process.memoryRequired > 0) {
                try {
                    await MemoryService.allocateMemory(process._id, process.memoryRequired);
                } catch(e) {
                    continue; 
                }
            }
            process.state = 'RUNNING';
            await process.save();

            timeline.push({
                pid: process.pid,
                startTime: currentTime,
                endTime: currentTime + process.burstTime
            });

            // "Real-time" delay to let frontend fetch and visualize RAM usage
            await this._simulateDelay(process.burstTime * 1000);

            currentTime += process.burstTime;

            process.remainingTime = 0;
            process.completionTime = currentTime;
            process.turnAroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnAroundTime - process.burstTime;
            process.state = 'TERMINATED';
            await process.save();

            await MemoryService.deallocateMemory(process._id);
        }

        await this._log('INFO', `Priority Scheduling completed.`, { timeline });
        return { message: "Priority executed successfully", timeline };
    }

    async _log(level, message, details = {}) {
        await SystemLog.create({ level, source: 'SCHEDULER', message, details });
    }
}

export default new SchedulerService();
