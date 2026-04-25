// ==========================================
// PART I: THE REACT PHYSICS (Reference Equality)
// ==========================================
// Why do modern frameworks demand Immutability? Because of how they check for changes.
// React DOES NOT look deep inside your object to see if a string changed.
// It only looks at the Hexadecimal Memory Pointer.

const state = {user: "Anand", loggedIn: false};

// ❌ THE MUTATION TRAP
const mutateState = currentState => {
  currentState.loggedIn = true;
  return currentState;
};

const newState1 = mutateState(state);

// The V8 Engine compares the POINTERS, not the data!
// Because we mutated the original, the pointers are identical.
// React sees `true` and says: "The pointers match. Nothing changed. DO NOT RE-RENDER."
console.log("Did state change? ", state === newState1); // true (React fails)

// ✅ THE IMMUTABLE FIX
const updateStatePure = currentState => {
  // We create a completely new `{}` in Heap memory.
  return {...currentState, loggedIn: true};
};

const newState2 = updateStatePure(state);

// The pointers are different! React says: "New memory detected. TRIGGER RE-RENDER."
console.log("Did state change? ", state === newState2); // false (React succeeds)

// ==========================================
// PART II: Arrays
// ==========================================
// How to perform common array operations WITHOUT mutating the original pointer.

const rawData = [10, 20, 30];

// 1. ADDING ITEMS
// ❌ Bad: `rawData.push(40)` (Returns length, mutates Heap)
// ✅ Good: Spread Operator (Returns new Array)
const appendedData = [...rawData, 40];
const prependedData = [0, ...rawData];

// 2. REMOVING ITEMS
// ❌ Bad: `rawData.splice(1, 1)` (Mutates Heap)
// ✅ Good: `.filter()` (Returns new Array)
// Goal: Remove the number 20
const filteredData = rawData.filter(num => num !== 20);

// 3. UPDATING ITEMS
// ❌ Bad: `rawData[1] = 99` (Mutates Heap)
// ✅ Good: `.map()` (Returns new Array)
// Goal: Change 20 to 99
const updatedData = rawData.map(num => (num === 20 ? 99 : num));

// ==========================================
// PART III: Objects
// ==========================================

const profile = {id: 1, role: "Dev", active: true};

// 1. UPDATING PROPERTIES
// ❌ Bad: `profile.active = false`
// ✅ Good: Spread Operator (Overwrite happens right-to-left)
const inactiveProfile = {...profile, active: false};

// 2. REMOVING PROPERTIES (The Rest Pattern)
// ❌ Bad: `delete profile.role` (De-optimizes the V8 Engine TurboFan!)
// ✅ Good: Object Destructuring with Rest
// We pull `role` out, and gather the REST of the properties into a new object called `safeProfile`.
const {role, ...safeProfile} = profile;
console.log(safeProfile); // { id: 1, active: true }

// ==========================================
// PART IV: THE SHALLOW COPY TRAP (CRITICAL)
// ==========================================
// The Spread Operator (`...`) only creates a "Shallow Copy".
// It creates a new pointer for the FIRST level of the object, but if there are
// nested objects/arrays inside, it just copies their OLD memory pointers!

const complexSystem = {
  version: 1,
  config: {port: 8080}, // Nested Object (Lives at a different Heap pointer)
};

const systemCopy = {...complexSystem};

// We mutate the nested object on the COPY...
systemCopy.config.port = 443;

// CATASTROPHE: It mutated the ORIGINAL object too!
console.log("Original Port: ", complexSystem.config.port); // 443
// Why? Because `...` only copied the pointer to `config`, not the data inside it.

// ==========================================
// PART V: THE DEEP COPY SOLUTION (structuredClone)
// ==========================================
// How do we completely sever all memory references, no matter how deep?

// The Legacy Hack (Slow, destroys Dates and Functions):
const legacyDeepCopy = JSON.parse(JSON.stringify(complexSystem));

// The Modern Enterprise Standard (Introduced natively in modern JS):
// `structuredClone()` recursively traverses the entire object tree and physically
// allocates brand new memory for every single node.
const trueDeepCopy = structuredClone(complexSystem);

trueDeepCopy.config.port = 9000;

console.log("Original: ", complexSystem.config.port); // 443 (Safe!)
console.log("Deep Copy: ", trueDeepCopy.config.port); // 9000
