// In legacy languages, a function is just a block of instructions. In JavaScript, a Function is a "First-Class Citizen." This means it is physically treated as an Object in Heap memory. You can pass it around, store it in arrays, and assign it to variables.

// Before the V8 Engine executes line 1 of your code, it performs a "Memory Creation Phase".
// It scans the file and sets up memory pointers. How it handles functions during this phase depends entirely on the syntax you use.

console.log("===== Hoisting Engine (Declarations)");
// ------------------------------------------
// When V8 sees the `function` keyword as the first word on a line, it is a Declaration.
// The engine physically allocates the entire function block into Heap memory and creates a pointer on the Call Stack BEFORE the code ever runs.

// Because of this, you can invoke the function before it is written.
bootLegacySystem(); // Output: "Legacy System Booting..."

function bootLegacySystem() {
  console.log("Legacy System Booting...");
}

console.log("===== Temporal Dead Zone (Expressions)");
// ------------------------------------------
// When you assign a function to a variable, it is an Expression.
// V8 allocates the `const` variable name in memory during the Creation Phase, but it DOES NOT attach the function to it until the execution reaches that exact line.

// TRAP: Trying to call it early results in a fatal crash. The variable is locked in the Temporal Dead Zone (TDZ).
// bootModernSystem(); // ReferenceError: Cannot access 'bootModernSystem' before initialization
const bootModernSystem = function () {
  console.log("Modern System Booting...");
};

console.log("===== FUNCTION DECLARATIONS (The Standard)");
// ------------------------------------------
// Features: Fully hoisted, possesses its own `this` context, and has the hidden `arguments` object.
function calculateDiscount(price, discountPercent) {
  // The engine automatically injects the `arguments` object into standard functions.
  // It is an array-like object containing every parameter passed, even if not defined in the signature.
  console.log("Arguments Object: ", arguments); // [Arguments] { '0': 100, '1': 20 }
  if (arguments.length === 0) return 0;

  return price - price * (discountPercent / 100);
}
console.log("Discounted Price: ", calculateDiscount(100, 20)); // 80

console.log("===== ANONYMOUS FUNCTION EXPRESSIONS");
// ------------------------------------------
// A function without a name. It relies entirely on the variable it is assigned to.
// This is heavily used when passing callbacks to Array methods.
const processPayment = function (amount) {
  return `Processing $${amount}...`;
};
console.log(processPayment(50)); // "Processing $50..."

console.log("===== NAMED FUNCTION EXPRESSIONS (The Enterprise Debugging Secret)");
// ------------------------------------------
// You can give an Expression a name. This name is ONLY accessible from INSIDE the function.
// Why do this? Because Anonymous functions show up as "anonymous" in Error Stack Traces, making debugging a nightmare. Named expressions give you clean Stack Traces.

const executeComplexTask = function taskEngine(retries) {
  if (retries === 0) {
    // We throw an error to see the Stack Trace.
    // If this was anonymous, the trace would say "at anonymous".
    // Instead, the trace clearly says "at taskEngine".
    // throw new Error("Task failed after max retries.");
    return;
  }
  console.log(`Executing... Retries left: ${retries}`);
  // We can use the internal name to recursively call itself safely!
  // executeComplexTask(retries - 1); // Dangerous if the variable gets reassigned.
  taskEngine(retries - 1); // Bulletproof recursion.
};

executeComplexTask(2);

console.log("===== FIRST-CLASS CITIZEN MECHANICS");
// ------------------------------------------
// Because functions are just Objects in Heap memory, we can treat them exactly like variables.

// A. Passing a function as an argument (Callback)
function runDiagnostics(callback) {
  console.log("System Check OK.");
  callback(); // Executing the passed memory pointer
}
runDiagnostics(function () {
  console.log("Callback Executed.");
});

// B. Returning a function from a function (Higher-Order)
function createGreeter(greeting) {
  // We return a brand new function pointer!
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}
const sayHello = createGreeter("Hello");
console.log(sayHello("Anand")); // "Hello, Anand!"
