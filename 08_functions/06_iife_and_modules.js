// Before ES6 introduced let, const, and native import/export modules, JavaScript had a massive architectural flaw: everything you wrote lived in the Global Execution Context. If two different developers created a variable named let config = {}, the entire application would crash due to memory collisions.
// To survive, Senior Engineers invented a hack using the V8 Engine's parsing rules: The Immediately Invoked Function Expression (IIFE). By forcing a function to run the exact millisecond it is read, and wrapping it in a Closure, they created impenetrable, private memory vaults.

console.log("===== Global Memory Trap");
// ------------------------------------------
// When you declare a variable at the top level of a file, it gets attached directly to the Global Object (`window` in browsers, `global` in Node).

let systemStatus = "VULNERABLE";
// Any other script loaded into the HTML can now read, mutate, or destroy `systemStatus`.

console.log("===== IIFE Solution (Instant Garbage Collection)");
// ------------------------------------------
// IIFE stands for Immediately Invoked Function Expression.
// Goal: Create a temporary Lexical Environment, run the code, and let the Garbage Collector destroy it instantly, leaving zero footprint in the Global Scope.

// TRAP: The Parser Trap
// function() { let secret = 1; }()
// CRASH: SyntaxError. If a line starts with the word `function`, the V8 Parser assumes it is a Declaration. Declarations CANNOT be invoked instantly.

// FIX: The Grouping Operator ( )
// By wrapping the function in parentheses, we force the V8 Engine to treat it as an Expression. Then, we add `()` at the end to execute it instantly.

(function () {
  // The engine creates a brand new, isolated Lexical Environment.
  const tempSecret = "SK_992_ABC";
  console.log("IIFE Executed. Bootstrapping with: ", tempSecret);
})(); // <-- The execution parentheses

// The Call Stack pops the IIFE. The Garbage Collector destroys `tempSecret`.
// console.log(tempSecret); // ReferenceError: tempSecret is not defined

console.log("===== Modern Syntax (Arrow IIFEs)");
// ------------------------------------------
// You can build IIFEs using ES6 Arrow Functions for cleaner syntax.
// Note: It is mandatory to prefix it with a semicolon `;` in enterprise codebases to prevent catastrophic ASI (Automatic Semicolon Insertion) bugs if the previous line wasn't closed.
(() => {
  const isModern = true;
  if (isModern) console.log("Modern Arrow IIFE running.");
})();

console.log("===== Passing Arguments to IIFEs");
// ------------------------------------------
// We can pass data from the Global Scope *into* the isolated IIFE vault.
// This is exactly how jQuery `$`, `window`, and `document` were safely injected into libraries without causing global conflicts.

const globalConfig = {theme: "Dark"};

((config, engineName) => {
  // Inside this vault, `config` is safely mapped to the global object.
  console.log(`Booting ${engineName} Engine with ${config.theme} theme.`);
})(globalConfig, "V8 Turbo");

// ==========================================
//THE REVEALING MODULE PATTERN
// ==========================================
// This is the absolute climax of pre-ES6 JavaScript architecture.
// We combine an IIFE (for instant execution) with a Closure (to trap memory) to create an Object that has Private Variables and Public Methods.

const PaymentGateway = (function () {
  // 1. PRIVATE MEMORY (The Vault)
  // Because this is inside the IIFE, it is completely invisible to the outside world.
  let _apiKey = "PK_LIVE_998123";
  let _transactionCount = 0;

  // 2. PRIVATE LOGIC
  const _validateCard = cardStr => {
    return cardStr.length === 6;
  };

  // 3. PUBLIC API (The Closure)
  // We return a literal object. This object contains function pointers.
  // Because these functions were created INSIDE the IIFE, they form a Closure over `_apiKey`, `_transactionCount`, and `_validateCard`, keeping them alive!
  return {
    process: (amount, card) => {
      if (!_validateCard(card)) return "Transaction Failed: Invalid Card";

      _transactionCount++;
      return `Processed $${amount} via key ${_apiKey}. Total TXs: ${_transactionCount}`;
    },
    getStats: function () {
      return `Total Transactions today: ${_transactionCount}`;
    },
  };
})(); // <-- Execute immediately!

// THE EXECUTION:
// PaymentGateway is NOT a function. It is the OBJECT that the IIFE returned.

console.log(PaymentGateway.process(150.0, "411111"));
// "Processed $150 via key PK_LIVE_998123. Total TXs: 1"

console.log(PaymentGateway.getStats());
// "Total Transactions today: 1"

// THE SECURITY CHECK:
console.log(PaymentGateway._apiKey); // undefined (The Vault is impenetrable!)
