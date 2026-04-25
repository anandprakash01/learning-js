// If OOP was about building stateful, rigid blueprints to encapsulate memory, Functional Programming (FP) is the exact opposite. FP treats your code like a plumbing system: data flows through a series of pure, mathematical pipes. It is never mutated, it never shares state, and it never alters the outside world.
// This paradigm is the absolute backbone of modern React (Hooks) and Enterprise State Management (Redux, Zustand).

// ==========================================
// PART I: THE DEFINITION OF PURITY
// ==========================================
// A function is ONLY considered "Pure" if it passes two strict, mathematical laws:
// 1. DETERMINISM: Given the exact same input, it must ALWAYS return the exact same output.
// 2. NO SIDE EFFECTS: It must not read from, or write to, any memory outside of its own Scope.

console.log("===== The Law of Determinism");
// ------------------------------------------
// IMPURE: Relies on an external variable.
// If `taxRate` changes while the program is running, the output changes, even if we pass the same `price`!
let taxRate = 0.2;
const calculateImpureTax = price => price + price * taxRate;

// PURE: All data required for execution is passed in as arguments.
// `calculatePureTax(100, 0.20)` will return 120 today, tomorrow, and until the end of time.
const calculatePureTax = (price, rate) => price + price * rate;

// ------------------------------------------
// Relying on native APIs that change over time instantly makes your function Impure.

// IMPURE: Depends on the machine's clock or a random number generator.
const generateUserId = name => `${name}_${Date.now()}`;
const rollDice = () => Math.random() * 6;

// ==========================================
// PART II: THE LAW OF SIDE EFFECTS
// ==========================================
// A "Side Effect" is any action that alters the state of the system outside the function's local execution context.

console.log("===== The Mutation Side Effect");
// ------------------------------------------
const globalCart = ["Laptop", "Mouse"];
// IMPURE: Mutates the global Heap memory.
// If another part of the app is reading `globalCart`, we just corrupted their data.

const addToCartImpure = item => {
  globalCart.push(item);
  return true;
};

// PURE: Never touches external memory.
// It takes the current state, creates a completely new Array in memory, and returns it.
const addToCartPure = (cartArray, newItem) => {
  return [...cartArray, newItem];
};

// ===== Other Common Side Effects
// ------------------------------------------
// In strict Functional Programming, doing ANY of the following makes a function Impure:
// - Mutating the DOM (`document.getElementById('title').innerText = "Hi";`)
// - Making an HTTP Request (`fetch('/api/users')`)
// - Using `console.log()` (because it outputs to the system terminal!)

// ==========================================
// PART III: ENTERPRISE REFACTORING
// ==========================================
// How do we fix an impure function and make it mathematically safe?

// THE PROBLEM: An impure function mutating an Object in the Heap.
let currentUser = {name: "Anand", status: "Offline"};

const loginUserImpure = () => {
  // 1. Reads from global scope (Impure)
  // 2. Mutates global heap memory (Side Effect)
  currentUser.status = "Online";
  // 3. Modifies the System / Browser (Side Effect)
  // localStorage.setItem("user", currentUser.name);
};

// THE REFACTOR: Isolating the Purity
// Enterprise applications cannot avoid Side Effects entirely (you HAVE to update the UI and DB).
// But we isolate the PURE logic from the IMPURE execution.

// 1. The Pure Logic (Safe, Testable, Deterministic)
const setOnlineStatus = userObj => {
  // Return a brand new object. Do not touch the original.
  return {...userObj, status: "Online"};
};

// 2. The "Impure Shell" (Handles the messy outside world)
const handleLoginAction = userObj => {
  // Run the pure pipeline
  const updatedUser = setOnlineStatus(userObj);

  // Execute the unavoidable side effects
  // localStorage.setItem("user", updatedUser.name);
  console.log("System Status Updated.");

  return updatedUser;
};

// Execution:
const newUserState = handleLoginAction(currentUser);
console.log("Original untouched:", currentUser.status); // "Offline"
console.log("New State generated:", newUserState.status); // "Online"
