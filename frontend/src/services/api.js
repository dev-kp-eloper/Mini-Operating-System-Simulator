import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Process
export const createProcess = (data) => apiClient.post('/process', data);
export const fetchProcesses = () => apiClient.get('/process');
export const killProcess = (id) => apiClient.delete(`/process/${id}`);
export const clearProcesses = () => apiClient.delete('/process');

// Scheduler
export const runScheduler = (algorithm, timeQuantum = 2) => 
    apiClient.post('/scheduler/run', { algorithm, timeQuantum });

// Memory
export const initMemory = (totalBlocks, blockSize) => 
    apiClient.post('/memory/init', { totalBlocks, blockSize });
export const fetchMemoryStatus = () => apiClient.get('/memory');

// File System
export const fetchFileSystem = (parentId = '') => apiClient.get(`/fs${parentId ? `?parentId=${parentId}` : ''}`);
export const fetchFileSystemStats = () => apiClient.get('/fs/stats');
export const openFile = (id) => apiClient.post(`/fs/open/${id}`);
export const closeFile = (id) => apiClient.post(`/fs/close/${id}`);
export const createFileSystemItem = (data) => apiClient.post('/fs', data);
export const deleteFileSystemItem = (id) => apiClient.delete(`/fs/${id}`);

// Logs
export const fetchLogs = (limit = 100) => apiClient.get(`/logs?limit=${limit}`);
export const clearLogs = () => apiClient.delete('/logs');

export default apiClient;
