// Destructuring is how we take things apart.
// Spread and Rest are how we put things together (and gather leftovers).

// Spread is an explosion. It rips a structure apart and scatters its contents.
// Rest is a vacuum. It sucks up leftover, loose elements and packs them into a single structure.
// ===============
console.log("=====SECTION A: SPREAD (The Exploder / Unpacker)");
// ===============
console.log("===== Allocation Mechanics (Shallow Copies)");
// ------------------------------------------
// When you use Spread (...) to copy an Object or Array, the V8 Engine creates a BRAND NEW memory block in the Heap for the top-level structure.
// HOWEVER, if it encounters a nested Object or Array, it DOES NOT copy the nested data.
// It simply copies the POINTER to that nested data. This is called a "Shallow Copy".
// Context: Used on the RIGHT side of an equals sign, or inside literals/function calls.
const originalSystem = {
  os: "Linux",
  network: {ip: "10.0.0.1"}, // Nested object in its own Heap space
};
// Spread unpacks the top level into a new Heap object.
const clonedSystem = {...originalSystem};

// Modifying the top level is 100% safe.
clonedSystem.os = "Ubuntu";

// Modifying the nested object triggers the Reference Trap!
clonedSystem.network.ip = "192.168.1.1";

// Accidentally mutated the original because `network` was only copied by reference.
console.log("Original System IP: ", originalSystem.network.ip); // "192.168.1.1"

console.log("===== Arrays (Copying, Concatenating, Inserting)");
// ------------------------------------------
const coreNodes = ["Alpha", "Beta"];
const edgeNodes = ["Gamma", "Delta"];

// Copying (Immutable replacement for .slice())
const safeNodesCopy = [...coreNodes];

// Concatenating (Immutable replacement for .concat())
const allNodes = [...coreNodes, ...edgeNodes];

// Mid-Array Insertion (Impossible with legacy .concat())
// Inserting (Immutable replacement for .splice())
// We unpack core, add a new string, then unpack edge.
const hybridNetwork = [...coreNodes, "Central_Hub", ...edgeNodes];
// ["Alpha", "Beta", "Central_Hub", "Gamma", "Delta"]
console.log("Hybrid Network: ", hybridNetwork); // ["Alpha", "Beta", "Central_Hub", "Gamma", "Delta"]

// String to Array Conversion (Replaces .split(""))
const charArray = [..."MERN"]; // ["M", "E", "R", "N"]
console.log("Character Array: ", charArray); // ["M", "E", "R", "N"]

console.log("===== Objects (Copying, Merging, Updating & Overwriting)");
// ------------------------------------------
const defaults = {theme: "light", retries: 3, timeout: 1000};
const userConfig = {theme: "dark", mfa: true};

// Merging and Overwriting State (The React/Redux Standard)
// RULE: The property declared LAST wins the overwrite.
const finalConfig = {
  ...defaults, // Unpack defaults first
  ...userConfig, // Unpack userConfig (overwrites 'theme' to "dark")
  timeout: 5000, // Hardcode a final overwrite
};
console.log("Final Config: ", finalConfig);
// { theme: 'dark', retries: 3, timeout: 5000, mfa: true }

console.log("===== Function Execution (Argument Expansion)");
// ------------------------------------------
const pingTimes = [45, 120, 32, 512];
// Legacy Way (Clunky): Math.max requires a list of numbers, not an array.
// const highestPing = Math.max.apply(null, pingTimes);

// Modern Way: Spread explodes the array into distinct, comma-separated arguments.
// Math.max(45, 120, 32, 512)
const highestPing = Math.max(...pingTimes);
console.log("Highest Ping: ", highestPing); // 512

// ===============
console.log("=====SECTION B: REST (The Vacuum / Gatherer)");
// ===============
console.log("===== Function Parameters (Gathering Unknowns)");
// ------------------------------------------
// Context: Used on the LEFT side of an equals sign, or inside function parameters.
// Replaces the legacy `arguments` object. It gathers any unbound arguments
// passed to the function into a brand new Array in the Heap.

// RULE: The Rest parameter MUST be the absolute LAST parameter in the function signature.
function logServerEvents(serverId, ...events) {
  console.log(`Server: ${serverId}`);
  console.log(`Events Array: `, events);
  // We can now use Array methods (.map, .filter) directly on 'events'.
}
// "S_99" maps to `serverId`. The rest are sucked into the `events` array.
logServerEvents("S_99", "STARTUP", "DB_CONNECT", "TRAFFIC_SPIKE");
// Output: Server: S_99
// Output: Events Array: ["STARTUP", "DB_CONNECT", "TRAFFIC_SPIKE"]

console.log("===== Array Destructuring (Gathering Leftovers)");
// ------------------------------------------
const nodeList = ["Node_A", "Node_B", "Node_C", "Node_D"];
// We can gather the "leftover" elements into a new array using Rest syntax.
const [primaryNode, secondaryNode, ...backupNodes] = nodeList;
console.log("Primary Node: ", primaryNode); // "Node_A"
console.log("Secondary Node: ", secondaryNode); // "Node_B"
console.log("Backup Nodes: ", backupNodes); // ["Node_C", "Node_D"]

console.log("===== Object Destructuring (The State Omission Pattern)");
// ------------------------------------------
// Used heavily in enterprise apps to remove sensitive data (like passwords) before sending a user object back to the client.
const authProfile = {
  id: 843,
  username: "anandprakash21",
  passwordHash: "x8f9a!p",
  lastLogin: "2026-04-20",
};

// We extract `passwordHash` (which isolates it).
// We use Rest to vacuum everything else into a new `safeProfile` object.
const {passwordHash, ...safeProfile} = authProfile;
console.log("Safe Profile (No Password): ", safeProfile);
// { id: 843, username: 'anandprakash21', lastLogin: '2026-04-20' }

// ==========================================
// THE DEEP COPY SOLUTION (structuredClone)
// ==========================================
// How do we completely sever all memory references, no matter how deep?
const complexSystem = {
  version: 1,
  config: {port: 8080}, // Nested Object (Lives at a different Heap pointer)
  userInfo: {
    name: {firstName: "Anand", lastName: "Prakash"},
    id: 21,
  },
};

// The Legacy Hack (Slow, destroys Dates and Functions):
const legacyDeepCopy = JSON.parse(JSON.stringify(complexSystem));

// The Modern Enterprise Standard (Introduced natively in modern JS):
// `structuredClone()` recursively traverses the entire object tree and physically allocates brand new memory for every single node.
const trueDeepCopy = structuredClone(complexSystem);

trueDeepCopy.config.port = 9000;
legacyDeepCopy.userInfo.name.lastName = "";

console.log("Original: ", complexSystem);
console.log("Legacy Deep Copy: ", legacyDeepCopy);
console.log("True Deep Copy: ", trueDeepCopy);
