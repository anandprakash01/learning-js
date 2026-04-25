// While Arrays are ordered lists that allow duplicates, a Set is an unordered collection that guarantees absolute uniqueness.

// Under the hood, the V8 Engine implements Sets using the exact same Hash Table architecture as Maps. This means checking if a user has already voted, or filtering out duplicate API responses, happens in instant $O(1)$ time complexity rather than the slow $O(N)$ time of an Array's .includes().

console.log("===== Uniqueness Guarantee & Type Strictness");
// ------------------------------------------
// Sets do not coerce types. The number `1` and the string `"1"` are stored in separate memory slots.

const strictSet = new Set();
strictSet.add(1);
strictSet.add("1");
strictSet.add(1); // Ignored. The engine sees the exact same primitive value.
console.log("Strict Set : ", strictSet); // Set(2) { 1, '1' }
console.log("Strict Set Size: ", strictSet.size); // 2

console.log("===== Reference Trap (Object Uniqueness)");
// ------------------------------------------
// Sets track Reference Types by their Heap Pointer, NOT their content.
const objectSet = new Set();
const userA = {id: 99};
const userB = {id: 99};
// We add both objects. Because they were created separately,
// they have completely different memory addresses in the Heap.
objectSet.add(userA);
objectSet.add(userB);
console.log("Object Set : ", objectSet); // Set(2) { { id: 99 }, { id: 99 } }
console.log("Object Set Size: ", objectSet.size); // 2 (Both were added!)

// TRAP: Trying to check existence with a new object literal ALWAYS fails.
console.log(objectSet.has({id: 99})); // false

console.log("===== INITIALIZATION & THE DEDUPLICATION TRICK");
// ------------------------------------------
// You can initialize a Set with any Iterable (Array, String, Map).

// The absolute fastest way in JS to remove duplicates from an Array.
const dupes = [1, 2, 3, 4, 4, 5, 5, 5];

// Step 1: Pass array into Set (instantly destroys duplicates).
const uniqueSet = new Set(dupes);

// Step 2: Unpack the Set back into a new Array.
const cleanArray = [...uniqueSet];
console.log("Clean Array : ", cleanArray); // [ 1, 2, 3, 4, 5 ]

console.log("===== CRUD OPERATIONS ($O(1)$ Time Complexity)");
// ------------------------------------------
const firewalls = new Set(["Port_80", "Port_443"]);
// CREATE: .add(value)
// Returns the Set itself, allowing chaining.
firewalls.add("Port_22").add("Port_21");
console.log("Firewalls : ", firewalls); // Set(4) { 'Port_80', 'Port_443', 'Port_22', 'Port_21' }

// READ / CHECK: .has(value)
// Returns true/false. Vastly faster than array.includes() for large datasets.
console.log("Has Port_80? ", firewalls.has("Port_80")); // true

// DELETE: .delete(value)
// Returns `true` if successful, `false` if value didn't exist.
const didDelete = firewalls.delete("Port_22");
console.log("Was Port_22 deleted? ", didDelete); // true

// SIZE: .size
// A property (not a method). Tracks size mathematically.
console.log("Active Firewalls: ", firewalls.size); // 3

// CLEAR: .clear()
// Empties the Set and frees Heap memory.
firewalls.clear();

console.log("===== EXHAUSTIVE ITERATION");
// ------------------------------------------
// Sets remember the exact order of insertion.
const roles = new Set(["Guest", "User", "Admin"]);

// A. Standard For...Of
for (const role of roles) {
  console.log("Role: ", role);
}

// B. Functional ForEach
// Syntax: .forEach((value, valueAgain, set) => {})
// NOTE: Because Sets have no keys, the engine passes the `value` TWICE to keep the API consistent with Map.forEach((value, key)).
roles.forEach((role, roleAgain, set) => {
  // roles.forEach(role => {
  console.log("Active Role: ", role);
  console.log("Role Again: ", roleAgain); // same as role
  console.log("Set: ", set); //Set:  Set(3) { 'Guest', 'User', 'Admin' }
});

// C. Iterable Extractors (Rarely used, but exist for Map compatibility)
console.log("Keys: ", [...roles.keys()]); // [ 'Guest', 'User', 'Admin' ]
console.log("Values: ", [...roles.values()]); // [ 'Guest', 'User', 'Admin' ]
console.log("Entries: ", [...roles.entries()]); // [ [ 'Guest', 'Guest' ], [ 'User', 'User' ], [ 'Admin', 'Admin' ] ]

console.log("===== MODERN ES2024 SET COMPOSITION (New Standard)");
// ------------------------------------------
// Modern V8 engines now support mathematical set operations natively.
// If you are in an older environment, you must polyfill these.
const backendDevs = new Set(["Anand", "Sarah", "Mike"]);
const frontendDevs = new Set(["Anand", "Chris", "Sarah"]);

// 1. INTERSECTION (Who is in BOTH Sets?)
const fullStack = backendDevs.intersection(frontendDevs); // ["Anand", "Sarah"]

// 2. UNION (Combine both, destroy duplicates)
const allDevs = backendDevs.union(frontendDevs); // ["Anand", "Sarah", "Mike", "Chris"]

// 3. DIFFERENCE (Who is ONLY in Backend, not Frontend?)
const pureBackend = backendDevs.difference(frontendDevs); // ["Mike"]

// 4. SYMMETRIC DIFFERENCE (Who is strictly one or the other, but not Full Stack?)
const specializedDevs = backendDevs.symmetricDifference(frontendDevs); // ["Mike", "Chris"]
