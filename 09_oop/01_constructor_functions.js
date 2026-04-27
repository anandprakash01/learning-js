// In JavaScript, a Constructor Function is just a regular function.
// The magic does not happen in the function itself; the magic happens entirely because of the `new` keyword used when calling it.

console.log("===== The 4 Hidden Steps of `new`");
// ------------------------------------------
// When you execute a function with `new`, the V8 Engine secretly intercepts the execution and performs 4 physical steps in memory:

// STEP 1: It creates a brand new, empty Object in the Heap: `{}`.
// STEP 2: It physically binds the `this` keyword to point to that new Object.
// STEP 3: It links the Object's hidden `__proto__` property to the Constructor's prototype.
// STEP 4: It implicitly returns the Object at the end of the function.

// Enterprise Standard: Constructors MUST start with a Capital Letter (PascalCase)

function ServerNode(ipAddress, port) {
  // Step 1 happens silently: `this = {}`

  // Step 2 in action: We mutate the empty object using `this`
  this.ip = ipAddress;
  this.port = port;
  this.status = "OFFLINE";

  // Step 3 happens silently.
  // Step 4 happens silently: `return this;`
}

const nodeA = new ServerNode("192.168.1.10", 80);
const nodeB = new ServerNode("192.168.1.11", 443);

console.log(nodeA); // ServerNode { ip: '192.168.1.10', port: 80, status: 'OFFLINE' }

console.log("===== Fatal Omission (Forgetting `new`)");
// ------------------------------------------
// If you call a Constructor WITHOUT the `new` keyword, the engine treats it like a normal function.
// Step 1 (creating the object) NEVER happens.
// Step 2 (`this` binding) defaults to the Global Object (`window` or `global`).

const buggyNode = ServerNode("10.0.0.5", 8080); // We forgot 'new'!
// this will give error in type:"module": TypeError: Cannot set properties of undefined (setting 'ip')

console.log("Buggy Node: ", buggyNode); // undefined (Because the function didn't return anything)
console.log(global.ip); // "10.0.0.5" (CATASTROPHE: We just mutated the Global Environment!)

console.log("===== Instance Verification (`instanceof`)");
// ------------------------------------------
// How do we prove that `nodeA` was built by `ServerNode`?
// We use the `instanceof` operator, which checks the Prototype Chain in memory.

console.log("Is nodeA a ServerNode? ", nodeA instanceof ServerNode); // true
console.log("Is an empty object a ServerNode? ", {} instanceof ServerNode); // false

console.log("===== Memory Bloat Trap (Methods inside Constructors)");
// ------------------------------------------
function Database(name) {
  this.name = name;

  // THE TRAP: We attach a method directly inside the constructor.
  this.connect = function () {
    console.log(`Connecting to ${this.name}...`);
  };
}

const db1 = new Database("Users");
const db2 = new Database("Products");
const db3 = new Database("Logs");

// What just happened in memory?
// We created 3 unique database objects. That is fine.
// BUT, we also created 3 SEPARATE COPIES of the `connect` function pointer in Heap memory!
// If we have 10,000 databases, we generate 10,000 identical function copies.
// This causes massive Memory Bloat.

console.log("Are the connect methods the same? ", db1.connect === db2.connect); // false!
db1.connect(); // Connecting to Users...
db2.connect(); // Connecting to Products...
db3.connect(); // Connecting to Logs...

// If you are building a video game with 10,000 enemies, and each enemy has an attack() function, your game will lag and crash because of 10,000 duplicate functions filling up the RAM.
// To fix this, we have to move the method OUT of the object and put it somewhere that all 10,000 instances can share it dynamically. That "shared space" is called the Prototype.

// Era 1: The Wild West (Pre-ES5 / Non-Strict Mode)
// You write a constructor function:
// function Router() { this.routes = []; }

// If you use new Router(): The V8 engine creates a brand new, empty object {} in memory, points this to that empty object, and attaches .routes to it. It is perfectly contained.

// If you forget new and write Router(): The V8 engine panics. It needs an object to attach .routes to. Because it doesn't have one, it defaults to the Global Object (window in the browser, global in Node.js). global.routes = []

// Era 2: The Safety Net (ES5 "use strict")
// Engineers realized Era 1 was too dangerous. They introduced "use strict".

// If you write Router() without new inside Strict Mode, the V8 engine refuses to default to the Global Object. Instead, it forcefully sets this to undefined.

// The Result: When the engine tries to run this.routes = [], it throws a massive error: TypeError: Cannot set properties of undefined.
// This is better than Era 1 because the app crashes immediately (Fail-Fast), rather than failing silently.

// Era 3: The Modern Wall (ES6 Classes & ESM)
// First, ES Modules (import/export) are locked into Strict Mode by default. You don't even have to type "use strict" anymore.

// Second, modern JavaScript uses the class keyword.

// The Result: If you write class Router {} and try to call Router() without new, the V8 engine doesn't even bother with this. It instantly blocks the execution and throws: TypeError: Class constructor cannot be invoked without 'new'.
