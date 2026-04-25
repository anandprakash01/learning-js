console.log("===== Pointer Reallocation");
// ------------------------------------------
// Destructuring DOES NOT mutate the original object or array.
// It creates brand new variables in the current Scope (Call Stack).
// If the extracted value is a Primitive (String, Number), it is a full copy.
// If the extracted value is a Reference Type (Array, Object), it copies the POINTER.
const systemData = {
  id: 99,
  status: "Active",
  config: {ram: "16GB"}, // Nested object in the Heap
};

// We extract 'status' (primitive) and 'config' (reference).
const {status, config} = systemData;

// Because 'config' is an Object, the destructuring only gave us a pointer.
config.ram = "64GB"; // We mutate the extracted variable.
// CATASTROPHIC BUG: Mutated the original `systemData` because they share the pointer!
console.log("Original System RAM: ", systemData.config.ram); // "64GB"

console.log("===== ARRAY DESTRUCTURING (Position-Based)");
// ------------------------------------------
// Arrays have no keys, so you must extract them based strictly on their INDEX position.
const serverNodes = ["Alpha", "Beta", "Gamma", "Delta"];

// Basic Extraction
const [primary, secondary] = serverNodes;
console.log(primary); // "Alpha"
console.log(secondary); // "Beta"

// Skipping Items (Using Commas)
// We want the 1st and 4th items. We leave empty commas for the ones we want to skip.
const [first, , , fourth] = serverNodes;
console.log(fourth); // "Delta"

// Default Values (The Undefined Safety Net)
// If the array doesn't have an item at that index, it defaults to undefined.
// We can provide a fallback value to prevent crashes.
const shortList = ["Alpha"];
const [main, backup = "No Backup"] = shortList;
console.log("Default Backup: ", backup); // "No Backup"

// Nested Array Destructuring
const gridCoordinates = [10, 20, [30, 40]];
const [x, y, [z1, z2]] = gridCoordinates;
console.log("Nested Z1: ", z1); // 30
console.log("Nested Z2: ", z2); // 40

// Enterprise Trick: Swapping Variables without a Temp Variable
let a = 10;
let b = 20;
[a, b] = [b, a]; // The engine instantly swaps their memory pointers.
console.log("Swapped: ", a, b); // 20, 10

console.log("===== OBJECT DESTRUCTURING (Key-Based)");
// ------------------------------------------
// Objects have keys, so position doesn't matter. You extract by the EXACT property name.
const dbConnection = {
  host: "localhost",
  port: 5432,
  user: "admin",
  timeout: 300,
};
// Basic Extraction
const {host, port} = dbConnection;
console.log(`Connecting to ${host}:${port}`);

// Aliasing (Renaming Variables on the fly)
// Syntax: { originalKey : newVariableName }
// Use Case: When a variable named 'host' already exists in your file and you want to avoid a naming collision.
const {host: dbHost, port: dbPort} = dbConnection;
console.log(`DB Host: ${dbHost}, DB Port: ${dbPort}`);

// Default Values
// If 'ssl' does not exist on the object, it becomes true.
const {user, ssl = true} = dbConnection;
console.log("SSL Enabled: ", ssl); // true

// Combined Aliasing AND Default Values
// Syntax: { originalKey : newName = defaultValue }
const {timeout: maxWaitTime = 5000} = dbConnection;
console.log("Connection Timeout: ", maxWaitTime); // 300 (Because it exists on the object)

// Nested Object Destructuring
const employee = {
  empId: 101,
  name: "Anand",
  department: {
    role: "Full Stack Developer",
    stack: "MERN",
  },
};
// We extract 'role' from inside the nested 'department' object.
// WARNING: This DOES NOT create a variable called 'department'. It only creates 'role'.
const {
  department: {role},
} = employee;
console.log("Nested Role: ", role); // "Full Stack Developer"

console.log("===== FUNCTION PARAMETER DESTRUCTURING (The React Standard)");
// Instead of passing a bulky object and accessing it inside the function via `params.id`,
// we destructure the object directly inside the function signature '()'.
const mockRequest = {
  route: "/api/users",
  method: "POST",
  payload: {name: "Anand"},
};
// Legacy Approach:
function handleRequest(req) {
  console.log(req.method);
}
handleRequest(mockRequest); // "POST"

// Modern Enterprise Approach (Self-Documenting Code):
function handleRequestModern({method, route, payload}) {
  console.log(`Executing ${method} request to ${route}`);
  console.log(`Data: ${payload.name}`);
}
handleRequestModern(mockRequest); // "Executing POST request to /api/users" and "Data: Anand"
