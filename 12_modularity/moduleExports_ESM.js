// When Node.js loads a file, the V8 Engine must make a binary decision before it even begins the Parsing Phase: "Is this file CommonJS, or is it ESM?" It cannot be both.

// If it decides the file is CommonJS: It wraps it in the hidden IIFE, giving you require and module. But the moment it sees the import or export keywords, it throws a SyntaxError because those keywords are illegal in CommonJS.

// If it decides the file is ESM: It uses Static Analysis. The import and export keywords work beautifully, but the hidden IIFE is never injected. The moment you type require or module.exports, it throws a ReferenceError.

// // ESM(import/export)
// 1. PRIVATE MEMORY (Invisible to other files)
const databaseUrl = "mongodb://cluster0.production.net";

// 2. NAMED EXPORTS (The Public API)
// We use the `export` keyword directly in front of the declaration.
export const maxConnections_module = 500;

export function connect_module() {
  return `Connecting to ${databaseUrl}...`;
}

export let systemStatus_module = "ONLINE";

export function crashSystem_module() {
  systemStatus_module = "OFFLINE";
}
