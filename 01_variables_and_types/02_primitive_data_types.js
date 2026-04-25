// In JavaScript, data is divided into two distinct categories: Primitives and References.
// Primitive data types are the lowest level of data implementation. They are immutable (the value itself cannot be changed, though a variable holding it can be reassigned) and they are stored directly on the Call Stack. When you assign a primitive to a new variable, the V8 engine creates a strict, independent copy of that value.

// JavaScript has 7 Primitive Data Types:

// 1. String: Text data.

// 2. Number: Integers and floating-point numbers. (JavaScript does not have separate types for integers and floats; it is all just Number).

// 3. Boolean: Logical true or false.

// 4. Undefined: The engine's default state for a variable that has been declared but not assigned a value.

// 5. Null: An intentional, developer-assigned empty value. It represents the deliberate absence of an object.

// 6. Symbol: (ES6) A unique and immutable primitive used specifically as object property keys to prevent naming collisions in massive codebases.

// 7. BigInt: (ES2020) Used for numbers larger than the standard Number type can safely hold (larger than 2^53 - 1).

console.log("===== Strings, Numbers and Booleans");
// ------------------------------------------
let userName = "hr_anand"; // string
let age = 35; // number(integer)
let amount = 50.5; // number(float)
let isActive = true; // boolean

console.log(typeof userName); // string
console.log(typeof age); // number
console.log(typeof amount); // number
console.log(typeof isActive); // boolean

console.log("===== Undefined vs null");
// ------------------------------------------
// `undefined` is usually assigned by the engine.
let userInfo;
console.log("Type of userInfo: " + typeof userInfo); // "undefined"

// `null` is explicitly assigned by the developer to clear a value.
let activeTransaction = null;
console.log("Type of null: " + typeof activeTransaction); // "object" (This is a bug!)
// unfixable bug built into the core of JavaScript: typeof null returns "object". It is not an object; it is a primitive. Fixing this bug now would break millions of legacy websites, so the enterprise standard is to simply be aware of it and write defensive code around it.

console.log("===== Dynamic Typing in Action");
// ------------------------------------------

let user = "Anand Prakash";
console.log(typeof user); // string
user = 10; // The variable easily switches from String to Number
console.log(typeof user); // number

console.log("===== ES6+ Primitives (Symbol and BigInt)");
// ------------------------------------------
// Symbols are guaranteed to be completely unique.
const ID_1 = Symbol("id");
const ID_2 = Symbol("id");
console.log("Are symbols strictly equal? ", ID_1 === ID_2); // false

// BigInt is used for massive financial or scientific calculations.
// Appending 'n' to the end of an integer makes it a BigInt.
const maxSafeNumber = 9007199254740991n;
console.log(maxSafeNumber);
