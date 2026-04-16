# 📄 07: Execution Flow Trace

This document provides a trace of what happens to data as a process moves through the system.

---

## 🧵 Scenario: Running Round Robin (TQ=2) with 2 Processes

### Initial State
| Process | Burst | State | Memory |
| :--- | :--- | :--- | :--- |
| **P1** | 3 | READY | 1024 / MB-0 |
| **P2** | 1 | READY | 2048 / MB-1 |

---

### Step 1: P1 Starts (Tick 1)
- **Scheduler**: Picks P1.
- **State Change**: P1 state -> `RUNNING`.
- **UI Update**: P1 row turns **Blue** (Running color).
- **RAM View**: MB-0 remains **Red** (Occupied).
- **Data Change**: `P1.remainingTime` = 2.

### Step 2: P1 Preempted (Tick 2)
- **Condition**: Time Quantum (2s) reached. P1 is not finished.
- **Action**: P1 state -> `READY`.
- **Queue**: P1 is moved to the end of the queue.
- **UI Update**: P1 row turns back to default.

### Step 3: P2 Starts and Finishes (Tick 3)
- **Scheduler**: Picks P2.
- **State Change**: P2 state -> `RUNNING`.
- **Burst Check**: Only needs 1s.
- **Cleanup**: 
    1. P2 state -> `TERMINATED`.
    2. `MemoryService.deallocateMemory(P2)` is called.
    3. MB-1 `isFree` becomes **True**.
- **UI Update**: P2 row turns **Gray** (Terminated). RAM Block MB-1 turns **Green** (Free).

### Step 4: P1 Finishes (Tick 4)
- **Scheduler**: Picks P1 again.
- **State Change**: P1 state -> `RUNNING`.
- **Memory Check**: Already allocated (MB-0).
- **Data Change**: `P1.remainingTime` = 0.
- **Cleanup**: P1 state -> `TERMINATED`. MB-0 liberated.

---

## 📊 Summary of Life Cycle

Every process in our simulator follows this exact state machine:

1. **NEW**: Created via API but no memory assigned yet.
2. **READY**: Memory allocated, waiting for the CPU.
3. **RUNNING**: Currently being processed by the `SchedulerService`.
4. **TERMINATED**: Finished execution. Memory freed. Data persists for logging/stats.
