# 📄 05: Database Design

The simulator uses **MongoDB** as its persistent store. Mongo was chosen for its schema flexibility (handling hierarchical trees and log entries easily) and its ability to store JSON-like objects that map directly to our JavaScript models.

---

## 🗃️ 1. Process Model (The PCB)
Represents a **Process Control Block**. It stores all metadata for a task.

| Field | Type | Description |
| :--- | :--- | :--- |
| `pid` | String | Unique Identifier (e.g., P101). |
| `name` | String | User-facing name (e.g., "Browser"). |
| `state` | String | NEW, READY, RUNNING, WAITING, or TERMINATED. |
| `burstTime` | Number | Total time needed on the CPU. |
| `remainingTime` | Number | Time left before completion. |
| `memoryRequired`| Number | RAM space needed (in bytes). |
| `priority` | Number | Priority level (Lower number = Higher Priority). |

---

## 💾 2. MemoryBlock Model
Represents a physical partition of the system **RAM**.

| Field | Type | Description |
| :--- | :--- | :--- |
| `blockId` | String | ID of the block (e.g., MB-0). |
| `startAddress` | Number | Base address in memory. |
| `size` | Number | Capacity of this block (e.g., 1024B). |
| `isFree` | Boolean | Whether the block is empty. |
| `ownerName` | String | Current occupant (Process ID or Buffer name). |
| `processId` | ObjectId | Reference to the occupying `Process` document. |

---

## 📁 3. FileNode Model
Represents the **Virtual File System**. It uses a self-referential tree structure.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Name of the file/folder. |
| `type` | String | `FILE` or `DIRECTORY`. |
| `content` | String | Text content (Files only). |
| `size` | Number | Size in bytes (calculated from content/children). |
| `parentId` | ObjectId | Reference to another `FileNode` (null = Root). |

### 🔗 Relationship Logic: Parent-Child
Each node stores the ID of its parent. To "Navigate into a folder", the API simply queries:
`db.filenodes.find({ parentId: selectedFolderId })`.

---

## 📜 4. SystemLog Model
Stores the clinical history of the OS.

| Field | Type | Description |
| :--- | :--- | :--- |
| `level` | String | INFO, WARN, or ERROR. |
| `source` | String | SCHEDULER, MEMORY, or FILESYSTEM. |
| `message` | String | Human-readable log entry. |

---

## 🏗️ Why No Relational SQL?
- **Hierarchical Tree**: Modeling a directory structure is much simpler with child-to-parent ObjectIds than complex recursive SQL joins.
- **Speed of Development**: The simulator state changes rapidly. Mongo's dynamic schema allowed us to add fields like `ownerName` to Memory blocks without a painful migration process.
