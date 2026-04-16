import FileNode from '../models/FileNode.js';
import SystemLog from '../models/SystemLog.js';

class FileSystemService {
    constructor() {
        this.DISK_CAPACITY = 64 * 1024; // 64 KB
    }

    async getStats() {
        const files = await FileNode.find({ type: 'FILE' });
        const used = files.reduce((acc, f) => acc + (f.size || 0), 0);
        return {
            used,
            total: this.DISK_CAPACITY,
            percent: Math.round((used / this.DISK_CAPACITY) * 100)
        };
    }

    async getChildren(parentId = null) {
        const queryParent = parentId === 'root' ? null : parentId;
        const nodes = await FileNode.find({ parentId: queryParent }).sort({ type: 1, name: 1 });
        
        // Enhance directories with recursive size
        const enhancedNodes = await Promise.all(nodes.map(async node => {
            const n = node.toObject();
            if (n.type === 'DIRECTORY') {
                n.size = await this._calculateRecursiveSize(n._id);
            }
            return n;
        }));
        
        return enhancedNodes;
    }

    async _calculateRecursiveSize(directoryId) {
        let totalSize = 0;
        const children = await FileNode.find({ parentId: directoryId });
        
        for (const child of children) {
            if (child.type === 'FILE') {
                totalSize += (child.size || 0);
            } else if (child.type === 'DIRECTORY') {
                totalSize += await this._calculateRecursiveSize(child._id);
            }
        }
        return totalSize;
    }

    async getItem(id) {
        return await FileNode.findById(id);
    }

    async getTree(parentId = null) {
        const queryParent = parentId === 'root' ? null : parentId;
        const nodes = await FileNode.find({ parentId: queryParent });
        let tree = [];
        for (let node of nodes) {
            let n = node.toObject();
            if (n.type === 'DIRECTORY') {
                n.children = await this.getTree(n._id);
            }
            tree.push(n);
        }
        return tree;
    }

    async createItem(parentId, name, type, content = "") {
        try {
            const size = type === 'FILE' ? Buffer.byteLength(content, 'utf8') : 0;
            
            // Check Disk Capacity
            if(type === 'FILE') {
                const stats = await this.getStats();
                if(stats.used + size > this.DISK_CAPACITY) {
                    throw new Error("Disk Full: Not enough persistent storage space.");
                }
            }

            const node = new FileNode({
                parentId: parentId === 'root' ? null : parentId,
                name,
                type,
                content: type === 'FILE' ? content : "",
                size
            });
            await node.save();
            await this._log('INFO', `Created ${type} ${name}`);
            return node;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`File or Directory with name ${name} already exists here.`);
            }
            throw error;
        }
    }

    async deleteItem(id) {
        const node = await FileNode.findById(id);
        if(!node) throw new Error("Item not found");

        // Simple recursive deletion simulation
        if(node.type === 'DIRECTORY') {
            await FileNode.deleteMany({ parentId: id });
        }
        await node.deleteOne();
        await this._log('INFO', `Deleted ${node.name}`);
        return { message: "Deleted successfully" };
    }

    async _log(level, message, details = {}) {
        await SystemLog.create({ level, source: 'FILESYSTEM', message, details });
    }
}

export default new FileSystemService();
