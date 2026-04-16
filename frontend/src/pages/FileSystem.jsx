import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { fetchFileSystem, createFileSystemItem, deleteFileSystemItem, fetchFileSystemStats, openFile, closeFile } from '../services/api';

const FileSystem = () => {
    const [items, setItems] = useState([]);
    const [path, setPath] = useState([{ _id: 'root', name: 'Home' }]);
    const [stats, setStats] = useState({ used: 0, total: 65536, percent: 0 });
    const [newItem, setNewItem] = useState({ name: '', type: 'FILE', content: '' });
    const [viewingFile, setViewingFile] = useState(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [error, setError] = useState(null);

    const currentFolderId = path[path.length - 1]._id;

    const loadData = async () => {
        try {
            const [fsRes, statsRes] = await Promise.all([
                fetchFileSystem(currentFolderId),
                fetchFileSystemStats()
            ]);
            setItems(fsRes.data.data);
            setStats(statsRes.data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, [path]);

    const navigateTo = (folder) => {
        setPath([...path, { _id: folder._id, name: folder.name }]);
    };

    const goBack = (index) => {
        setPath(path.slice(0, index + 1));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createFileSystemItem({
                parentId: currentFolderId,
                name: newItem.name,
                type: newItem.type,
                content: newItem.content
            });
            setNewItem({ name: '', type: 'FILE', content: '' });
            loadData();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteFileSystemItem(id);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleOpenFile = async (file) => {
        setIsBuffering(true);
        setError(null);
        try {
            await openFile(file._id);
            setViewingFile(file);
        } catch (err) {
            setError(err.response?.data?.message || "OOM: No RAM block available for buffer.");
            // Scroll to top to see error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsBuffering(false);
        }
    };

    const handleCloseFile = async () => {
        if (viewingFile) {
            await closeFile(viewingFile._id);
            setViewingFile(null);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-6 max-h-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">FileManager v2.0</h1>
                        <p className="text-gray-400">Manage persistent storage and load files into RAM buffers.</p>
                    </div>
                    
                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 w-64">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 font-mono">STORAGE UTILIZATION</span>
                            <span className="text-brand-blue font-bold">{stats.percent}%</span>
                        </div>
                        <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${stats.percent > 90 ? 'bg-brand-red' : 'bg-brand-blue'}`}
                                style={{ width: `${stats.percent}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 text-right">
                            {Math.round(stats.used / 1024)}KB / {Math.round(stats.total / 1024)}KB Used
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Panel */}
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 shadow-lg h-fit">
                        <h2 className="text-lg font-semibold text-white mb-4">New Entry</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                placeholder="Name"
                                value={newItem.name}
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue"
                                required
                            />
                            <select 
                                value={newItem.type} 
                                onChange={e => setNewItem({...newItem, type: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                            >
                                <option value="FILE">File</option>
                                <option value="DIRECTORY">Directory</option>
                            </select>
                            {newItem.type === 'FILE' && (
                                <textarea
                                    placeholder="File content..."
                                    value={newItem.content}
                                    onChange={e => setNewItem({...newItem, content: e.target.value})}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue min-h-[100px] text-sm font-mono"
                                />
                            )}
                            <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition">
                                Allocate Space
                            </button>
                        </form>
                    </div>

                    {/* Explorer Panel */}
                    <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700 flex flex-col shadow-lg overflow-hidden min-h-[500px]">
                        {/* Breadcrumbs */}
                        <div className="bg-dark-900/50 px-4 py-3 border-b border-dark-700 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {path.map((p, i) => (
                                <React.Fragment key={p._id}>
                                    <button 
                                        onClick={() => goBack(i)}
                                        className={`hover:text-brand-blue transition text-sm ${i === path.length - 1 ? 'text-white font-bold' : 'text-gray-500'}`}
                                    >
                                        {p.name}
                                    </button>
                                    {i < path.length - 1 && <span className="text-gray-700">/</span>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* File Grid */}
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto">
                            {items.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500 italic">Folder is empty</div>
                            )}
                            {items.map(item => (
                                <div 
                                    key={item._id}
                                    onDoubleClick={() => item.type === 'DIRECTORY' ? navigateTo(item) : handleOpenFile(item)}
                                    className="group relative bg-dark-900/40 border border-dark-700 hover:border-brand-blue/50 p-4 rounded-xl flex flex-col items-center gap-2 transition cursor-pointer"
                                >
                                    <span className="text-4xl group-hover:scale-110 transition duration-300 select-none">
                                        {item.type === 'DIRECTORY' ? '📂' : '📄'}
                                    </span>
                                    <span className="text-xs font-medium text-gray-300 text-center truncate w-full">{item.name}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">{item.size || 0} B</span>
                                    
                                    <button 
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className="absolute -top-1 -right-1 bg-red-900/80 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* File Viewer Modal */}
                {viewingFile && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <div className="bg-dark-800 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="p-4 bg-dark-900 border-b border-dark-700 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-brand-blue font-mono text-xs">BUFFER LOADED:</span>
                                    <span className="text-white font-bold">{viewingFile.name} ({viewingFile.size}B)</span>
                                </div>
                                <button onClick={handleCloseFile} className="text-gray-500 hover:text-white transition">✕ Close</button>
                            </div>
                            <div className="p-6 overflow-y-auto bg-dark-900/50 m-4 rounded-xl border border-dark-700 text-gray-300 font-mono text-sm whitespace-pre-wrap">
                                {viewingFile.content || <span className="italic opacity-50">Empty file.</span>}
                            </div>
                            <div className="p-4 bg-dark-800 text-[10px] text-gray-500 italic border-t border-dark-700">
                                This file content is currently loaded into a RAM block. Closing will deallocate the buffer.
                            </div>
                        </div>
                    </div>
                )}
                
                {isBuffering && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold animate-bounce shadow-xl">
                            ALLOCATING RAM BUFFER...
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FileSystem;
