# 📄 01: High-Level Overview

## 🌟 What is the Mini OS Simulator?

The **Mini Operating System Simulator** is a full-stack educational tool designed to replicate the inner workings of a modern Operating System. It provides a visual and interactive environment for observing how a computer manages multiple tasks (CPU Scheduling), how it partitions physical memory (RAM Management), and how it persists data (Virtual File System).

Instead of dealing with complex kernel code, this simulator uses a modern web stack to replicate these logic-heavy concepts in a way that is easy to visualize and debug.

---

## 🛠️ Key Modules

### 1. CPU Scheduler
Simulates the "Brain" of the OS. It manages a queue of processes and decides which one gets the CPU's attention.
- **Concepts**: Preemption, Time Quantum, Context Switching, Burst Time.
- **Supported Algorithms**: Round Robin (RR), First Come First Serve (FCFS), Priority Scheduling.

### 2. Memory Manager
Simulates physical **RAM**. It divides memory into discrete blocks and allocates them to processes.
- **Concepts**: First-Fit Allocation, External Fragmentation, Volatile vs. Non-Volatile Memory.
- **Feature**: Supports loading files into RAM buffers, demonstrating how the OS uses RAM as a workspace for disk data.

### 3. Virtual File System (VFS)
Simulates a **Persistent Disk (HDD/SSD)**. It maintains a hierarchical structure of folders and files.
- **Concepts**: Directories, Path Traversal, Storage Constraints, File Buffering.
- **Feature**: Hierarchical navigation with recursive size calculation (e.g., a folder's size is the sum of its files).

---

## 💻 The Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React.js + Tailwind CSS** | Provides the real-time Dashboard, interactive charts, and CSS animations. |
| **Backend** | **Node.js + Express.js** | Handles simulation logic, complex algorithm execution, and API routing. |
| **Database** | **MongoDB (Mongoose)** | Persists the state of the OS (Process Control Blocks, Memory Blocks, File Tree). |

---

## 🧠 Real-World Concepts Simulated

This project isn't just a UI; it is grounded in real computer science theory:
1. **The PCB (Process Control Block)**: Every process in the system has a record tracking its state, PID, remaining time, and memory address—just like a real OS kernel does.
2. **First-Fit Allocation**: One of the most common memory allocation strategies used before modern Paging systems became the standard.
3. **Round Robin Scheduling**: The backbone of modern time-sharing systems (like Linux or Windows), ensuring no single process hogs the CPU.
4. **Buffer Caching**: Demonstrating that files are on the "Disk" but must be moved to "RAM" to be read.
