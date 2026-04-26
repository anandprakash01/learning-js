// ==========================================
// PART I: THE DEFAULT EXPORT PHYSICS
// ==========================================
// commonJS does not have “default export”
// Every ES Module is allowed to have EXACTLY ONE "Default" export.
// It signals to the engine: "This is the primary payload of this file."

// You simply add the `default` keyword.
export default class DatabaseService {
  connect() {
    return "Connected via Default Export";
  }
}

// Note: You can also define something first, and export it as default at the bottom:
// const config = { port: 8080 };
// export default config;

// ==========================================
// PART II: IMPORTING THE DEFAULT (No Curly Braces)
// ==========================================
// Because there is only ONE default export per file, the V8 Engine doesn't care what you name it when you import it. You make up the name on the spot.
/*
    // server.js
    
    // Notice: No { } curly braces!
    import DbService from './03_esm_default_exports.js';
    
    // The engine allows this too, because it knows exactly what the default is:
    // import AnythingIWant from './03_esm_default_exports.js';
    
    const db = new DbService();
    console.log(db.connect()); // "Connected via Default Export"
*/
// ==========================================
// PART III: MIXING DEFAULT AND NAMED EXPORTS
// ==========================================
// A single file can have ONE default export, and INFINITE named exports.
// This is heavily used in React (exporting the Component as default, and types/utilities as named).

export const MAX_RETRIES = 3;
export function pingNetwork() {
  return "Pong";
}

/*
    // server.js
    
    // You can import both in the exact same line:
    // The default goes OUTSIDE the braces, the named go INSIDE.
    import DbService, { MAX_RETRIES, pingNetwork } from './03_esm_default_exports.js';
*/

// ==========================================
// PART IV: THE ENTERPRISE DEBATE (Why some ban `default`)
// ==========================================
// If default exports are so easy, why do many Senior Architects ban them?
//
// 1. NAMING INCONSISTENCY (The Unsearchable Codebase)
// Developer A writes: `import UserSettings from './userConfig.js'`
// Developer B writes: `import ProfileOptions from './userConfig.js'`
// They are using the exact same object, but calling it different things.
// When you try to globally search the codebase for where the config is used, it's impossible.
//
// 2. REFACTORING NIGHTMARES
// If you rename a Named Export, your IDE (like VS Code) automatically finds every file that imports it and updates the name.
// If you rename a Default Export's source file, your IDE cannot help you, because every file made up its own local name for it. The static link is broken.

// THE RULE OF THUMB:
// - Use Default Exports ONLY for UI Components (React pages, Vue components).
// - Use Named Exports for EVERYTHING else (Utils, Configs, Hooks, Services).
