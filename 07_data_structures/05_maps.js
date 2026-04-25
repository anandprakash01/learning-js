// For decades, developers used standard Objects as Dictionaries (Hash Maps) to store key-value data. However, standard Objects have severe architectural flaws when used for heavy data processing: they coerce all keys into Strings, they inherit unwanted properties from their Prototype chain, and they do not keep track of their own size.

// ES6 introduced the Map object to solve these exact problems. It is the enterprise standard for data caching, fast lookups, and state dictionaries.

// 1. Maps allow keys of any type, while Objects coerce keys to Strings.
// 2. Maps do not have a Prototype chain, so they are not vulnerable to prototype pollution.
// 3. Maps track Heap memory pointers, allowing you to use Objects and Functions as keys.
// 4. Maps have built-in size tracking, making it easy to get the number of entries.
// 5. Maps are Iterables and guarantee insertion order during iteration, while Objects do not guarantee key order.

console.log("===== String Coercion Trap (Objects vs Maps)");
// ------------------------------------------
// In a standard Object, the V8 engine violently converts ALL keys into Strings.
// This causes catastrophic memory overlaps if you try to use Numbers or Objects as keys.
// A Map is a collection of keyed data items, just like an Object. But the main difference is that Map allows keys of any type.
const standardObject = {};
standardObject[1] = "Data A";
standardObject["1"] = "Data B";
// BUG: The string "1" overwrote the number 1 because the engine coerced the number.
console.log(standardObject); // { '1': 'Data B' }
console.log(standardObject["1"]); // "Data B"

// Maps physically isolate keys by their exact Memory Type and Pointer.
// A Number 1 is treated as a completely different key than a String "1".
const systemMap = new Map();
systemMap.set(1, "Data A");
systemMap.set("1", "Data B");

console.log(systemMap.get(1)); // "Data A"
console.log(systemMap.get("1")); // "Data B"

console.log("===== Prototype Pollution Trap (Objects vs Maps)");
// ------------------------------------------
// Standard Objects inherit properties from their Prototype chain, which can lead to unexpected behavior and security vulnerabilities. For example, if you use an Object as a dictionary, you might accidentally overwrite inherited properties or methods.
const pollutedObject = {};
pollutedObject.__proto__.polluted = "This is polluted!";
console.log(pollutedObject.polluted); // "This is polluted!"

// Maps do not inherit from the Prototype chain, so they are not vulnerable to prototype pollution.
const cleanMap = new Map();
cleanMap.set("polluted", "This is clean!");
console.log(cleanMap.get("polluted")); // "This is clean!"

console.log("===== Using Objects as Keys (Pointer Tracking)");
// ------------------------------------------
// Because Maps track Heap memory pointers, you can use an entire Object or Function as a key. This is impossible in standard Objects.
const userReference = {id: 99};
const activeSessions = new Map();

// We map the exact memory pointer of `userReference` to a session token.
activeSessions.set(userReference, "TOKEN_ABC_123");
console.log(activeSessions.get(userReference)); // "TOKEN_ABC_123"
// TRAP: Trying to get the data using a visually identical object WILL FAIL, because a new object literal `{ id: 99 }` creates a different Heap pointer!
console.log(activeSessions.get({id: 99})); // undefined

console.log("===== INITIALIZATION");
// ------------------------------------------
// You can initialize an empty map, or pass an Iterable (an Array of Arrays).
const cache = new Map([
  ["user_1", "Anand"],
  ["user_2", "Admin"],
]);

console.log("// ===== CRUD OPERATIONS ($O(1)$ Time Complexity)");
// ------------------------------------------
const db = new Map();
// CREATE / UPDATE: .set(key, value)
// .set() returns the Map itself, allowing for "Chaining".
db.set("host", "localhost").set("port", 8080).set("ssl", true);
console.log(db); // Map(3) { 'host' => 'localhost', 'port' => 8080, 'ssl' => true }

// READ: .get(key)
// Returns the value, or `undefined` if the key does not exist.
console.log(db.get("host")); // "localhost"

// CHECK EXISTENCE: .has(key)
// vastly superior and faster than `hasOwnProperty` on standard Objects.
console.log(db.has("port")); // true
console.log(db.has("Password")); // false

// DELETE: .delete(key)
// Returns `true` if an element was removed, `false` if it didn't exist.
const wasRemoved = db.delete("ssl");
console.log("Was SSL removed? ", wasRemoved); // true
console.log(db); // Map(2) { 'host' => 'localhost', 'port' => 8080 }

// CLEAR: .clear()
// Instantly deletes all data from the Map and frees the Heap memory.
db.clear();
console.log("Map cleared. Size: ", db.size); // 0

console.log("===== SIZE TRACKING (The $O(1)$ Advantage)");
// ------------------------------------------
// To get the size of an Object, you must use `Object.keys(obj).length`, which is an $O(N)$ operation (the engine must count every key).
// Maps track their size mathematically. Finding the size is instant ($O(1)$).

const queue = new Map([
  ["job_1", "Process Video"],
  ["job_2", "Send Email"],
  ["job_3", "Process Image"],
]);
console.log("Queue Size: ", queue.size); // 3

console.log("===== ITERATION (Maps are Iterables)");
// ------------------------------------------
// Unlike Objects, Maps are true Iterables. They guarantee that keys will be iterated in the EXACT ORDER they were inserted.

// A. Iterating Keys: .keys()
for (const key of queue.keys()) {
  console.log("Key: ", key);
}
console.log("Keys: ", [...queue.keys()]); // You can also spread the keys into an Array.

// B. Iterating Values: .values()
for (const value of queue.values()) {
  console.log("Value: ", value);
}

// C. Iterating Both: .entries() (or just the Map itself)
for (const [key, value] of queue.entries()) {
  console.log(`[${key}] -> ${value}`);
}
console.log("Entries: ", queue.entries()); // You can also spread the entries into an Array.
for (const [key, value] of queue) {
  console.log(`[${key}] -> ${value}`);
}

// D. Functional Iteration: .forEach(callback)
// Syntax: (value, key, map) => {}
queue.forEach((value, key) => {
  console.log(`[${key}] -> ${value}`);
});

console.log("===== CONVERSION & EXTRACTION");
// ------------------------------------------

// 1. Map to an Array of Arrays (Using Spread)
const mapToArray = [...queue];
console.log("Map to Array: ", mapToArray);

// Map to an Array of Arrays using `Array.from(map.entries())`.
const queueArray = Array.from(queue.entries());
console.log("Array.from(map.entries()) : ", queueArray);

// 2. Object to Map
const obj = {a: 1, b: 2, c: 3};
// Object.entries() creates the exact Array of Arrays format the Map constructor needs!
const objToMap = new Map(Object.entries(obj));
console.log("Object to Map: ", objToMap);

// 3. Map to Object (Using Object.fromEntries)
const backToObject = Object.fromEntries(objToMap);
console.log("Map to Object: ", backToObject);

// Can also convert a Map to a Object using `Object.fromEntries(map.entries())`.
const backToObject2 = Object.fromEntries(objToMap.entries());
console.log("Map to Object: ", backToObject2);
