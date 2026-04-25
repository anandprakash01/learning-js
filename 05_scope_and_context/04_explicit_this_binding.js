// The "this" keyword never looks at your local variables. It does not care about const, let, or var. It only looks at the Object Context that invoked the function.

// JavaScript provides three built-in methods on the Function prototype to forcefully override the Dynamic Scope of "this".

// .call(targetContext, arg1, arg2): Executes the function immediately. The first argument you pass becomes this. The subsequent arguments are passed into the function normally.

// .apply(targetContext, [arg1, arg2]): Executes the function immediately. It is identical to .call(), except it takes the function's arguments as a single Array. (Historically used before the Spread Operator ... existed).

// .bind(targetContext): The Enterprise Standard. It does not execute the function immediately. Instead, it generates a brand new copy of the function where "this" is permanently locked to the target object. It cannot be overridden again.

console.log("===== The Disconnected Function");
// ------------------------------------------
// We have a standalone function that expects a `this.databaseName` to exist.
// Because it is standalone, `this` currently points to the Global object.

function connectedDatabase(port, user) {
  console.log(`Connecting to ${this.databaseName} on port ${port}`);
}
connectedDatabase(8080, "Anand");

// We have two separate context objects.
const primaryContext = {databaseName: "primaryContext_Cluster"};
const fallbackContext = {databaseName: "fallbackContext_DB"};

console.log("===== Immediate Execution (.call)");
// ------------------------------------------
// We force the engine to execute `connectDatabase`, but we inject `primaryContext` as `this`.
// Arguments are passed one by one, separated by commas.
connectedDatabase.call(primaryContext, 5000, "admin_anand");
// Output: "Connecting to primaryContext_Cluster on port 27017 as admin_anand..."
connectedDatabase(3000, "Anand");

console.log("===== Array Execution (.apply)");
// ------------------------------------------
// Identical to .call, but arguments must be in an array.
// Highly useful if your arguments are already stored in an array variable.
const connectionArgs = [5432, "read_only_user"];
connectedDatabase.apply(fallbackContext, connectionArgs);
// Output: "Connecting to fallbackContext_DB on port 5432 as read_only_user..."

console.log("===== Permanent Override (.bind)");
// ------------------------------------------
// .bind() is crucial for asynchronous callbacks. It creates a new function.
const parentObject = {
  databaseName: "Redis_Cache_Instance",

  // This method returns a function that simulates an async callback
  createConnectionHandler: function () {
    const databaseName = "handler_instance";
    // The this keyword never looks at your local variables. It does not care about const, let, or var. It only looks at the Object Context that invoked the function.
    const standaloneCallback = function () {
      // If we don't bind this, the engine will lose context when the callback eventually runs later.
      console.log(`Callback resolving for: ${this.databaseName}`);
    };
    standaloneCallback(); //undefined
    // We generate a NEW function, permanently locking `this` to parentObject.
    const lockedCallback = standaloneCallback.bind(this);

    return lockedCallback;
  },
};

// We get the locked function back.
const safeHandler = parentObject.createConnectionHandler();
// Even though we execute it completely detached from the object, it remembers its context.
safeHandler();
// Output: "Callback resolving for: Redis_Cache_Instance"
