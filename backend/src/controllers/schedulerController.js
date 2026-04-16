import schedulerService from '../services/SchedulerService.js';

export const runScheduler = async (req, res) => {
    try {
        const { algorithm, timeQuantum } = req.body;
        let result;

        switch (algorithm) {
            case 'FCFS':
                result = await schedulerService.runFCFS();
                break;
            case 'RR':
                result = await schedulerService.runRoundRobin(Number(timeQuantum) || 2);
                break;
            case 'PRIORITY':
                result = await schedulerService.runPriority();
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid algorithm" });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
