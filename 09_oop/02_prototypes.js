// In classical languages like Java or C++, a "Class" is a rigid blueprint. When you create an object, the compiler copies all the methods from the blueprint directly into the object.

// JavaScript does not copy methods. Instead, it uses a brilliant memory-saving system called Prototypal Delegation. If an object doesn't have a method, it "delegates" the request up a hidden chain to a shared memory space.

console.log("===== The `prototype` Property (The Shared Vault)");
// ------------------------------------------
// The exact moment you declare a Constructor Function, the V8 Engine does two things:
// 1. It allocates the function in memory.
// 2. It automatically creates a brand new, empty Object and attaches it to the function under a property named `.prototype`.
function Database(name) {
  // We ONLY put instance-specific data here.
  // Data that is unique to every single object.
  this.name = name;
}

// The `.prototype` Object is a shared vault for methods.
// It is NOT a blueprint. It is a shared memory space for methods.
// Every function has this empty object automatically!
console.log(Database.prototype); // {}

console.log("===== The Hidden Link (`__proto__`)");
// ------------------------------------------
// When we use the `new` keyword, the engine links the newly created object directly to the Constructor's `.prototype` vault.
// It creates a secret, hidden pointer called `__proto__` (the Dunder Proto).

const usersDB = new Database("UsersDB");
// The engine secretly did this inside the `new` keyword process: usersDB.__proto__ === Database.prototype;

console.log("===== Solving the Memory Bloat Trap");
// ------------------------------------------
// Instead of putting the `connect` method INSIDE the constructor (which duplicates it),
// we inject it into the shared `.prototype` vault.

Database.prototype.connect = function () {
  // Because this is a classic function, `this` dynamically points to whoever called it (usersDB, productsDB, etc).
  console.log(`Connecting to ${this.name} database...`);
};

const productsDB = new Database("Products");
const logsDB = new Database("Logs");

usersDB.connect(); // "Connecting to Users database..."
productsDB.connect(); // "Connecting to Products database..."

// THE MEMORY PROOF:
// Are these two objects using the EXACT SAME function pointer in the Heap?
console.log("Memory Check: ", usersDB.connect === productsDB.connect); // TRUE!
// We can create 1,000,000 databases, and they will all share ONE single `connect` method.

// ------------------------------------------
// When you type `usersDB.connect()`, here is the exact V8 execution sequence:
// 1. Engine looks at the `usersDB` object itself. Does it have a `connect` property? NO.
// 2. Engine says: "Let me check the hidden `__proto__` link."
// 3. It travels up the link to `Database.prototype`.
// 4. Does `Database.prototype` have a `connect` property? YES. Execute it.

console.log("===== Proving Ownership (`hasOwnProperty`)");
// ------------------------------------------
// Because objects have access to properties they don't actually own,
// Enterprise codebases must strictly verify data ownership before mutating it.

// `name` lives directly on the object.
console.log(usersDB.hasOwnProperty("name")); // true

// `connect` lives on the Prototype. The object has access to it, but doesn't OWN it.
console.log(usersDB.hasOwnProperty("connect")); // false

console.log("===== The `__proto__` vs `prototype` Trap");
// ------------------------------------------
// This is a classic Senior Interview question. Do not confuse these two!

// A. `prototype` is a property that ONLY exists on Functions. It is the vault where you put shared methods.
console.log(typeof Database.prototype); // "object"
console.log(Database.prototype); // { connect: [Function (anonymous)] }

// B. `__proto__` is a property that exists on EVERY Object.
// It is the physical memory pointer that points to the vault.
console.log(usersDB.prototype); // undefined (Objects don't have this!)
console.log(usersDB.__proto__); // { connect: [Function (anonymous)] }
console.log(usersDB.__proto__ === Database.prototype); // true

console.log("===== The `constructor` Property (The Backdoor)");
// ------------------------------------------
// Every `.prototype` vault automatically gets a `constructor` property that points back to the original function.
// This is a backdoor that allows us to trace the lineage of an object back to its Constructor.
console.log(Database.prototype.constructor === Database); // true
console.log(usersDB.constructor === Database); // true
