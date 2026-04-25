// JavaScript is a synchronous, single-threaded language. This means it has exactly one Call Stack and can only execute one command at a time. It cannot multitask.

// To manage this single thread, the engine uses Execution Contexts. Think of an Execution Context as a secure box where a piece of code runs.

// There are exactly two types of boxes:

// Global Execution Context (GEC): The master box. Created the millisecond your file runs. It holds all your global variables and the global window (or global in Node.js) object. It sits at the very bottom of the Call Stack. It is never destroyed until the application shuts down.

// Function Execution Context (FEC): Every single time a function is invoked (called), the engine halts the current operation, creates a brand new FEC box, and stacks it on top of the GEC.

// The LIFO Rule (Last In, First Out):
// The Call Stack operates strictly top-down. The engine can only execute the box at the very top of the stack. When that function hits a return statement (or the closing brace }), its box is violently destroyed (popped off the stack), and the engine resumes whatever was in the box immediately below it.

// If a function keeps calling itself without stopping, the stack piles up until it runs out of RAM, resulting in the infamous Stack Overflow fatal crash.

console.log("===== The Global Context");
// ------------------------------------------
// The engine starts here. The GEC is created and pushed to the bottom of the stack.
const environment = "Production";
console.log(`[GEC] Initializing ${environment} environment...`);

console.log("===== The Function Contexts");
// ------------------------------------------
function authenticateUser(user) {
  console.log(`  [FEC 3] Authenticating ${user}...`);
  // When this finishes, FEC 3 is destroyed.
  return true;
}
function fetchUserData(user) {
  console.log(` [FEC 2] Fetching data for ${user}...`);

  // THE HALT: The engine stops executing fetchUserData and pushes authenticateUser to the top of the stack.
  const isAuthenticated = authenticateUser(user);

  if (isAuthenticated) {
    console.log(` [FEC 2] Data retrieved successfully.`);
  }
  // When this finishes, FEC 2 is destroyed.
}
function initializeDashboard() {
  console.log("[FEC 1] Starting Dashboard Boot Sequence...");

  // THE HALT: The engine stops executing initializeDashboard and pushes fetchUserData to the top of the stack.
  fetchUserData("Admin_Anand");

  console.log("[FEC 1] Dashboard Boot Complete.");
  // When this finishes, FEC 1 is destroyed.
}

console.log("===== The Invocation (Triggering the Stack)");
// ------------------------------------------
// Up until this line, nothing but the GEC has run.
// This single invocation triggers the entire stack buildup.
initializeDashboard();

console.log("[GEC] System Idle.");
