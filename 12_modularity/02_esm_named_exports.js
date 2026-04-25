// CommonJS was a brilliant hack by the creator of Node.js, but it had a fatal flaw: it was Synchronous. It blocked the main thread to read files from the hard drive. This was fine for a server, but absolutely catastrophic for a Web Browser.

// In 2015, the TC39 committee officially added a native, asynchronous module system directly into the JavaScript language specification: ES Modules (ESM). This is the import and export syntax you use in React, Angular, and modern Node.js.

// It does not use the hidden IIFE wrapper. It uses an entirely different, highly optimized engine architecture called Static Analysis.

// The V8 Engine never executes a file twice. The import statement does not mean "Go execute this file right now."
// In ES Modules, an import statement means: "Check the Module Map. Give me a live wire to the memory slots inside that file, regardless of whether that file has finished running yet." This is exactly why ES Modules are incredibly fast, but also why they demand strict architectural discipline to avoid Temporal Dead Zone crashes.

// ==========================================
// PART I: THE EXPORT PHYSICS
// ==========================================
// Unlike CommonJS (which builds a `module.exports` object at runtime), ESM explicitly flags specific memory pointers as "Public" during the Parsing Phase.

// 1. PRIVATE MEMORY (Invisible to other files)
const databaseUrl = "mongodb://cluster0.production.net";

// 2. NAMED EXPORTS (The Public API)
// We use the `export` keyword directly in front of the declaration.
export const maxConnections = 100;

export function connect() {
  return `Connecting to ${databaseUrl}...`;
}

// You can also export an existing variable at the bottom of the file:
const version = "v2.4.1";
export {version};

// ==========================================
// PART II: THE IMPORT PHYSICS
// ==========================================

// We use the `import` keyword to reach into the module and grab the exact pointers we need.

// We MUST use the exact same variable names. This is not destructuring;
// it is a Static Binding.
import {connect_module, maxConnections_module} from "./moduleExports_ESM.js";

console.log(connect_module());
console.log(maxConnections_module); // 500

// ==========================================
// PART III: THE "LIVE BINDING" DIFFERENCE (CRITICAL)
// ==========================================
// This is the most profound difference between CommonJS and ESM.
// CommonJS passes back a mutable Object. ESM passes back an IMMUTABLE LIVE VIEW.

// fileA.js
export let systemStatus = "ONLINE";

export function crashSystem() {
  systemStatus = "OFFLINE";
}

// fileB.js

import {systemStatus_module, crashSystem_module} from "./moduleExports_ESM.js";

console.log(systemStatus_module); // "ONLINE"

// ❌ THE ERROR: You CANNOT mutate an imported variable in ESM!
// systemStatus_module = "MAINTENANCE"; // TypeError: Assignment to constant variable.

// ✅ THE LIVE BINDING: But if the original file changes it, your view updates automatically!
crashSystem_module();
console.log(systemStatus_module); // "OFFLINE"

// ==========================================
// PART IV: ALIASING (Avoiding Naming Collisions)
// ==========================================
// In a massive application, two different files might export a function named `connect`.
// We fix this using the `as` keyword during the import to rename the pointer locally.

import {
  systemStatus_module as moduleSystem,
  crashSystem_module as moduleCrash,
} from "./moduleExports_ESM.js";

moduleCrash();
console.log(moduleSystem);

// Why did the TC39 committee invent this?

// Because of a compiler optimization called Tree Shaking.

// In CommonJS, require() is dynamic. You can put it inside an if statement
// if (userIsAdmin) { const adminTools = require('./admin.js'); }

// Because of this, the Webpack/Vite bundler has no idea if you actually need admin.js until the code is actively running. It is forced to send the entire file to the user's browser, bloating the payload.

// ES Modules are Static. The engine forces you to put all import statements at the absolute top of the file. You cannot put an import inside an if statement.
// Because the imports are locked at the top, Webpack can scan your entire application before it runs, instantly detect which functions you never imported, and permanently delete them from the final production bundle. This is how React applications stay lightning-fast.

// When Node.js runs ES Modules, it doesn't execute files line-by-line immediately. It does a 3-Phase Boot-Up:

// Parse: It reads all files and maps out the import and export links.

// Link: It hoists (lifts) all function declarations to the top of memory so they can be accessed anywhere. However, const and let variables are placed into the Temporal Dead Zone (TDZ). They physically exist in memory, but the engine locks them until it executes the exact line of code where they are assigned a value.

// Evaluate: It actually runs the code top-to-bottom.

// =======================================
// The Circular Dependency
// =======================================
// If File A imports File B, and File B imports File A, and the engine executed them every time it saw an import statement, it would trigger an Infinite Loop. The Call Stack would overflow in milliseconds.
// the V8 Engine completely avoids the Infinite Loop using a hidden memory vault called the Module Map.
// The Module Map
// When Node.js boots up, it creates a master registry in the background called the Module Map. This map tracks the exact state of every single file in your application.

// Here is the exact frame-by-frame execution of what happens when it hits that circular import:

// 1. The Parsing Phase (Before any code runs)
// ----------
// The engine scans "File A". It sees an export for "something". It creates a memory slot for it, but leaves it uninitialized (TDZ).
// It registers "File A" in the Module Map with a status of: [Status: Parsing].

// 2. The Execution Phase Begins
// ----------
// The engine begins running "File A" top-to-bottom. It instantly updates the Module Map: [Status: Evaluating].
// On line 1, it hits: import { ... } from "File B".
// The engine pauses "File A".

// 3. The Jump
// ----------
// The engine jumps to "File B" and updates the Module Map: [Status: Evaluating].
// On line 1 of this file, it hits: import { "something" } from "File A".

// 4. The Infinite Loop Prevention (The Genius Move)
// ----------
// The engine looks at the import statement, and before doing anything, it checks the Module Map.
// It sees that "File A" is already marked as [Status: Evaluating].
// The engine says: "I am not going to execute that file again. I will just wire up a Live Memory Pointer directly to the "That something" slot, and keep moving forward."

// 5. The Catastrophe
// ----------
// The engine successfully skipped the infinite loop. It continues down "File B"
// It hits line 3: console.log(connect_module());
// It follows the Live Memory Pointer back to "File A" to run the function.
// Inside the function, it asks for "something".
// But remember step 2? We paused "File A" at line 1! It never reached the line where "something" gets initialized.
// CRASH: ReferenceError: Cannot access 'something' before initialization.
