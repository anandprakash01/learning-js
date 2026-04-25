// ==========================================
// PART I: THE V8 ENGINE PHYSICS (Unwinding)
// ==========================================
// When a fatal error occurs, normal execution instantly stops.
// The V8 Engine enters a state called "Panic". It looks at the current function on the Call Stack and asks: "Is there a safety net (a try/catch) here?"
// If NO, it destroys the function, pops it off the stack, and checks the function below it.
// This is called "Unwinding the Stack".
// If it unwinds all the way to the Global Context without finding a net, your entire Node.js server crashes.

const dangerousParse = jsonString => {
  // JSON.parse physically cannot process malformed strings. It throws a fatal Exception.
  return JSON.parse(jsonString);
};

// ==========================================
// PART II: THE SAFETY NET (try/catch)
// ==========================================
const executeSafeParse = data => {
  // 1. The Engine attempts the code inside the `try` block.
  try {
    console.log("1. Attempting extraction...");
    const result = dangerousParse(data);

    // If dangerousParse crashes, the engine NEVER reaches this line
    console.log("2. Extraction successful!");
    return result;
  } catch (error) {
    // 2. The Engine immediately routes the Panic to the `catch` block.
    // It passes an 'Error Object' containing the Stack Trace (the exact memory lines of the crash).
    console.log("--- SYSTEM RECOVERED ---");
    console.log("Error Name: ", error.name); // e.g., "SyntaxError"
    console.log("Error Message: ", error.message); // e.g., "Unexpected token u in JSON..."

    // We gracefully return a fallback value so the app keeps running.
    return {status: "Fallback Data"};
  }
};

const badData = undefined;
console.log("Final Output: ", executeSafeParse(badData));

// ==========================================
// PART III: THE GUARANTEE (finally)
// ==========================================
// Enterprise applications open connections (Databases, File Streams, Network Sockets).
// If a crash happens, those connections get left open in RAM, causing massive Memory Leaks.
// The `finally` block is a V8 Engine guarantee: THIS CODE WILL RUN NO MATTER WHAT.

const queryDatabase = () => {
  let dbConnection = "OPEN";

  try {
    console.log(`\nConnecting... Status: ${dbConnection}`);
    // Simulating a database crash
    throw new Error("Database timeout after 5000ms");
  } catch (error) {
    console.log(`[LOGGING TO DATADOG]: ${error.message}`);
    // Even if we put a `return` statement right here, `finally` STILL runs before the function exits!
    return "Query Failed";
  } finally {
    // This is the cleanup zone. It prevents memory leaks.
    dbConnection = "CLOSED";
    console.log(`Cleanup Complete. Connection: ${dbConnection}`);
  }
};

queryDatabase();

// ==========================================
// PART IV: ES2019 OPTIONAL CATCH BINDING
// ==========================================
// Sometimes, you know code might fail, but you don't actually care WHY it failed.
// You just want to set a default value.
// In modern JS, you no longer have to declare the `(error)` variable if you aren't going to use it.

const isFeatureSupported = () => {
  try {
    // Let's pretend this is a new browser API that might not exist
    return window.experimentalHardwareAPI.isActive();
  } catch {
    // Notice: No `(error)` parameter!
    // We silently absorb the failure and return false.
    return false;
  }
};
console.log(isFeatureSupported());
