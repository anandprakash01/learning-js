// Web APIs push their callbacks into the **Task Queue** (or Callback Queue), and the Event Loop waits for the Call Stack to empty before letting them run.

// But in 2015, the JavaScript architects realized there was a problem. If a developer uses a Promise to fetch critical database information, should that Promise have to wait in the exact same line as a low-priority setTimeout that just updates a clock on the UI?
// They built a VIP Lounge for the Event Loop called the Microtask Queue. It has absolute, undisputed priority over the standard Task Queue (which is now properly called the Macrotask Queue).

// ==========================================
// PART I: THE TWO QUEUES
// ==========================================
// The Engine actually has TWO waiting rooms for asynchronous code:
//
// 1. MACROTASK QUEUE (Task Queue or Callback Queue)) - The Standard Line:
//    - setTimeout, setInterval, setImmediate (Node)
//    - UI Rendering, DOM Events (Clicks, typing)
//
// 2. MICROTASK QUEUE - The VIP Line:
//    - Promises (.then, .catch, .finally)
//    - queueMicrotask()
//    - MutationObserver (Browser)

// THE GOLDEN RULE OF THE EVENT LOOP:
// Before the Event Loop moves a single item from the Macrotask Queue onto the Call Stack,
// it MUST completely empty the entire Microtask Queue.

// ==========================================
// PART II: THE ULTIMATE PRIORITY TEST
// ==========================================

// What is the exact execution order of these 5 `console.log` statements?

console.log("1. SYNCHRONOUS: Execution Starts"); // (Call Stack)

// A standard timer (Goes to the Macrotask Queue)
setTimeout(() => {
  console.log("2. MACROTASK: setTimeout finished");
}, 0);

// A Promise (Goes to the Microtask VIP Queue)
Promise.resolve().then(() => {
  console.log("3. MICROTASK: Promise resolved");
});

// Another Microtask
queueMicrotask(() => {
  console.log("4. MICROTASK: Manual queueMicrotask finished");
});

console.log("5. SYNCHRONOUS: Execution Ends"); // (Call Stack)

// THE V8 ENGINE TRACE:
// 1. Synchronous code runs first. -> Output: "1", "5"
// 2. The Call Stack is now empty.
// 3. Event Loop checks the VIP Microtask Queue. It finds the Promise and queueMicrotask.
//    It executes them in the order they arrived. -> Output: "3", "4"
// 4. The Microtask Queue is now empty.
// 5. The Event Loop finally checks the Macrotask Queue and finds the timer. -> Output: "2"

// FINAL OUTPUT ORDER: 1, 5, 3, 4, 2.

// ==========================================
// PART III: THE "MICROTASK STARVATION" TRAP
// ==========================================
// Because the Event Loop refuses to touch Macrotasks until the Microtask Queue is empty, you can accidentally freeze the entire application using Promises!

const starveTheEventLoop = () => {
  console.log("Starting Starvation...");

  // We schedule a Macrotask (Let's pretend this is a crucial UI update)
  setTimeout(() => {
    console.log("[UI UPDATE]: The screen finally repainted!");
  }, 0);

  // We create a recursive Microtask loop.
  // Every time it runs, it pushes ANOTHER Microtask into the VIP queue.
  const recursivePromise = count => {
    if (count === 1000) return;
    Promise.resolve().then(() => recursivePromise(count + 1));
  };

  recursivePromise(0);
  console.log("Microtasks queued...");
};
starveTheEventLoop();
// If we ran `starveTheEventLoop()`, the engine would process 1,000 Promises BEFORE it ever allowed the `setTimeout` to run.
// If that loop was infinite, the Macrotask queue would be "starved" forever, and the user's browser would completely lock up!

// ==========================================
// PART IV: ARCHITECTURAL USE CASE
// ==========================================
// When do Senior Engineers manually use `queueMicrotask`?
// When you have a function that is *sometimes* synchronous and *sometimes* asynchronous.
// You use `queueMicrotask` to force it to ALWAYS be asynchronous, ensuring predictable execution order.

let cache = {user: "Anand"};

const fetchUser = (userId, callback) => {
  if (cache[userId]) {
    // DANGER: If the data is cached, this callback fires synchronously!
    // callback(cache[userId]);

    // FIX: We force the cached response to act like an asynchronous Promise.
    queueMicrotask(() => callback(cache[userId]));
  } else {
    // If not cached, it goes to the network (Asynchronous)
    setTimeout(() => callback("Fetched User"), 100);
  }
};
