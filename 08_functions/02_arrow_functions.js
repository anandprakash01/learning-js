// Arrow Functions (=>) were introduced in ES6 to provide a shorter, cleaner syntax for writing function expressions, specifically for callbacks.
// Arrow functions cannot have a name as part of their syntax like traditional function declarations. They are inherently anonymous.

console.log("===== SYNTAX VARIATIONS");
// ------------------------------------------
// A. Multi-Parameter (Standard)
// Requires parentheses around parameters and curly braces for the body.
const addNumbers = (a, b) => {
  return a + b;
};

// B. Single Parameter (Parentheses are Optional)
// The cleanest syntax for Array Callbacks (.map, .filter).
const double = num => {
  return num * 2;
};

// C. Zero Parameters
// You MUST use empty parentheses (or an underscore) to represent no arguments.
const ping = () => {
  return "PONG";
};

console.log("===== IMPLICIT RETURNS (The React Standard)");
// ------------------------------------------
// If the function only has ONE line of execution, you can drop the curly braces `{}` AND the `return` keyword. The engine implicitly returns whatever is on that line.

const multiply = (x, y) => x * y;
console.log("Implicit Return: ", multiply(5, 5)); // 25

// TRAP: Implicitly Returning an Object Literal
// If you do this: `x => { id: x }`, the engine thinks `{}` is the function body block!
// FIX: You must wrap the object literal in parentheses.
const createUser = id => ({id, role: "Guest"});
console.log("New User: ", createUser(99)); // { id: 99, role: "Guest" }

console.log("===== Lexical 'this' Binding (The Golden Feature)");
// ------------------------------------------
// Arrow Functions (=>) were introduced in ES6, and while many developers think they are just "shorter syntax" for writing functions.
// but they are fundamentally different at the V8 Engine level. They physically lack certain internal memory structures (like their own "this" binding and the arguments object) which makes them lighter, but also completely unsuitable for certain tasks like Object Constructors.

// Standard functions have a "Dynamic" `this`. The engine binds `this` to whoever CALLED it.
// Arrow functions have a "Lexical" `this`. The engine DOES NOT give them their own `this`.
// Instead, they permanently borrow `this` from the physical Scope where they were written.
const serverConfig = {
  port: 8080,

  // Standard Function: `this` dynamically binds to `serverConfig`.
  startLegacy: function () {
    console.log(`Legacy starting on ${this.port}`);
  },

  // Arrow Function: Looks OUTSIDE the object to the Global Window/Node scope.
  // Since the Global scope has no `port` variable, it fails.
  startModern: () => {
    console.log(`Modern starting on ${this.port}`);
  },
};
serverConfig.startLegacy(); // "Legacy starting on 8080"
serverConfig.startModern(); // "Modern starting on undefined" (DANGER!)

console.log("===== Missing `arguments` Object");
// ------------------------------------------
// To save memory, the V8 Engine DOES NOT inject the hidden `arguments` array-like object into Arrow Functions.
const logEvents = () => {
  // console.log(arguments); // CRASH: ReferenceError: arguments is not defined
};

// ENTERPRISE FIX: Use the Rest Operator (...) to gather unknown arguments.
const logEventsSafe = (...events) => {
  console.log("Safe Events: ", events); // Returns a true Array!
};
logEventsSafe("START", "ERROR"); // ["START", "ERROR"]

console.log("===== Constructor Trap (No `new` Keyword allowed)");
// ------------------------------------------
// Because Arrow Functions lack their own `this` and do not have a `prototype` property in memory, the engine physically forbids you from using them as Object Constructors.
const UserFactory = name => {
  this.name = name;
};

// const admin = new UserFactory("Anand"); // CRASH: TypeError: UserFactory

console.log("===== USE CASES");
// ------------------------------------------
// USE CASE 1: Array Methods (Arrow Functions ALWAYS win here)
const prices = [10, 20, 30];
const taxed = prices.map(price => price * 1.2);

// USE CASE 2: Object Methods (Classic Functions ALWAYS win here)
const cart = {
  total: 100,
  // We MUST use a classic function so `this` points to `cart`.
  getTax: function () {
    return this.total * 0.2;
  },
};
console.log("Cart Tax: ", cart.getTax()); // 20
