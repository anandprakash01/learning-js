// ==========================================
// PART I: CALLBACK MECHANICS (Function Pointers)
// ==========================================
// A Callback is simply a function passed into another function as an argument.
// Under the hood, you are not passing the logic; you are passing a Hexadecimal memory pointer to where that function lives in the Heap.

// 1. Synchronous Callbacks (Executes immediately on the Call Stack)
function processData(dataset, formatterCallback) {
  console.log("1. Processing Data...");
  // We invoke the pointer we received
  return formatterCallback(dataset);
}

const toUpper = str => str.toUpperCase();

console.log("2. Result: ", processData("admin_user", toUpper));
// Output: "1. Processing Data...", then "2. Result: ADMIN_USER"

// 2. Asynchronous Callbacks (Escaping the Call Stack)
// setTimeout takes our callback pointer and hands it to the Web API.
// It will be executed LATER, after the Call Stack is empty.
console.log("A. Starting...");
setTimeout(() => console.log("B. Executing Async Callback..."), 1000);
console.log("C. Finished setup.");
// Output Order: A, C, (1 second delay), B.

// ==========================================
// PART II: CLOSURES & GARBAGE COLLECTION EVASION
// ==========================================
// Normally, when a function finishes running, it is popped off the Call Stack, and all of its internal variables are instantly destroyed by the Garbage Collector to free up memory. A Closure is a hack into this system. It is a function that refuses to let its memory be destroyed.

// DEFINITION: A Closure happens when a function is bundled together with its surrounding state (Lexical Environment). It "closes over" the variables from its outer scope, remembering them even after the outer function has died.

console.log("===== Memory (How Closures Work)");
// ------------------------------------------
function secureVault(initialPassword) {
  // 1. When secureVault runs, `password` is created in memory.
  let password = initialPassword;
  let attemptCount = 0;

  // 2. We return a brand new Arrow Function.
  // This inner function creates a "Closure" over `password` and `attemptCount`.
  return guess => {
    attemptCount++;
    if (guess === password) return `Access Granted on attempt ${attemptCount}.`;
    return `Access Denied. Attempts: ${attemptCount}`;
  };
}

// 3. We execute secureVault(). It finishes and is POPPED OFF the Call Stack.
// By standard memory rules, `password` and `attemptCount` should be destroyed by the Garbage Collector.
const tryLogin = secureVault("Alpha_123");
// 4. BUT, because `tryLogin` (the inner function) still references them, the V8 Engine moves them to the Heap and keeps them alive permanently!
console.log(tryLogin("password")); // "Access Denied. Attempts: 1"
console.log(tryLogin("Alpha_123")); // "Access Granted on attempt 2."

console.log("===== Enterprise Use Case: True Data Encapsulation (Privacy)");
// ------------------------------------------
// In older JavaScript (before ES6 Classes and `#` private fields), Closures were the ONLY way to create private variables that other developers couldn't mutate.
const createBankAPI = initialBalance => {
  let balance = initialBalance; // Private memory state

  return {
    deposit: amount => {
      balance += amount;
      return `Deposited ${amount}. New balance: ${balance}`;
    },
    withdraw: amount => {
      if (amount > balance) return "Insufficient funds.";
      balance -= amount;
      return `Withdrew ${amount}. Remaining: ${balance}`;
    },
    getBalance: () => balance, // Read-only access
  };
};
const myAccount = createBankAPI(500);
console.log(myAccount.deposit(200)); // "Deposited 200. New balance: 700"
console.log(myAccount.getBalance()); // 700
console.log(myAccount.withdraw(100)); // "Withdrew 100. Remaining: 600"
// THE VAULT IS LOCKED:
// There is absolutely no physical way to do `myAccount.balance = 1000000;`.
// The variable is permanently trapped inside the Closure scope.

// ==========================================
// PART III: THE CLASSIC CLOSURE LOOP TRAP
// ==========================================
// This is the most famous Senior Engineer interview question.
// It proves whether you understand how Closures interact with the Event Loop.
function runBuggyLoop() {
  // We use `var`. `var` is function-scoped. It creates ONE single variable memory block.
  for (var i = 1; i <= 3; i++) {
    setTimeout(() => {
      console.log(`Buggy Loop - i is: ${i}`);
    }, i * 1000);
  }
  // By the time the async setTimeouts actually run (1, 2, and 3 seconds later),
  // the loop has already finished, and the single `i` variable has mutated to 4.
  // OUTPUT: 4, 4, 4
}

function runSafeLoop() {
  // We use `let`. `let` is block-scoped.
  // Every single iteration of the loop creates a BRAND NEW variable in memory.
  for (let i = 1; i <= 3; i++) {
    // The callback creates a separate Closure around each distinct `i` variable.
    setTimeout(() => {
      console.log(`Safe Loop - i is: ${i}`);
    }, i * 1000);
  }
  // OUTPUT: 1, 2, 3
}

runSafeLoop();

// To answer why it happens, we have to look at the ECMAScript standard (the law of JavaScript). To answer how it happens, we have to look at how the V8 Engine’s JIT Compiler interprets that law to avoid destroying your computer's memory.

// Here is the microscopic breakdown of the let loop anomaly.

// 1. The "Why": The TC39 Committee's Hack
// Before ES6 (2015), the var loop closure bug was the single most hated quirk in JavaScript. When the TC39 committee (the architects of JS) introduced let, their primary goal was to fix this bug.

// They couldn't change how var worked without breaking millions of legacy websites. Instead, they wrote a highly specific, exceptional rule into the ECMAScript Specification just for let (and const) inside for loops.

// The rule dictates: If a for loop uses a lexical declaration (let), the engine must bind the variable per-iteration, not per-loop.

// 2. The "How": The Hidden Value Copy
// When the V8 Engine encounters your for (let i = 1; i <= 3; i++) loop, it performs a hidden sequence of memory operations that you cannot see in the code.

// Here is exactly how the engine translates your loop into memory blocks (Lexical Environments):

// Step 1: The Loop Setup
// V8 creates a baseline Lexical Environment for the loop. It allocates let i = 1 in memory pointer, Let's call this pointer 0x100.

// Step 2: Iteration 1 Execution
// The block runs. If a Closure (like setTimeout) is created, it traps pointer 0x100.

// Step 3: The Engine's Secret "Copy-Forward" Step
// This is the magic. Before the loop evaluates the i++ for the next cycle, V8 pauses and does this:

// It creates a brand new Lexical Environment (Pointer 0x101).

// It looks at the old memory (0x100), grabs the value 1, and physically copies it into the new memory (0x101).

// Then it runs the i++ mutation on the new memory block, turning it into 2.

// Step 4: Iteration 2 Execution
// The block runs again, now using pointer 0x101 (value 2). The next setTimeout closure traps 0x101.

// The engine repeats this "Create -> Copy Old Value -> Mutate -> Execute" chain for every single iteration.

// 3. The V8 TurboFan Reality (The Optimization)
// As an Architect, you should immediately spot a massive performance flaw in this specification.

// If you write a loop that runs 1,000,000 times:
// for (let i = 0; i < 1000000; i++) { sum += i; }

// If V8 strictly followed the ECMAScript rule, it would have to physically allocate and destroy 1,000,000 separate Lexical Environments on the Heap. Your browser would instantly run out of memory and crash.

// So how does JS survive? Enter the TurboFan JIT Compiler.

// The V8 compiler is incredibly smart. Before it runs your loop, it scans the code inside the { } block looking for a specific threat: Escaping Closures.

// Scenario A: No Closures Detected
// If you are just doing math (sum += i), TurboFan says, "Nothing is trying to trap these variables." It completely ignores the ECMAScript rule. It optimizes the loop into raw, C-style machine code using a single CPU register for i. It runs at blazing speed with almost zero memory footprint.

// Scenario B: Closures Detected (The setTimeout Example)
// If TurboFan scans the block and sees a callback function (setTimeout, addEventListener, etc.) that references i, it says, "Warning: A closure is escaping the loop. It needs to remember 'i'." Only then does TurboFan hit the brakes, disable the optimization, and literally carve out the separate Lexical Environments (the separate memory blocks) for every single iteration, ensuring your Closures have the exact snapshots they need.
