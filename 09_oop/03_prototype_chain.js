// When you ask the V8 Engine to find a property or method on an object, it doesn't just check the object and its immediate parent. It climbs a ladder of memory pointers until it hits the absolute ceiling of the JavaScript universe. This ladder is the Prototype Chain.

// Understanding this chain explains exactly why every single object in JavaScript magically has access to methods like .toString() and .hasOwnProperty() even though you never wrote them.

// ==========================================
// PART I: TRACING THE MEMORY TREE
// ==========================================
function Database(name) {
  this.name = name;
}

Database.prototype.connect = function () {
  return `Connecting to ${this.name}...`;
};

const usersDB = new Database("Users");

// We know `usersDB` has access to `.connect()`.
// But what happens if we call a method we DID NOT define?
console.log(usersDB.toString()); // "[object Object]"

// Wait. Where did `.toString()` come from?
// It is not on `usersDB`. It is not on `Database.prototype`.
// To find out, we have to trace the V8 Engine's search path.

console.log("===== The Ladder of __proto__");
// ------------------------------------------
// Level 1: The Instance
console.log("Level 1 (Instance): ", usersDB.hasOwnProperty("toString")); // false

// Level 2: The Constructor's Vault
console.log("Level 2 (Database Vault): ", Database.prototype.hasOwnProperty("toString")); // false

// Level 3: The Ultimate Parent (Object.prototype)
// Because `Database.prototype` is just an object itself, it ALSO has a `__proto__` link!
// It points to the master blueprint for all objects in JavaScript: `Object.prototype`.
console.log("Level 3 (Object Vault): ", Object.prototype.hasOwnProperty("toString")); // TRUE!

// The Engine climbed 3 levels of memory to find the function and execute it.

// ==========================================
// PART II: THE END OF THE UNIVERSE (`null`)
// ==========================================
// The `Object.prototype` vault is the absolute ceiling of the JavaScript universe. It has no parent. Its `__proto__` link points to `null` (the absence of anything).
// Does the chain go on forever? No.
// If the engine cannot find a property, it must eventually stop and return `undefined`.

// Let's look at the absolute top of the memory tree:
console.log(usersDB.__proto__); // Database.prototype
console.log(usersDB.__proto__.__proto__); // Object.prototype

// What is above Object.prototype?
console.log(usersDB.__proto__.__proto__.__proto__); // null
// `null` is the physical end of the Prototype Chain.
// When the engine hits `null`, it stops searching and returns `undefined`.

console.log("===== The Property Shadowing Trap");
// ------------------------------------------
// If you create a property on the instance with the exact same name as a method on the prototype, the instance property "shadows" (blocks) the prototype.
// The engine always stops at the FIRST match it finds.

usersDB.toString = function () {
  return `[Database: ${this.name}]`;
};
// The engine stops at Level 1 now. It never reaches Object.prototype.
console.log(usersDB.toString()); // "[Database: Users]"

// ===== The Performance Warning
// ------------------------------------------
// The deeper the Prototype Chain, the longer it takes the V8 Engine to resolve properties. If you build a 10-level deep inheritance chain, performance will degrade.
// Furthermore, checking non-existent properties forces the engine to traverse the ENTIRE chain before failing, which is computationally expensive in large loops.

console.log("===== Object.create() (Pure Prototypal Inheritance)");
// ------------------------------------------
// You don't actually need Constructor Functions to use the Prototype Chain.
// `Object.create(proto)` allows you to manually stitch two objects together.
const serverMethods = {
  reboot: function () {
    console.log("Rebooting...");
  },
};
// Creates a completely empty object, but permanently points its `__proto__` to `serverMethods`.
const webServer = Object.create(serverMethods);
webServer.port = 443;

webServer.reboot(); // "Rebooting..." (Delegated successfully!)
// Is `webServer` linked to `Object.prototype`?
// Yes, because `serverMethods` is an object, so the chain goes:
// webServer -> serverMethods -> Object.prototype -> null.
console.log(webServer.__proto__ === serverMethods); // true
console.log(webServer.__proto__.__proto__ === Object.prototype); // true
