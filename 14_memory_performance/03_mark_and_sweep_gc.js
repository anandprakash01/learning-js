// For the first decade of JavaScript, Garbage Collection (GC) was a massive problem. Whenever the Garbage Collector ran, it had to freeze the entire Call Stack to safely delete memory. This is called a Stop-The-World event. If your server was processing 10,000 requests, and the GC decided to clean the Heap, every single request would freeze for several milliseconds.

// To fix this, Google built a highly advanced sub-engine inside V8 called Orinoco. It uses an algorithm called Generational Mark-and-Sweep.

// ==========================================
// PART I: THE CORE ALGORITHM (Mark & Sweep)
// ==========================================
// When the V8 Engine detects the Heap is getting full, it triggers the GC.
// The basic algorithm has two strict phases:

// Phase 1: THE MARKING PHASE
// 1. The GC starts at the Roots (Global Object, Call Stack).
// 2. It traverses every single pointer it can find.
// 3. Every time it finds an object in the Heap, it flags a tiny bit in memory: `isMarked = true`.
// 4. It continues down the chain until it reaches the end of all connections.

// Phase 2: THE SWEEPING PHASE
// 1. The GC scans the ENTIRE Heap memory linearly.
// 2. If it finds an object where `isMarked === false` (Unreachable data), it physically erases it and marks that RAM space as "Free".
// 3. It resets all `isMarked = true` flags back to `false` for the next cycle.

// ==========================================
// PART II: GENERATIONAL GC (The V8 Optimization)
// ==========================================
// A full Mark-and-Sweep across 1.4 Gigabytes of RAM is incredibly slow.
// V8 speeds this up using a rule called the "Generational Hypothesis":
// "Most objects die young." (e.g., Temporary variables inside functions).

// To exploit this, V8 splits the Heap into two separate physical zones:

// 1. THE YOUNG GENERATION (The Nursery)
// - Very small memory zone (usually 1MB - 8MB).
// - Every new object you create goes here first.
// - Cleaned constantly by a lightning-fast GC called the "Scavenger".
// - Stop-the-world pauses are incredibly short (< 1ms).

function processRequest(req) {
  // This temporary config object goes to the Young Generation.
  const tempConfig = {method: req.method, time: Date.now()};
  return handle(tempConfig);
  // When the function ends, `tempConfig` is orphaned.
  // The Scavenger deletes it almost instantly.
}

// 2. THE OLD GENERATION (The Vault)
// - Massive memory zone.
// - If an object survives two full Scavenger cycles in the Young Generation,
//   V8 assumes it is permanent data and "Promotes" it to the Old Generation.
// - Cleaned rarely by the heavy Mark-and-Sweep algorithm.

// Global caches and server configurations live here.
const globalServerCache = new Map(); // Survives forever -> Promoted to Old Generation.

// ==========================================
// PART III: ORINOCO & CONCURRENT MARKING
// ==========================================
// Even with Generational GC, cleaning the Old Generation used to freeze the server.
// Modern V8 uses the "Orinoco" project to fix this:

// 1. CONCURRENT MARKING: V8 offloads the "Marking" phase to background threads.
//    Your main JavaScript thread keeps running your code while background threads quietly trace the graph and map out what needs to be deleted.
// 2. PARALLEL SWEEPING: Multiple background threads sweep the memory simultaneously.

// RESULT: A full Garbage Collection that used to freeze a Node.js server for 500ms now barely interrupts the main thread for 10ms.
