// ==========================================
// PART I: FIRST-CLASS FUNCTIONS (The Language Property)
// ==========================================

// "First-Class" is NOT a type of function. It is a feature of the JavaScript engine.
// It means JavaScript treats functions as basic "Values" (Objects in Heap memory).
// Because they are just values, you can do three specific things with them:

// 1. Assign them to a variable or object property.
const logSystem = () => console.log("System Running");

// 2. Store them inside Data Structures (like Arrays or Maps).
const taskQueue = [
  () => console.log("Task 1: Connect DB"),
  () => console.log("Task 2: Authenticate"),
  logSystem,
];
// Executing the second task directly from the Array pointer:
taskQueue[1](); // "Task 2: Authenticate"

// 3. Pass them as arguments, or return them from other functions.
// (This specific ability is what makes Higher-Order Functions possible).

// ==========================================
// PART II: HIGHER-ORDER FUNCTIONS (The Definition)
// ==========================================
// A Higher-Order Function (HOF) is any function that does AT LEAST ONE of the following:
// A) Accepts another function as an argument (a Callback).
// B) Returns a new function as its output.

// ===== Example A: Accepting a Function (The Custom Transformer)
// ------------------------------------------
// We build a generic text processor. It doesn't know HOW to format the text;
// it relies entirely on the function pointer passed into it.

function processLog(rawText, formatterFn) {
  // 1. We receive raw data and a memory pointer to a formatting function.
  const cleanText = rawText.trim();

  // 2. We execute the pointer, passing our clean text into it.
  return formatterFn(cleanText);
}

// These are our specific formatter tools:
const toAlert = str => `[ALERT]: ${str.toUpperCase()}`;
const toSilent = str => `[log]: ${str.toLowerCase()}`;

// We pass the data AND the tool we want to use:
console.log(processLog("   Database Failure   ", toAlert)); // "[ALERT]: DATABASE FAILURE"
console.log(processLog("   User Logged In   ", toSilent)); // "[log]: user logged in"

// ===== Example B: Returning a Function (The Factory Pattern)
// ------------------------------------------
// This function doesn't return data; it manufactures and returns a brand new Function pointer. This relies heavily on Closures to remember the `taxRate`.

function createTaxCalculator(taxRate) {
  // We return a new Arrow Function into memory.
  // It "closes over" the taxRate variable.
  return amount => {
    return amount + amount * taxRate;
  };
}
// We generate two custom functions:
const calculateNYTax = createTaxCalculator(0.08); // Traps 0.08 in memory
const calculateUKTax = createTaxCalculator(0.2); // Traps 0.20 in memory
console.log("NY Cost: $", calculateNYTax(100)); // $108
console.log("UK Cost: £", calculateUKTax(100)); // £120

// ==========================================
// PART III: BUILDING `.map()` FROM SCRATCH
// ==========================================
// To truly understand Built-In HOFs, we must build our own.
// Here is the exact architecture of how Array.prototype.map works under the hood.

const myMap = (arr, callbackPointer) => {
  // 1. Create a brand new Heap memory block to ensure Immutability.
  const result = [];

  // 2. Loop through the raw data.
  for (let i = 0; i < arr.length; i++) {
    // 3. Execute the callback pointer on every single item.
    // We pass the current value, the index, and the raw array, matching the official API.
    const transformedValue = callbackPointer(arr[i], i, arr);

    // 4. Push the new value into our secure result array.
    result.push(transformedValue);
  }
  return result;
};

// Testing our custom HOF:
const rawSalaries = [50000, 60000, 70000];

const afterTaxSalaries = myMap(rawSalaries, salary => salary * 0.8);
console.log(afterTaxSalaries); // [40000, 48000, 56000]

// ==========================================
// PART IV: PROTOTYPE INJECTION (The True Polyfill)
// ==========================================

// To use `myMap` like a native method, we must attach it to the master blueprint that all arrays inherit from: Array.prototype.

// CRITICAL ENGINE RULE: We MUST use a Classic Function expression here.
// If we use an Arrow Function, `this` will look at the Global Scope and fail.
// By using `function()`, the engine dynamically binds `this` to whoever CALLED the method.

function customMap(callbackPointer) {
  // 1. Create the secure, immutable result array in the Heap.
  const result = [];

  // 2. The `this` keyword now points to the exact array that called `.myMap()`.
  // If rawSalaries.myMap() is called, `this` === rawSalaries.

  for (let i = 0; i < this.length; i++) {
    // 3. Execute the callback.
    // We pass: currentValue (this[i]), index (i), and the original array (this).
    const transformedValue = callbackPointer(this[i], i, this);

    // 4. Store the result.
    result.push(transformedValue);
  }

  // 5. Return the new array.
  return result;
}

Array.prototype.customMap = customMap; // Polyfill

const baseSalary = [50000, 60000, 70000];

// The engine sees `.customMap`. It checks the baseSalary object -> Not there.
// It travels up the Prototype Chain to Array.prototype -> Found it!
// It binds `this` to baseSalary and executes.
const afterTax = baseSalary.customMap(salary => salary * 0.8);
// passing arguments is ALWAYS optional for the receiver
// What does the V8 Engine do with the other two (Value, Index, Array) ? It simply ignores them. It does not crash. It does not throw an error. It assigns salary to this[i], and lets the index and array instantly fall off the Call Stack into the Garbage Collector.

console.log("After Tax: ", afterTax); // [40000, 48000, 56000]
("Monkey Patching");

// What we just did is called creating a Polyfill—writing custom code to mimic a native engine feature.

// However, modifying native prototypes (Array.prototype, Object.prototype) in a production codebase with custom names like .myMap or .getCustomData is heavily frowned upon in Enterprise environments. This practice is known as "Monkey Patching." Why? Because if a future version of JavaScript officially releases a method called Array.prototype.myMap, your custom code will collide with the V8 Engine's native code, causing catastrophic, untraceable bugs.
