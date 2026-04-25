// Objects are the foundational building block of JavaScript. Unlike Arrays, which are numerically indexed, Objects are Hash Maps (Dictionaries) that map String/Symbol keys to values.

console.log("===== Memory Allocation (Stack vs Heap)");
// ------------------------------------------
// Like Arrays, Objects are Reference Types.
// The V8 Engine allocates the actual key-value pairs in the Heap.
// The variable simply holds a hexadecimal pointer on the Call Stack.
const dbConfig = {
  host: "10.0.0.1",
  port: 5432,
  role: "Primary",
};
// key in double quotes is valid object. But Double quotes is used for only json.

console.log("===== Reference Trap (Mutation)");
// ------------------------------------------
// Assigning an object to a new variable creates a second pointer to the exact same Heap address. It DOES NOT copy the data.
const buggyCopy = dbConfig; // Reference
// Mutating the backup destroys the original system configuration.
buggyCopy.port = 8080;
console.log("Original Port Mutated: ", dbConfig.port); // 8080

console.log("===== INITIALIZATION & CRUD OPERATIONS");
// ------------------------------------------
// Objects are ideal for representing complex data with named properties. They excel at CRUD operations (Create, Read, Update, Delete) on key-value pairs.
const user = {id: 1, role: "admin", isActive: true};

// READ (Dot vs Bracket Notation)
console.log("User Role (Dot): ", user.role); // "admin" (Dot notation: Strict, requires exact key name)
console.log("User Role (Bracket): ", user["role"]); // "admin" (Bracket notation: Allows dynamic variables as keys)

// UPDATE - O(1))
user.role = "super_admin"; // Updates existing key

// CREATE - O(1))
user.lastLogin = "2026-04-20"; // Dynamically allocates a new key-value pair
console.log("Updated User: ", user);

// DELETE - O(1))
// The `delete` operator completely removes the key and value from the Heap.
// Returns `true` if successful.
const isDeleted = delete user.lastLogin;
console.log("Was the key deleted successfully? ", isDeleted);
console.log("After Deletion: ", user);

console.log("===== TRAVERSAL & EXTRACTION");
// ------------------------------------------
// Objects are NOT inherently iterable. You cannot use .map() or .filter() on them.
// We must extract their parts into Arrays first.

const server = {os: "Linux", ram: "32GB", cores: 8};

// Object.keys(obj) -> Returns an Array of strings representing the keys.
const serverKeys = Object.keys(server);
console.log("Server Keys: ", serverKeys); // ["os", "ram", "cores"]

// Object.values(obj) -> Returns an Array of values corresponding to the keys.
const serverValues = Object.values(server);
console.log("Server Values: ", serverValues); // ["Linux", "32GB", 8]

// Object.entries(obj) -> Returns an Array of [key, value] pairs.
const serverEntries = Object.entries(server);
console.log("Server Entries: ", serverEntries); // [["os", "Linux"], ["ram", "32GB"], ["cores", 8]]

// Now we can use standard iteration protocols safely.
for (const entry of serverEntries) {
  const key = entry[0];
  const value = entry[1];
  console.log(`Server Check: ${key} -> ${value}`);
}

// .hasOwnProperty(prop) -> Returns boolean. Checks if key exists ON THIS OBJECT directly (ignoring inherited properties from the Prototype chain).
console.log("Has 'ram'? ", server.hasOwnProperty("ram")); // true

console.log("===== ENGINE-LEVEL MEMORY LOCKS (Immutability)");
// ------------------------------------------
// In strict architecture, we physically lock critical objects in memory.

// Object.freeze(obj) -> MAXIMUM LOCK.
// Cannot add, delete, or update any properties. makes the object completely read-only.
const frozenAuth = {token: "123_ABC"};
Object.freeze(frozenAuth);
frozenAuth.token = "Hacked"; // Silently ignored (or throws TypeError in Strict Mode)
console.log("Frozen Token: ", frozenAuth.token); // "123_ABC"

// Object.seal(obj) -> MODERATE LOCK.
// Cannot add or delete properties. CAN UPDATE EXISTING properties.
const userSession = {
  token: "ABC_123",
  status: "Active",
};
Object.seal(userSession);
userSession.status = "Inactive"; // Allowed! (Modifying existing)
userSession.newHacker = "Eve"; // Blocked! (Adding new)
console.log("Sealed Session: ", userSession);

// Object.preventExtensions(obj) -> LIGHT LOCK.
// Cannot add new properties. CAN UPDATE and DELETE existing properties.
const restrictedProfile = {theme: "Dark", notifications: true};
Object.preventExtensions(restrictedProfile);
restrictedProfile.theme = "Light"; // Allowed! (Updating existing)
delete restrictedProfile.notifications; // Allowed! (Deleting existing)
restrictedProfile.language = "EN"; // Blocked! (Adding new)
console.log("Restricted Profile: ", restrictedProfile);

console.log("===== COPYING & MERGING (Shallow Copies)");
// ------------------------------------------
const defaults = {volume: 50, brightness: 70};
const userPrefs = {brightness: 100, color: "Red"};

// Object.assign(target, source1, source2...) -> MUTATES the target object.
// Copies all enumerable properties from sources to target. Right-most source wins conflicts.
const mergedPrefs = Object.assign({}, defaults, userPrefs);
console.log("Merged Preferences: ", mergedPrefs); // { volume: 50, brightness: 100, color: "Red" }

// The Spread Operator (...) -> Modern ES6 equivalent to Object.assign for copying.
const spreadMerged = {...defaults, ...userPrefs};
console.log("Spread Merged Preferences: ", spreadMerged); // { volume: 50, brightness: 100, color: "Red" }

// WARNING: Spread and Object.assign create SHALLOW COPIES.
// If your object has a nested object, the nested object is passed by REFERENCE, not copied!
const systemA = {id: 1, config: {maxRAM: "16GB"}};
const systemCopy = {...systemA};
systemCopy.config.maxRAM = "32GB"; // Mutates systemA's config as well!
console.log("System A Config: ", systemA.config); // { maxRAM: "32GB" }

console.log("===== DEEP COPYING (Complex Objects)");
// ------------------------------------------
// For deep copying, we need to recursively copy nested objects. This is not built-in and requires custom logic or libraries like Lodash.
Object.prototype.hackedProperty = "I am everywhere now";
// The for...in loop doesn't just loop through the properties you explicitly added to an object. It also loops through any enumerable properties the object inherited from its prototype chain.
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj; // Return primitives as-is
  }
  if (Array.isArray(obj)) {
    return obj.map(deepCopy);
  }
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepCopy(obj[key]);
    }
  }
  return clonedObj;
}
const systemB = {id: 2, config: {maxRAM: "16GB"}};
const systemBDeepCopy = deepCopy(systemB);
systemBDeepCopy.config.maxRAM = "32GB";
console.log("System B Config: ", systemB.config); // { maxRAM: "16GB" }
console.log("System B Deep Copy Config: ", systemBDeepCopy.config); // { maxRAM: "32GB" }

console.log("===== ADVANCED META-PROGRAMMING (Proxies & Symbols)");
// ------------------------------------------
// Object.create(prototype) -> Creates a new object using an existing object as its Prototype.
const animalProto = {isAlive: true};
const dog = Object.create(animalProto);
dog.name = "Buddy";
console.log("Dog is alive: ", dog.isAlive); // true (Inherited from prototype, not stored on 'dog')
console.log("Dog: ", dog); // { name: "Buddy" } (Own property stored directly on 'dog')

// Object.defineProperty(obj, prop, descriptor) -> Granular control over how a property behaves.
const secureData = {};
Object.defineProperty(secureData, "apiKey", {
  value: "SK_999",
  writable: false, // Cannot be changed
  enumerable: false, // Will NOT show up in Object.keys() or loops (Invisible)
  configurable: false, // Cannot be deleted
});
console.log("Secure Data: ", secureData); // {} (apiKey is hidden)
secureData.apiKey = "Hacked"; // Silently ignored (or throws TypeError in Strict Mode)
delete secureData.apiKey; // Fails silently (or throws TypeError in Strict Mode)
console.log("API Key: ", secureData.apiKey); // "SK_999" (Still accessible directly)
console.log("Is it visible? ", Object.keys(secureData)); // [] (Hidden from loops)

// Object.is(val1, val2) -> The absolute strictest comparison in JS.
// Better than `===` because it handles NaN and -0 correctly.
console.log("=== : ", NaN === NaN); // false (Famous JS quirk)
console.log("Object.is(): ", Object.is(NaN, NaN)); // true

// JavaScript provides powerful meta-programming tools to intercept and customize object behavior.
// Proxies allow you to define custom behavior for fundamental operations (e.g., property access, assignment, enumeration).
const target = {message: "Hello"};
const handler = {
  get: (obj, prop) => {
    if (prop === "message") {
      return obj.message;
    }
  },
};
const proxy = new Proxy(target, handler);
console.log("Proxy Message: ", proxy.message); // "Hello"

// Symbols are unique identifiers that can be used as object keys without risk of collision.
const uniqueKey = Symbol("unique");
const myObject = {[uniqueKey]: "This is a unique value"};
console.log("Symbol Key Value: ", myObject[uniqueKey]); // "This is a unique value"
