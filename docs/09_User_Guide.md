# 📄 09: User Guide

This guide explains how to use the OS Simulator interface and verify its features.

---

## 🚀 1. Getting Started: The Dashboard

The Dashboard is your control center. It is divided into four main sections:

1. **Stats Cards (Top)**: Real-time percentages of RAM, CPU threads, and Storage.
2. **Process Table (Left Mid)**: Shows all created processes, their PIDs, and their remaining work.
3. **Memory Visualizer (Left Bottom)**: A grid of RAM blocks. 
    - **Green**: Free memory.
    - **Red**: Occupied by a process or file buffer.
4. **Logs Panel (Right)**: A live feed of every decision the OS makes.

---

## 🧪 2. Creating and Running Processes

1. **Add Process**: Click "Add Process" and enter a name (e.g., "Terminal") and burst time.
2. **Load Samples**: For a full test, click **"Load Sample Processes"**. This will populate 12 diverse tasks for you.
3. **Execute**: Select an algorithm (like Round Robin) from the settings panel and click **"Run Scheduler"**.
4. **Observe**: Watch the "State" column change and the MemoryBlocks turn red as the OS allocates and deallocates resources.

---

## 📂 3. Managing the File System

1. Navigate to the **"File System"** page via the sidebar.
2. **Creation**: Enter a name and select "Directory" or "File".
3. **Navigation**: Double-click a folder icon to "Enter" it. Use the breadcrumb bar at the top to go back.
4. **RAM Buffering**: 
    - Double-click a file (e.g., `notes.txt`).
    - The system will try to find a free RAM block.
    - If successful, a viewing modal will appear.
    - Close the modal to free the RAM block.

---

## ⚙️ 4. System Settings

- **Clear Logs**: Useful for wiping the history before starting a new simulation.
- **Wipe All**: Deletes all processes and memory mappings for a total system reset.
- **Initialization**: You can re-initialize memory with custom block sizes (e.g., 5 blocks of 2048B each).

---

## 💡 Example Test Scenario (The Fragmentation Test)

1. Create 5 processes of 1024B each.
2. Delete the 2nd and 4th process.
3. You now have 2048B total free memory, but it is **Fragmented** (two separate blocks).
4. Try to create a single 2048B process.
5. **Observe**: The system will give a memory error because there is no **contiguous** 2048B block available!
