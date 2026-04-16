import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['INFO', 'WARN', 'ERROR'],
        default: 'INFO'
    },
    source: {
        type: String,
        enum: ['PROCESS', 'MEMORY', 'FILESYSTEM', 'SCHEDULER', 'SYSTEM'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const SystemLog = mongoose.model('SystemLog', systemLogSchema);
export default SystemLog;
