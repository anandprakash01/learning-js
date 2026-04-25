// You now know that the Garbage Collector (GC) is a ruthless cleaner. It deletes anything that is Unreachable. Therefore, a Memory Leak in JavaScript is not a bug in the engine—it is a logical error made by the developer.

// A Memory Leak happens when you accidentally keep a pointer attached to massive amounts of data that you no longer need. Because the pointer exists, the data remains Reachable. Because it is Reachable, the GC is forbidden from deleting it. Slowly, day by day, the Heap fills up until the server's RAM hits 100% and it explodes.

// ==========================================
// LEAK 1: THE UNBOUNDED GLOBAL CACHE
// ==========================================
// This is the #1 cause of Node.js server crashes.
// A developer creates a cache attached to the Global Root, but forgets to write logic to delete old entries. The cache grows infinitely.

const serverCache = {}; // Attached to Global Root

function processData(userId, massivePayload) {
  // LEAK: Every time a user connects, we add 5MB of data to the Root.
  // We never delete it. After 300 users, the server runs out of RAM and crashes.
  serverCache[userId] = massivePayload;
}

// ==========================================
// LEAK 2: THE ZOMBIE INTERVAL
// ==========================================
// Timers run in the background. If you forget to clear them, they keep the variables inside their Closures alive forever!

function startPolling() {
  const heavyDatabaseConnection = {status: "connected", data: new Array(1000000)};

  // We start an interval but forget to save the ID to clear it later!
  setInterval(() => {
    // LEAK: The V8 Engine cannot delete `heavyDatabaseConnection` because this interval function is still running and holding a pointer to it!
    console.log("Polling...", heavyDatabaseConnection.status);
  }, 1000);
}

// ==========================================
// LEAK 3: THE FORGOTTEN EVENT LISTENER
// ==========================================
// (Highly common in React and Frontend Apps)
// Event Emitters and DOM Listeners hold strong references to the functions attached to them.

const hugeComponentData = {id: "Dashboard", rows: 50000};

function updateUI() {
  console.log("Updating...", hugeComponentData.id);
}

// LEAK: We attached `updateUI` to the global window object.
// Even if the user navigates away from the Dashboard page, the Global Root is still holding a pointer to `updateUI`, which is holding a closure over `hugeComponentData`.
// window.addEventListener('resize', updateUI);

// ==========================================
// THE ARCHITECT'S FIX: WeakMap and WeakSet
// ==========================================
// ES6 introduced a brilliant data structure to solve caching leaks: The WeakMap.
// In a standard Map or Object, the keys hold "Strong" pointers to the data.
// In a WeakMap, the keys hold "Weak" pointers.

// A Weak pointer tells the Garbage Collector:
// "I am holding this data, but if nobody else in the application needs it, you have my permission to delete it anyway."

let activeUser = {name: "Anand"};

// We use a WeakMap to cache data for this user.
const userCache = new WeakMap();
userCache.set(activeUser, "Massive 50MB Dashboard Data");

console.log(userCache.has(activeUser)); // true

// Later, the user logs out. We delete the main pointer.
activeUser = null;

// MAGIC: Because `activeUser` is no longer Reachable from the main application, the WeakMap immediately drops its weak pointer.
// The 50MB of data is Orphaned, and the GC instantly deletes it!
// (Note: WeakMap keys MUST be Objects, not strings or numbers, so the GC can track them).
