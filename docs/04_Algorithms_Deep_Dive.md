# 📄 04: Algorithms Explained

This document breaks down the "Physics" of the simulator—the algorithms that govern how resources are distributed.

---

## 🕒 1. Round Robin (RR)
**The "Fair Share" Algorithm.**

- **Concept**: Every process in the queue gets a small fixed slice of time, called a **Time Quantum** (TQ).
- **How it works**:
    1. The CPU takes the first process in the queue.
    2. It executes for 1 TQ (e.g., 2 seconds).
    3. If the process finishes, it is removed.
    4. If it doesn't finish, it is preempted (paused) and moved to the **back of the queue**.
    5. The CPU picks the next process in line.
- **Why it's used**: To ensure system responsiveness. No single background task can freeze the UI for other users.
- **Example**:
    - P1 (Burst 5), P2 (Burst 2), TQ = 2.
    - **T=0**: P1 runs for 2s. Rem: 3. Moves to back.
    - **T=2**: P2 runs for 2s. Rem: 0. Finished.
    - **T=4**: P1 runs for 2s. Rem: 1. Moves to back.
    - **T=6**: P1 runs for 1s. Rem: 0. Finished.

---

## 🏃 2. First Come First Serve (FCFS)
**The "Queue" Algorithm.**

- **Concept**: Simple queue logic. First in, first out (FIFO).
- **How it works**: The CPU starts executing the first process that arrived and refuses to stop until that process is 100% finished.
- **Why it's used**: It is simple and requires low overhead, but it can cause the **Convoy Effect**, where heavy processes block tiny ones.
- **Example**:
    - P1 (Burst 100), P2 (Burst 1).
    - P2 must wait 100 seconds to run even though it only needs 1 second of work.

---

## 🎖️ 3. Priority Scheduling
**The "VIP" Algorithm.**

- **Concept**: Every process has a numerical priority. The CPU always picks the one with the highest priority (e.g., 1 is higher than 5).
- **How it works**:
    1. Scan the list of ready processes.
    2. Pick the one with the lowest priority number.
    3. Execute it to completion.
- **Why it's used**: Critical system tasks (like the Kernel) must run before user apps.

---

## 🧠 4. First-Fit Memory Allocation
**The "Quick Search" Algorithm.**

- **Concept**: How to find a home for a process in RAM.
- **How it works**:
    1. The OS scans the RAM blocks from the beginning (Address 0).
    2. It picks the **very first hole** (free block) that is large enough to fit the process.
    3. It stops searching immediately.
- **Why it's used**: Speed. It is faster than finding the "Best-Fit" because it doesn't have to scan the entire memory map.
- **Limitation (The Simulation Lesson)**: This can lead to **External Fragmentation**, where free memory is scattered in small pieces, making it impossible to fit a large process.
