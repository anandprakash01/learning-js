// Historically, JavaScript had no built-in module system. When Ryan Dahl created Node.js in 2009, he had to invent one from scratch so developers could build servers. He chose a standard called CommonJS.

// ==========================================
// PART I: THE NODE.JS SECRET (The IIFE Wrapper)
// ==========================================
// How does Node.js prevent variables in this file from leaking into other files?
// It uses the exact IIFE pattern.

// Before Node executes your code, the V8 Engine secretly wraps your ENTIRE file inside this hidden function:
/*
  (function(exports, require, module, __filename, __dirname) {
      // YOUR CODE GOES HERE
  });
*/
// Those five are the only ones magically provided by the module system. Anything else you use (like process, global, setTimeout, or console) comes from the overarching Global Object, not the module wrapper.

// PROOF: Because of that hidden wrapper, these variables magically exist without us ever declaring them!
console.log("Current File: ", __filename);
console.log("Current Directory: ", __dirname);

// ==========================================
// PART II: EXPORTING MEMORY (The `module` Object)
// ==========================================
// The hidden wrapper gives us access to a special `module` object.
// Anything we attach to `module.exports` becomes public. Everything else stays private.

// 1. PRIVATE MEMORY (Safe from the outside world)
const _dbPassword = "super_secret_51";

// 2. PUBLIC API
const connectToDB = () => {
  return `Connected using ${_dbPassword}`;
};

const queryUser = id => {
  return `User ${id} found.`;
};

// 3. THE EXPORT
// We overwrite the empty `module.exports` object with our own pointers.
module.exports = {
  connect: connectToDB, // Renaming it for the outside world
  queryUser,
};

// ==========================================
// PART III: IMPORTING MEMORY (The `require` Function)
// ==========================================
// `require` is not a language keyword; it is just a plain JavaScript function passed in by the hidden wrapper.

// When you call `require('path')`, it does exactly 3 things:
// 1. Synchronously reads the file from the hard drive.
// 2. Wraps it in the IIFE and executes it.
// 3. Returns whatever was attached to `module.exports`.

// require() (CommonJS) — No extension needed
// Node uses a module resolution algorithm.

// When you write: require("./utils/logger");
// Node tries in this order:
// 1. ./utils/logger.js
// 2. ./utils/logger.json
// 3. ./utils/logger.node (native addon)
// 4. ./utils/logger/index.js

// Internal behavior
// require("x")
//  ↓
// resolveFilename()
//  ↓
// try extensions in order
//  ↓
// cache result
//  ↓
// execute module wrapper

// Destructuring to pull exactly what we need out of the exported object.
// const {connect: connectDB} = require("./moduleExports_commonJS.js");
const {connect: connectDB} = require("./moduleExports_commonJS");
connectDB("");

// ==========================================
// PART IV: THE ENTERPRISE CACHING TRAP
// ==========================================
// This is a classic Senior Architect interview question.
// Does `require` execute the file every time you call it? NO.

// The FIRST time you `require` a file, Node executes it and CACHES the result in memory.
// If another file `requires` it again, Node skips execution and just hands back
// the exact same memory pointer from the cache.

// fileA.js
// const db = require('./database.js');
// db.status = "OFFLINE";

// fileB.js
// const db = require('./database.js');
// console.log(db.status); // Output: "OFFLINE"

// CATASTROPHE: Because Node cached the object pointer, File B just inherited the mutation caused by File A. CommonJS modules act as Singletons by default!

// This is what makes CommonJS both powerful and incredibly dangerous. Because both FileA and FileB are pointing to the exact same cached object in the Heap, they share state.
// Imagine module.exports is a house. require() doesn't build a new house for each file; it just gives every file the keys to the same house.

// What if different files require different functions?

// database.js
// module.exports = {
//     connect: () => console.log("Connecting"),
//     disconnect: () => console.log("Disconnecting")
// };

// What if FileA only requires connect, and FileB only requires disconnect? Does Node execute the file twice?
// No. It still only executes once.

// When FileA calls require('./database.js'), Node executes the file and caches the entire module.exports object in the Heap memory.

// When FileB calls require('./database.js'), Node says: "I already executed this file. Here is the pointer to the exact same object in the Heap." It doesn't matter if you use destructuring to only grab one specific function:
