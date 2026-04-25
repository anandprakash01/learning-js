// ==========================================
// PART I: THE 3 PHASES OF MEMORY
// ==========================================
// Every single variable in JavaScript goes through exactly three phases:
// 1. ALLOCATION: The engine reserves physical RAM for the data.
// 2. USE: The engine reads or writes to that memory address.
// 3. RELEASE: The engine deletes the data and frees the RAM. (Garbage Collection)

// 1. Allocation (Implicit)
let user = {name: "Anand"}; // V8 secretly reserves ~40 bytes in the Heap.

// 2. Use
console.log(user.name); // V8 travels to the Heap address and reads the bytes.

// 3. Release
// How does V8 know when to release it? It uses the concept of "Reachability".

// ==========================================
// PART II: THE ROOTS OF THE ENGINE
// ==========================================
// To understand Reachability, you must know what a "Root" is.
// A Root is a memory pointer that is physically impossible to delete while the app is running.
//
// There are two primary Roots in JavaScript:
// 1. The Global Object (`window` in the browser, `global` in Node.js).
// 2. The currently executing function on the Call Stack (and its local variables).

// If V8 can draw a line from a Root to your data, your data is "Reachable".
// If data is Reachable, the Garbage Collector is FORBIDDEN from deleting it.

// ==========================================
// PART III: SEVERING THE CABLE (Orphaning Data)
// ==========================================

// 1. We allocate an Object in the Heap.
// The Global Scope (a Root) holds a variable `employee`, which points to the Object.
// REACHABLE: YES.
let employee = {id: 991, role: "Architect"};

// 2. We sever the cable.
// We change the `employee` pointer to null.
employee = null;

// The Object `{ id: 991, role: "Architect" }` still physically exists in the Heap!
// But because there are no longer any lines connecting it to a Root, it is "Unreachable".
// The data has been Orphaned. The Garbage Collector will destroy it on its next pass.

// ==========================================
// PART IV: INTERCONNECTED OBJECTS (The Island of Isolation)
// ==========================================
// What happens if two objects point to EACH OTHER, but neither connects to a Root?

function marry(man, woman) {
  man.wife = woman;
  woman.husband = man;
  return {father: man, mother: woman};
}

// 1. We create an interconnected family.
// The Root (`family`) points to the main object, which points to John and Jane.
let family = marry({name: "John"}, {name: "Jane"});

// 2. We delete the links to John.
delete family.father;
delete family.mother.husband;

// At this exact moment, John is completely unreachable from the `family` Root.
// Even though John might still have data inside his object, he has been Orphaned.
// The Garbage Collector deletes John.

// 3. The Island of Isolation
family = null;

// Now, the entire `{ father, mother }` object, plus Jane, are orphaned.
// Jane might still point to things internally, but because the master cable connecting the Family to the Global Root was severed, the ENTIRE island is deleted.
