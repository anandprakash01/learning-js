// The V8 Engine actually makes two complete passes over your code:

// The Creation Phase (Memory Allocation): The engine scans the file, finds every variable and function declaration, and allocates memory for them before executing a single line of logic. This process is called Hoisting.

// The Execution Phase: The engine runs the code top-to-bottom, assigning values and executing functions.

// The Legacy var Disaster:
// Before ES6, we used var. During the Creation Phase, the engine hoists var and explicitly assigns it the value undefined. This means you can mathematically ask for a variable before you write it, and instead of crashing, the engine gives you undefined. This caused billions of dollars in enterprise software bugs.

// The Enterprise Standard (TDZ):
// When ES6 introduced let and const, it fixed this bug by creating the Temporal Dead Zone (TDZ). let and const are hoisted to the top of memory, but they remain strictly uninitialized and will be in different memory space and we can not access these before initialization. If you try to touch them before the Execution Phase reaches their exact line, the engine throws a fatal ReferenceError.

console.log("===== The Legacy `var` (Banned)");
// ------------------------------------------
// It assigns it `undefined`. It does NOT crash. It fails silently.
console.log("Legacy Hoisting: " + legacyConfig); // Outputs: "undefined"
var legacyConfig = "Database_Connected";
console.log("Post-Assignment: " + legacyConfig); // Outputs: "Database_Connected"

console.log("===== The Temporal Dead Zone (TDZ)");
// ------------------------------------------
// The engine sees `let secureConfig`. It allocates memory, but flags it as UNINITIALIZED.
// The area above the declaration is the Temporal Dead Zone.
// console.log("Modern Hoisting: " + secureConfig); // ReferenceError: Cannot access before initialization
let secureConfig = "API_Key_Loaded";
// We are now out of the TDZ. The variable is safe to use.
console.log("Secure Hoisting: " + secureConfig);

console.log("===== Function Hoisting (The Exception)");
// ------------------------------------------
// Standard Function Declarations are fully hoisted. Both the name AND the internal logic are saved into memory during the Creation Phase.
// This allows to execute a function at the top of a file, even if it's written at the bottom.
const initResult = initializeSystem();
console.log("System Status: " + initResult); // Outputs: "System Online"

function initializeSystem() {
  return "System Online";
}

console.log("===== Arrow Functions & Expressions (The Trap)");
// ------------------------------------------
// Arrow functions are usually assigned to `const` or `let`.
// Therefore, they obey the exact same Temporal Dead Zone rules as variables.
// They CANNOT be executed before they are defined.

// connectToDatabase(); // ReferenceError: Cannot access before initialization
const connectToDatabase = () => {
  return "Connected to cluster";
};

connectToDatabase();

console.log("===== how the engine physically allocates this memory");
// ------------------------------------------
// When the V8 Engine runs your JavaScript file, it creates a master wrapper called the Global Execution Context (GEC). This context is built in two distinct physical phases.
// Phase 1: The Creation Phase (Memory Allocation)
// Before a single line of code runs, the engine's parser scans the entire file. It creates a memory table (the Environment Record).

// When it sees var, it physically allocates a slot on the Call Stack and shoves the primitive value undefined into it.

// When it sees let or const, it allocates a slot on the Stack, but tags it with a special internal state: <uninitialized>. This tag is what creates the Temporal Dead Zone.

// When it sees a function, it creates the function logic in the Heap, and places a memory pointer in the Stack.
// Phase 2: The Execution Phase (Thread of Execution)
// The engine returns to line 1 and begins running the code.

// If it tries to read a variable and sees the <uninitialized> tag, it instantly panics and throws a ReferenceError.

// If it sees an assignment (=), it overwrites the undefined or <uninitialized> tag with the actual data.
