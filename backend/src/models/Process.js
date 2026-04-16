import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
    pid: {
        type: String,
        required: true,
        unique: true,
        default: () => `P${Math.floor(Math.random() * 10000)}`
    },
    name: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        enum: ['NEW', 'READY', 'RUNNING', 'WAITING', 'TERMINATED'],
        default: 'NEW'
    },
    priority: {
        type: Number,
        default: 0, // Higher number = higher priority OR lower = higher, up to scheduler design. Let's say smaller number = higher priority (0 is max).
    },
    arrivalTime: {
        type: Number,
        default: Date.now,
    },
    burstTime: {
        type: Number,
        required: true,
    },
    remainingTime: {
        type: Number,
        required: true,
    },
    completionTime: {
        type: Number,
    },
    turnAroundTime: {
        type: Number,
    },
    waitingTime: {
        type: Number,
    },
    memoryRequired: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Process = mongoose.model('Process', processSchema);
export default Process;
