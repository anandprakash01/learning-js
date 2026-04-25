// The Legacy Trap: var and the Global Object
// Before 2015, we only had var. When you declared a var in the global space, the engine glued that variable directly onto the Global Object (the window in a browser). this act as property for the global object

// This was an architectural nightmare. If you used a popular library, and both you and the library used var config = ..., you would overwrite each other's data on the window object, crashing the application. This is known as "polluting the global namespace."

// When ES6 introduced let and const, the architects of JavaScript fixed this flaw.
// When the V8 Engine creates the Global Lexical Environment, it does not just create one memory table. It creates a composite of two distinct records:

// 1. The Object Environment Record: This is bound directly to the Global Object (window in browsers, global in Node.js). It houses built-in APIs (Math, console) and any legacy variables declared with var. Because it is tied to the object, anything here can be accessed using the "this" keyword in the global scope.

//2. The Declarative Environment Record: This is a modern, secure vault introduced in ES6. It houses variables declared with const, let, and class. It is completely detached from the Global Object, meaning its contents can never be accessed via "this", and they will never accidentally overwrite built-in system properties.

console.log("===== Object Record (Legacy)");
// ------------------------------------------
// The engine sees `var` and places it directly onto the Global Object.
// This is called "Global Namespace Pollution."
var legacySystem = "Monolith_v1";

console.log("===== Declarative Record (Modern)");
// ------------------------------------------
// The engine sees `const` and locks it inside the Declarative Vault.
// It is safely isolated from the Global Object.
const modernSystem = "Microservices_v2";

console.log("===== Execution Test");
// ------------------------------------------
// The Scope Chain easily finds both, because both records are part of the overarching Global Lexical Environment.
console.log(legacySystem); // "Monolith_v1"
console.log(modernSystem); // "Microservices_v2"

// We explicitly ask the engine to look inside the Object Environment Record by using the `this` keyword (which points to the window/global object here).

console.log(this.legacySystem);
// Output: "Monolith_v1" (DANGER: The variable leaked onto the system object)

console.log(this.modernSystem);
// Output: undefined (SAFE: The Declarative vault blocked access via 'this')

console.log("===== Catastrophic Overwrite (Why we use const)");
// ------------------------------------------
console.log(this.name);
// If you uncomment the line below, you will overwrite the browser's actual built-in `name` property because `var` attaches directly to the window.
var name = "My Application";

// Using const guarantees we never break the host environment.
const secureName = "My Application";
