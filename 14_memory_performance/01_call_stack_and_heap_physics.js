// ==========================================
// PART I: THE TWO MEMORY REALMS
// ==========================================
// When the V8 Engine boots up, it allocates physical RAM into two strictly divided zones:
//
// 1. THE CALL STACK (Fast, Tiny, Orderly)
//    - Used for: Execution Contexts (running functions) and Primitive Values.
//    - Physics: A rigid LIFO (Last-In, First-Out) data structure.
//    - Size limitation: Very small (usually around 1MB to 8MB).
//
// 2. THE MEMORY HEAP (Slow, Massive, Chaotic)
//    - Used for: Reference Types (Objects, Arrays, Functions).
//    - Physics: A massive, unorganized pool of memory.
//    - Size limitation: Bound by the physical RAM of the computer (up to gigabytes).

// ==========================================
// PART II: PRIMITIVES ON THE STACK
// ==========================================
// Primitives (Strings, Numbers, Booleans) have a fixed size.
// The engine places them directly onto the Call Stack.

let userName = "Anand"; // Stack allocates exactly enough bytes for this string.
let userAge = 30; // Stack allocates exactly 8 bytes (64-bit float).

// When we copy a primitive, the Stack physically duplicates the data into a new slot.
let backupName = userName;
backupName = "Prakash";

console.log(userName); // "Anand" (Untouched)
console.log(backupName); // "Prakash" (Completely separate memory)

// ==========================================
// PART III: OBJECTS ON THE HEAP
// ==========================================
// Objects and Arrays can grow dynamically. They are too dangerous to put on the Stack.
// The engine puts the actual data in the HEAP, and puts a POINTER (memory address) on the STACK.

const config = {
  theme: "dark",
  retries: 3,
};
// HEAP: { theme: "dark", retries: 3 } (Address: 0x99AB2)
// STACK: config -> 0x99AB2

// THE ENTERPRISE MUTATION TRAP
// When we copy an object, we do NOT copy the data. We only copy the Pointer!
const newConfig = config;

// We follow `newConfig`'s pointer to 0x99AB2 and mutate it.
newConfig.theme = "light";

// Because `config` points to the exact same Heap address, it is also mutated!
console.log(config.theme); // "light"

// ==========================================
// PART IV: WHY `const` TRICKS JUNIOR DEVELOPERS
// ==========================================
// This is the ultimate proof of Stack vs Heap physics.
// Why can we push items into an array declared with `const`?

const databaseConnections = ["mongo_1"];

// We mutate the array. Why doesn't the engine crash?
databaseConnections.push("redis_1");

console.log(databaseConnections); // [ 'mongo_1', 'redis_1' ]

// THE PHYSICS:
// `const` does NOT freeze the data in the Heap.
// `const` strictly freezes the POINTER on the Call Stack.
// As long as we don't try to point `databaseConnections` to a brand new Heap address, the engine allows us to mutate the data sitting at the existing address all day long!

// This will crash (Trying to overwrite the Stack pointer):
// databaseConnections = ["mysql_1"]; // TypeError: Assignment to constant variable.
