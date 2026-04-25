// ==========================================
// PART I: THE DARK AGES (The Problem)
// ==========================================

// Before 2015, the V8 Engine only had one way to handle asynchronous code: passing a function (a callback) into another function and hoping it gets executed later. This created two massive architectural failures.
// 1. Callback Hell (The Pyramid of Doom)
// 2. Inversion of Control

// Promises fix this. A Promise does not pass your code to a 3rd party.
// Instead, the 3rd party returns a "Receipt" (The Promise Object) back to YOU.

// ===== 1. Callback Hell (The Pyramid of Doom)
// -----------------------------------
// Definition: A visual and structural collapse of your code that occurs when you have to perform multiple asynchronous tasks in sequence.

// Because each step relies on the data from the previous step, you are forced to nest functions inside of functions.

// It isn't just "ugly to read." It creates a massive Closure nightmare. Variables from the top of the pyramid are trapped in memory all the way down, making it incredibly easy to accidentally mutate the wrong variable or cause memory leaks. It also makes try/catch blocks nearly impossible to route correctly.

const processOrderLegacy = orderId => {
  // ❌ The Pyramid of Doom
  checkInventory(orderId, inventory => {
    processPayment(inventory.price, paymentReceipt => {
      generateShippingLabel(paymentReceipt, label => {
        sendEmailToUser(label, success => {
          console.log("Order complete, but the code is unreadable.");
        });
      });
    });
  });
};

// ===== 2. Inversion of Control (The Fatal Trust Issue)
// -----------------------------------
// Definition: The act of surrendering the execution rights of your code to a third-party script. When you pass a callback to a 3rd-party library, you surrender control of your code.
// What if the library calls your function twice? What if it never calls it?

const chargeCreditCard = amount => console.log(`Charged $${amount}`);

// We hand our function over to a legacy library...
// What if legacyStripeAPI has a bug and runs our callback TWICE? We double-charge the user!
// legacyStripeAPI.process(50, chargeCreditCard);

// ==========================================
// PART II: THE PROMISE ENGINE (The Solution)
// ==========================================
// A Promise is a JavaScript Object representing an eventual completion or failure of an asynchronous operation and its resulting value.
// Think of it as a restaurant buzzer. You place an order, they give you a buzzer. The buzzer is not your food, but it is a guarantee that you will either get your food or an explanation of why the kitchen caught fire.
// It returns control to YOU. The 3rd party gives you a Promise, and YOU decide what to do.

// It has 3 Immutable Memory States:
// 1. PENDING: The initial state. The network request is in flight.
// 2. FULFILLED: Succeeded (locked with data).
// 3. REJECTED: Failed (locked with an Error).

// The State Mutators: resolve and reject
// These are two internal V8 Engine functions handed to you when you construct a new Promise. They are the only way to change the state of the Promise.

// resolve(data): this function instantly locks the Promise state to Fulfilled and binds the data payload to the Promise object.

// reject(error): this function instantly locks the Promise state to Rejected and binds the error object (the stack trace) to the Promise.

const requestBankData = userToken => {
  // We construct the Promise and pass in the Executor function.
  return new Promise((resolve, reject) => {
    console.log("1. Promise is PENDING...");

    setTimeout(() => {
      if (userToken === "VALID") {
        resolve({balance: 5000, accountId: "A-99"});
      } else {
        reject(new Error("Invalid Authentication"));
      }
    }, 1000);
  });
};

// ==========================================
// PART III: CONSUMING THE PROMISE (The Microtask Hooks)
// ==========================================
// When a Promise resolves/rejects, these hooks push your code directly into the Microtask Queue (The VIP Lounge of the Event Loop).

// .then(callback)
// The Success Hook. Fires when FULFILLED.
// You pass a function into .then(). If the Promise state turns to Fulfilled, the V8 Engine takes the data payload from the resolve() function, passes it into your callback, and pushes it to the Microtask Queue to be executed.
// The Chain Reaction: Every .then() returns a BRAND NEW Promise.

// .catch(callback)
// The Error Boundary Hook
// If the Promise state turns to Rejected (or if any .then block in the chain suddenly throws an Error), the V8 Engine skips all remaining .then blocks and immediately routes the Panic to the .catch() block.

// .finally(callback)
// The Cleanup Hook.
// This code will execute regardless of whether the Promise was Fulfilled or Rejected. It receives no data and no errors. It is used strictly for architectural cleanup—like closing a database connection, stopping a loading spinner, or clearing a timeout.

console.log("\nA. Synchronous Start");

requestBankData("VALID")
  // 1. .then() -> The Success Hook. Fires when FULFILLED.
  // Notice how we chain them! Every .then() returns a BRAND NEW Promise.
  .then(data => {
    console.log("B. Hook Triggered! Balance:", data.balance);
    return data.balance - 1000; // Passed to the next .then
  })
  .then(newBalance => {
    console.log("C. Chain Reaction! New Balance:", newBalance);
  })
  // 2. .catch() -> The Error Boundary Hook.
  // Catches a REJECTED state OR any error thrown inside the .then blocks above.
  .catch(error => {
    console.error("X. Transaction Panic Routed:", error.message);
  })
  // 3. .finally() -> The Cleanup Hook.
  // Runs no matter what. Perfect for closing database connections or hiding UI spinners.
  .finally(() => {
    console.log("D. Secure Connection Closed.");
  });

console.log("E. Synchronous End");

// ==========================================
// PART IV: CONCURRENCY ARSENAL (Advanced Architecture)
// ==========================================

// Dummy data fetchers
const fetchUser = () =>
  new Promise((resolve, reject) => setTimeout(() => resolve("Anand"), 1500));
const fetchPosts = () =>
  new Promise((_, reject) => setTimeout(() => reject("DB Timeout"), 1000));
const slowTask = () =>
  new Promise(resolve => setTimeout(() => resolve("Slow Data"), 4000));

// ===== 1. Promise.all (The Fail-Fast Array)
// Runs all concurrently. Returns data ONLY IF EVERY Promise succeeds.
// If even one Promise fails, the ENTIRE thing fails immediately. and goes to the .catch block.
Promise.all([fetchUser(), fetchUser()]) // Both succeed
  .then(results => console.log("[Promise.all]: Success:", results)) // ["Anand", "Anand"]
  .catch(err => console.error("[Promise.all]: Failed:", err));

// ===== 2. Promise.allSettled (The Resilient Array)
// Runs all concurrently. NEVER detonates. Waits for all to finish, then gives you an exact status report of what lived and what died.
Promise.allSettled([fetchUser(), fetchPosts()]).then(results => {
  console.log("[Promise.allSettled]: Report:");
  // [ { status: 'fulfilled', value: 'Anand' }, { status: 'rejected', reason: 'DB Timeout' } ]
  console.log(results);
});

// ===== 3. Promise.race (The Timeout Trap)
// Whichever Promise finishes FIRST (success or fail) wins. The rest are ignored.
// ARCHITECTURE TRICK: Racing a slow network request against a timer!
const timeoutTrap = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Request took too long!")), 2000);
});

Promise.race([slowTask(), timeoutTrap])
  .then(data => console.log(data))
  .catch(error => console.error("[Promise.race]:", error.message)); // The trap wins!
