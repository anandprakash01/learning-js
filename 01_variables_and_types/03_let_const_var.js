console.log("========== var");
// ------------------------------------------
// Variables declared with `var` are function-scoped or globally-scoped.
// They ignore block scope (curly braces {}) which causes memory leaks.

var a; // Declaring a Variable
a = 10; // Initializing Variables

var legacyPort = 8080; //Declaring and Initializing a Variable
legacyPort = 5000; // Re-assignment is valid

// `var` allows silent redeclaration. This is a massive security risk.
var legacyPort = 3000; // No error thrown! The original value is destroyed.
console.log("Legacy Port: " + legacyPort); // 3000

for (var i = 0; i < 10; i++) {}
console.log(i);

console.log("========== let");
// ------------------------------------------
// Use `let` ONLY when a variable's primitive value must change.
// `let` is block-scoped. It respects the boundaries of { }.
let retryCount = 0;
// Re-assignment is valid and expected.
retryCount = 1;
console.log("Retries: " + retryCount); // 1

// Redeclaration in the same scope throws a fatal error (Enterprise Safety).
// let retryCount = 2; // SyntaxError: Identifier 'retryCount' has already been declared

console.log("========== const");
// ------------------------------------------
// Use `const` for 95% of your variables. It creates an immutable memory binding.
// Initializer is MANDATORY while declaring the constant. You cannot declare it empty.
// once you declare the variable there only we need to pass value. you cannot re-assign the value.
// old javascript did not had this features.it came on latest es6 features of javascript.
// for constant please use capital letter variable.

// const API_KEY; // SyntaxError: Missing initializer in const declaration
// const PI; // PI = 3.14; // re-assigning is not allowed in const
const API_KEY = "sk_live_123";

// Re-assignment throws a fatal error. The pointer is locked. re-assigning is not allowed in const
// API_KEY = "sk_test_456"; // TypeError: Assignment to constant variable.

// THE `const` does NOT freeze the data, only the pointer!
const activeUsers = ["Anand", "Akash"];
// activeUsers = ["Amol"]; // ERROR: Cannot change the memory pointer.
activeUsers.push("Amol"); // SUCCESS: We mutated the data inside the allowed memory space.
console.log("Active Users: " + activeUsers); // Anand,Akash,Amol

console.log("===== Type checking");
// ------------------------------------------

console.log(typeof 10); // number
console.log(typeof 34.2); // number
console.log(typeof true); // boolean
console.log(typeof "anand"); // string
console.log(typeof undefined); // undefined
console.log(typeof {}); // object
console.log(typeof null); // object
