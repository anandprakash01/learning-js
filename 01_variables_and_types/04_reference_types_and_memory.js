// There are three primary Reference Types in JavaScript: Objects, Arrays, and Functions. (Technically, Arrays and Functions are just specialized Objects under the hood).
// Because these data structures can grow and shrink dynamically, the V8 engine cannot store them directly on the Call Stack. Instead, it uses The Heap—a large, unstructured pool of memory.

// Here is the critical, application-breaking difference between Primitives and References:

// Copying Primitives (By Value): When you copy a primitive, the engine creates a brand new, independent clone of that data. Changing the clone does not affect the original.

// Copying References (By Pointer): When you create an object, the data goes into the Heap, but the variable on your Stack only holds a pointer (a memory address) to that data. When you copy an object to a new variable, you are only copying the pointer, not the data.
console.log("===== The Pointer Trap");
// ------------------------------------------
const originalConfig = {environment: "Production", port: 443};

// DANGER: We are not copying the data. We are passing the memory address.
const testConfig = originalConfig;

// We mutate 'testConfig', assuming 'originalConfig' is safe.
testConfig.environment = "Localhost";

// They share the exact same Heap memory.
console.log(originalConfig.environment); // "Localhost"
console.log(testConfig.environment); // "Localhost"

console.log("===== The Enterprise Solution (Shallow Copy)");
// ------------------------------------------
const userData = {status: "Online", region: "India"};
// We use the Spread Operator (...) to extract the properties and place them into a BRAND NEW object in the Heap. A new object means a new memory pointer.
const backupData = {...userData};
backupData.status = "Offline";

// Safe. Predictable. The state is isolated.
console.log(userData.status); // "Online"
console.log(userData.status); // "Offline"

console.log("===== Arrays are Objects (The same rules apply)");
// ------------------------------------------
const activeUsers = ["Anand", "Isha"];

// Creating a new pointer to the SAME array in the Heap
const adminUsers = activeUsers;
adminUsers.push("Raj");

// Both variables reflect the mutation
console.log(activeUsers); // ["Anand", "Isha", "Raj"]

// Safe Array Copy
const isolatedUsers = [...activeUsers];
isolatedUsers.push("Suresh");

console.log(activeUsers); // ["Anand", "Isha", "Raj"] (Unchanged)
console.log(isolatedUsers); // ["Anand", "Isha", "Raj", "Suresh"]
