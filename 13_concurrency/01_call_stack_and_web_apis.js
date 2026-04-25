// JavaScript is strictly Single-Threaded. It has exactly ONE Call Stack. If a function takes 5 seconds to run, the entire browser freezes for 5 seconds. You cannot click buttons, you cannot scroll, the system is dead.

// The V8 Engine offloads the heavy lifting to the Host Environment (the Browser or Node.js) and uses a bouncer called the Event Loop to manage the results.

// ==========================================
// PART I: THE SINGLE THREAD (Synchronous)
// ==========================================
// The Call Stack is a LIFO (Last In, First Out) memory structure.
// It executes line 1, pops it off, then executes line 2.
console.log("1. Synchronous Code Starts");
console.log("2. Synchronous Code Ends");

// ==========================================
// PART II: THE WEB APIs (The Engine's Assistants)
// ==========================================
// `setTimeout`, `fetch`, `document.getElementById`...
// NONE of these are actually JavaScript!
// They are written in C++ and live inside the Browser (or Node.js).
// When the V8 Engine sees them, it hands the job to the Browser and moves on instantly.

console.log("===== The 2-Second Delay");
console.log("A.  ExecutionBegins");

// The engine pushes this onto the Call Stack.
// It realizes it's a Web API. It hands the 2-second timer to the Browser.
// It INSTANTLY pops `setTimeout` off the stack without waiting.
setTimeout(() => {
  console.log("B. Timer Complete (From Web API)");
}, 2000);

// The engine immediately moves to the next line.
console.log("C. Execution Ends");

// OUTPUT: A, C, [2 seconds later] B.

// ==========================================
// PART III: THE EVENT LOOP & THE 0ms TRAP
// ==========================================
// What happens if we set the timer to ZERO milliseconds?

console.log("===== Scenario B: The 0ms Trap");
console.log("Alpha");

setTimeout(() => {
  console.log("Beta");
}, 0);

console.log("Gamma");

// OUTPUT: Alpha, Gamma, Beta.
// THE PHYSICS OF THE EVENT LOOP:
// 1. Web APIs CANNOT push code directly back onto the Call Stack. If they did, they would randomly interrupt your running code and crash the app.
// 2. Instead, when the 0ms timer finishes, the Browser places the `console.log("Beta")` callback into a waiting room called the **Task Queue** (or Callback Queue).
// 3. The **Event Loop** is a continuously running background process. It has ONE strict rule:
//    "I will ONLY move items from the Task Queue onto the Call Stack if the Call Stack is 100% EMPTY."
// 4. Because `console.log("Gamma")` is still on the stack, the Event Loop blocks "Beta" from entering. "Gamma" must execute and clear the stack first. THEN "Beta" is allowed in.

// ==========================================
// PART IV: BLOCKING THE EVENT LOOP (The Catastrophe)
// ==========================================
// If you write a massive synchronous calculation, the Call Stack never empties.
// If the Call Stack never empties, the Event Loop is blocked.
// If the Event Loop is blocked, NO timers, NO clicks, and NO network requests can finish!

console.log("UI Loading Spinner Starts...");

setTimeout(() => {
  console.log("Data Fetched! Stop Spinner.");
}, 100); // 100ms

// THE BLOCKER: A massive synchronous loop that takes 3 seconds to run.
for (let i = 0; i < 5_000_000_000; i++) {
  // The Call Stack is jammed.
}

// Even though the timer finished in 100ms, it is trapped in the Task Queue for 3 full seconds because the `for` loop is holding the Call Stack hostage.
// The user's screen is completely frozen.

// The Call Stack: Executes your JS code.
// The Web APIs: Handle the waiting (timers, networks, DOM).
// The Event Loop / Task Queue: Safely push the results back onto the Call Stack only when it is empty.

// In 2015, when ES6 introduced Promises, the TC39 committee realized that Promises were too important to wait in the standard Task Queue. So, they built a VIP Lounge for the Event Loop called the Microtask Queue.
