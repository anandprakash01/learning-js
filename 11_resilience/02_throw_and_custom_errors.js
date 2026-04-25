// The `throw` keyword intentionally detonate the execution context and force the engine to route the bad data into catch blocks.

// ==========================================
// PART I: THE `throw` KEYWORD PHYSICS
// ==========================================
// The `throw` keyword acts like an emergency brake.
// The exact millisecond the V8 Engine reads it, the current function halts, no further lines are executed, and the engine begins unwinding the Call Stack looking for a `catch` block.

const processWithdrawal = amount => {
  if (amount <= 0) {
    // THE MISTAKE: Throwing a string.
    // throw "Amount must be greater than zero.";
    // Why is this bad? Because strings DO NOT contain a Stack Trace (memory coordinates).

    // THE ENTERPRISE STANDARD: Throwing an Error Object.
    // This generates a physical trace of exactly which file and line caused the panic.
    throw new Error("Amount must be greater than zero.");
  }

  return `Withdrawing $${amount}`;
};

// ==========================================
// PART II: CUSTOM ERROR CLASSES (OOP Integration)
// ==========================================
// In a massive application, a generic `Error` is not helpful.
// Did the network fail? Did validation fail? Did the database time out?
// We use ES6 Classes to `extend` the native V8 Error object.

// 1. The Validation Error
class ValidationError extends Error {
  constructor(message, invalidField) {
    // We pass the message up to the parent `Error` class so it generates the Stack Trace
    super(message);
    this.name = "ValidationError";
    this.invalidField = invalidField; // Custom data payload!
  }
}

// 2. The Database Error
class DatabaseError extends Error {
  constructor(message, queryCode) {
    super(message);
    this.name = "DatabaseError";
    this.queryCode = queryCode;
  }
}

// ==========================================
// PART III: ENTERPRISE ERROR ROUTING
// ==========================================
// Now we can use the `instanceof` operator to route the panic to the correct recovery system!

const registerUser = user => {
  try {
    console.log("1. Validating payload...");
    if (!user.email) {
      // We intentionally detonate a specific type of error
      throw new ValidationError("Email is completely missing.", "email");
    }

    console.log("2. Saving to database...");
    // Simulating a DB failure
    if (user.email === "test@test.com") {
      throw new DatabaseError("Connection refused by cluster.", "ERR_CONN_503");
    }

    return "User Registered Successfully";
  } catch (error) {
    // THE ROUTER: We analyze the memory prototype of the error object.

    if (error instanceof ValidationError) {
      console.warn(
        `[UI WARNING]: User provided bad data in field: ${error.invalidField}`,
      );
      return {status: 400, message: "Please fix your input."};
    } else if (error instanceof DatabaseError) {
      console.error(`[PAGERDUTY ALERT]: DB Offline. Code: ${error.queryCode}`);
      return {status: 500, message: "Internal Server Error. Try again later."};
    } else {
      // The "Unknown Panic" fallback
      console.error(`[CRITICAL PANIC]: Unknown Error -> ${error.message}`);
      return {status: 500, message: "System Failure."};
    }
  }
};

// ==========================================
// THE EXECUTION
// ==========================================

console.log("--- Scenario A: Bad User Input ---");
console.log(registerUser({name: "Anand"}));
// Routes to ValidationError. Returns 400.

console.log("\n--- Scenario B: Database Crash ---");
console.log(registerUser({name: "Anand", email: "test@test.com"}));
// Routes to DatabaseError. Returns 500.
