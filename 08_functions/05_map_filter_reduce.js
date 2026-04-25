console.log("===== Declarative vs Imperative Allocation");
// ------------------------------------------
// Imperative (The Old Way): You manually allocate memory and instruct the engine step-by-step.

const rawData = [1, 2, 3];
const imperativeResult = []; // Manual Heap allocation
for (let i = 0; i < rawData.length; i++) {
  imperativeResult.push(rawData[i] * 2); // Manual mutation
}

// Declarative (The Modern Standard): You pass a Callback function pointer.
// The V8 Engine automatically creates a secure, brand-new Array in the Heap, runs your callback on every item, and returns the new pointer.

const declarativeResult = rawData.map(num => num * 2);
// .map(), .filter(), and .reduce() NEVER mutate the original array.
// They always return a completely new memory pointer.
// This is why they are the absolute backbone of React State Management.

console.log("// ===== Array.prototype.map() (The Transformer)");
// ------------------------------------------
// Purpose: Transforms every element in an array and returns a NEW array of the EXACT SAME LENGTH.
// Callback Signature: (currentValue, index, originalArray) => { return newValue; }

const serverPorts = [80, 443, 8080];

// Example: Standard Transformation
const activeUrls = serverPorts.map(port => `https://localhost:${port}`);
console.log("URLs: ", activeUrls);

// TRAP: Forgetting the `return` statement in a block body.
// If you use `{}` but forget `return`, map still runs, but returns an array of `undefined`!
const buggyMap = serverPorts.map(port => {
  port * 2;
}); // OOPS! No return statement.
console.log("Buggy Map: ", buggyMap); // [undefined, undefined, undefined]

console.log("===== Array.prototype.filter() (The Gatekeeper)");
// ------------------------------------------
// Purpose: Tests every element against a condition. Returns a NEW array containing ONLY the elements where the callback returned `true`. Length will be less than or equal to original.
// Callback Signature: (currentValue, index, originalArray) => { return boolean; }

const apiResponses = [
  {id: 1, status: 200, user: "Anand"},
  {id: 2, status: 500, user: "System"},
  {id: 3, status: 200, user: "Guest"},
];

// Example: Extracting only successful requests
const successfulResponses = apiResponses.filter(res => res.status === 200);
console.log("Filtered: ", successfulResponses);

console.log("===== Array.prototype.reduce() (The Accumulator)");
// ------------------------------------------
// Purpose: Reduces an array to a single value by applying a callback function that accumulates results.
// The callback runs for every element, and the return value becomes the "accumulator" for the next iteration.
// Callback Signature: (accumulator, currentValue, index, originalArray) => { return newAccumulator; }

const networkLatencies = [15, 45, 20, 110];

// Example A: Calculating total latency
// The '0' at the end is the Initial Value of the accumulator.
const totalLatency = networkLatencies.reduce((acc, curr) => acc + curr, 0);
console.log("Total Latency: ", totalLatency); // 190

// Example B: Data Restructuring (Array to Object Dictionary)
// Reduce is not just for math. It is the most powerful restructuring tool in JavaScript.
const developers = [
  {id: "dev_1", name: "Anand", stack: "MERN"},
  {id: "dev_2", name: "Alice", stack: "Python"},
];
// We start with an empty object `{}`. We dynamically add keys to it on each pass.
const devDictionary = developers.reduce((acc, curr) => {
  acc[curr.id] = curr; // Create a key based on the ID, assign the whole object as the value
  return acc; // ALWAYS return the accumulator for the next iteration!
}, {}); // Initial Value is an empty object
console.log("Restructured Dictionary: ", devDictionary);
// {
//   dev_1: { id: 'dev_1', name: 'Anand', stack: 'MERN' },
//   dev_2: { id: 'dev_2', name: 'Alice', stack: 'Python' }
// }

console.log("===== THE ENGINE TRAP: The Missing Initial Value");
// ------------------------------------------
// If you do not provide an initial value to `.reduce()`, the V8 engine silently assumes the FIRST ITEM in the array is the initial value, and starts the loop at index 1.
// If the array is empty, the program violently crashes.
const emptyData = [];
// const crash = emptyData.reduce((acc, curr) => acc + curr); // TypeError: Reduce of empty array with no initial value
// ENTERPRISE FIX: Always, unconditionally, provide the initial value (0, "", [], {}).
const safeReduce = emptyData.reduce((acc, curr) => acc + curr, 0); // Returns 0 safely.

console.log("===== THE CHAINING ARCHITECTURE");
// ------------------------------------------
// Because `.map()` and `.filter()` return brand new arrays, you can chain them directly.

const transactionLogs = [50, -20, 100, -10];
// Objective: Find all deposits (positive numbers), add a 5% bonus, and sum them up.

const totalBonusDeposits = transactionLogs
  .filter(amt => amt > 0) // Pass 1: Returns [50, 100]
  .map(amt => amt * 1.05) // Pass 2: Returns [52.5, 105]
  .reduce((acc, curr) => acc + curr, 0); // Pass 3: Returns 157.5

console.log("Total Bonus: ", totalBonusDeposits);

// THE PERFORMANCE WARNING:
// Chaining is beautiful to read, but the V8 engine has to loop through the data 3 separate times and create 2 intermediate, temporary "garbage" arrays in the Heap.
// For arrays under 100,000 items, chaining is preferred for readability.
// For massive data pipelines, doing it all inside a single `.reduce()` is significantly faster.
