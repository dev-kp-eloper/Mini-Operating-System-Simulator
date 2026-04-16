# 📄 06: Codebase Walkthrough

This document serves as a guided tour through the repository's folder structure and critical files.

---

## 📂 1. Backend Structure (`/backend/src`)

### `/models`
Where the Data Schemas live.
- `Process.js`: Defines the PCB.
- `MemoryBlock.js`: Defines the RAM slots.
- `FileNode.js`: Defines the Virtual File System.

### `/services`
**The Engine Room.** Most of your technical logic is here.
- `SchedulerService.js`: Contains the mathematical implementation of algorithms like Round Robin.
- `MemoryService.js`: Logic for finding adjacent blocks and assigning memory.
- `FileSystemService.js`: Recursive logic for folder size calculation and navigation.

### `/controllers`
- Mediators between Request and Service.
- `fsController.js`: Manages the API endpoints for opening files and getting stats.

### `/routes`
- `index.js`: The central map. If you want to add a new feature, you must register its URL here.

---

## 📂 2. Frontend Structure (`/frontend/src`)

### `/pages`
The "Big Screens" of the app.
- `Dashboard.jsx`: The main cockpit. It manages the global state and triggers the 3-second polling interval.
- `FileSystem.jsx`: The File Explorer page. It contains the breadcrumbs and the file grid.

### `/components`
Reusable UI parts.
- `MemoryVisualizer.jsx`: Uses CSS Flexbox to render the RAM blocks.
- `LogsPanel.jsx`: A terminal-like component that auto-scrolls to the latest system event.
- `StatsCards.jsx`: Displays top-level metrics like RAM/Storage utilization percentages.

### `/services`
- `api.js`: All `axios` calls are grouped here. If the Backend port changes, this is the only file you need to update.

---

## 🔗 How They Connect

1. **The Entry Point**: `backend/src/app.js` starts the Express server and connects to MongoDB.
2. **The Flow**:
    - User clicks a button in a React **Component**.
    - The Component calls a function in `frontend/services/api.js`.
    - `api.js` sends an HTTP request to the **Backend Routes**.
    - The **Controller** receives it and delegates the work to a **Service**.
    - The **Service** updates the **Model** in the DB.
    - All other Components on the **Dashboard** see the change during their next 3-second poll.
