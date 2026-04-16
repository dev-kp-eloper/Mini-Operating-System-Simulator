import express from 'express';

import { createProcess, getAllProcesses, killProcess, wipeProcesses } from '../controllers/processController.js';
import { runScheduler } from '../controllers/schedulerController.js';
import { initMemory, getMemoryStatus } from '../controllers/memoryController.js';
import { getFileSystem, createFileSystemItem, deleteFileSystemItem, getFileSystemStats, getFileSystemItem, openFile, closeFile } from '../controllers/fsController.js';
import { getLogs, clearLogs } from '../controllers/logController.js';

const router = express.Router();

// Process Routes
router.post('/process', createProcess);
router.get('/process', getAllProcesses);
router.delete('/process/:id', killProcess);
router.delete('/process', wipeProcesses);

// Scheduler Routes
router.post('/scheduler/run', runScheduler);

// Memory Routes
router.post('/memory/init', initMemory);
router.get('/memory', getMemoryStatus);

// File System Routes
router.get('/fs', getFileSystem);
router.get('/fs/stats', getFileSystemStats);
router.get('/fs/:id', getFileSystemItem);
router.post('/fs/open/:id', openFile);
router.post('/fs/close/:id', closeFile);
router.post('/fs', createFileSystemItem);
router.delete('/fs/:id', deleteFileSystemItem);

// Logs Route
router.get('/logs', getLogs);
router.delete('/logs', clearLogs);

export default router;
