// ==========================================
// PART I: BIGINT (Breaking the 64-bit Limit)
// ==========================================
console.log("===== Memory Limit (Number.MAX_SAFE_INTEGER)");
// ------------------------------------------
// Standard JavaScript Numbers are 64-bit floats. They lose mathematical precision after a specific limit.

const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
console.log("Safe + 1: ", maxSafe + 1); // 9007199254740992
console.log("Safe + 2: ", maxSafe + 2); // 9007199254740992 (BUG: Precision lost!)

console.log("===== The BigInt Fix");
// ------------------------------------------
// BigInt allocates dynamic memory on the Heap to handle integers of ANY size.
// Syntax: Append 'n' to the end of the number, or use BigInt().
const hugeNum = 9007199254740991n;
console.log("BigInt + 2: ", hugeNum + 2n); // 9007199254740993n (Safe!)

// TRAP: Type Mixing
// You CANNOT mathematically mix BigInts and standard Numbers.
// The engine will violently crash because it refuses to guess which memory type to use.
// const crash = 10n + 5; // TypeError: Cannot mix BigInt and other types

// FIX: Explicit Coercion
const safeMix = 10n + BigInt(5);
console.log("Coerced Math: ", safeMix); // 15n

// ==========================================
// PART II: SYMBOLS (Guaranteed Uniqueness)
// ==========================================
console.log("===== Allocation Mechanics");
// ------------------------------------------
// Symbols are Primitive values stored on the Call Stack.
// Every time you call `Symbol()`, the V8 Engine generates a completely unique, un-reproducible memory pointer, even if the description string is exactly the same.

const sym1 = Symbol("secret");
const sym2 = Symbol("secret");

console.log("Are they equal? ", sym1 === sym2); // false (Different pointers entirely)
console.log("Symbol Descriptions: ", sym1.description, sym2.description); // "secret" "secret"
console.log("Symbol Types: ", typeof sym1, typeof sym2); // "symbol" "symbol"
console.log("Symbol to String: ", String(sym1)); // "Symbol(secret)"
console.log("Symbol : ", sym1); // "Symbol(secret)" (but not a string, it's a symbol primitive)

console.log("===== Enterprise Use Case: Hidden Object Properties");
// ------------------------------------------
// Standard Object keys are Strings. If two libraries use the key "id", they overwrite each other.
// Symbols prevent this collision and hide data from standard loops.
const USER_ID = Symbol("id");
const secureUser = {
  name: "Anand",
  [USER_ID]: 9982, // Injecting the symbol as a key using bracket notation
};

// 1. No Collision: It doesn't overwrite a string "id"
secureUser.id = "Public_ID_123";

console.log(secureUser[USER_ID]); // 9982
console.log(secureUser.id); // "Public_ID_123"

// 2. Hidden from Iteration
// Symbols DO NOT show up in Object.keys() or for...in loops!
console.log("Visible Keys: ", Object.keys(secureUser)); // ["name", "id"]

// 3. Extraction: The ONLY way to find them
const hiddenSymbols = Object.getOwnPropertySymbols(secureUser);
console.log("Hidden Symbols: ", hiddenSymbols); // [Symbol(id)]
console.log("Hidden Data: ", secureUser[hiddenSymbols[0]]); // 9982

console.log("===== The Global Symbol Registry");
// ------------------------------------------
// If you actually NEED to share the exact same Symbol across different files in your app, you must use the Global Registry via .for().

// .for() searches the global registry. If it exists, it returns it. If not, it creates it.
const globalA = Symbol.for("database_conn");
const globalB = Symbol.for("database_conn");

console.log("Global Match: ", globalA === globalB); // true

// .keyFor() retrieves the string description of a global symbol.
console.log("Global Key: ", Symbol.keyFor(globalA)); // "database_conn"
