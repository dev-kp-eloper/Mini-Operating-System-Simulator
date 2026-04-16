import mongoose from 'mongoose';

const fileNodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['FILE', 'DIRECTORY'],
        required: true
    },
    content: {
        type: String,
        default: "" // Files only
    },
    size: {
        type: Number,
        default: 0
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileNode',
        default: null // null means root
    }
}, {
    timestamps: true
});

// Compound index to ensure filenames are unique within the same parent directory
fileNodeSchema.index({ name: 1, parentId: 1 }, { unique: true });

const FileNode = mongoose.model('FileNode', fileNodeSchema);
export default FileNode;
