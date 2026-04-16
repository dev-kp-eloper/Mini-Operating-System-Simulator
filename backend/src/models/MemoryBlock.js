import mongoose from 'mongoose';

const memoryBlockSchema = new mongoose.Schema({
    blockId: {
        type: String,
        required: true,
        unique: true
    },
    startAddress: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    isFree: {
        type: Boolean,
        default: true,
    },
    processId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Process',
        default: null
    },
    ownerName: {
        type: String,
        default: null // e.g. "Process: P101" or "Buffer: app.js"
    }
}, {
    timestamps: true
});

const MemoryBlock = mongoose.model('MemoryBlock', memoryBlockSchema);
export default MemoryBlock;
