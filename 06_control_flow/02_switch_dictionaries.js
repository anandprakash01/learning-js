// The switch statement forces you to write bloated, repetitive code. Worse, it suffers from the Fall-Through Bug: if you forget to type the word break at the end of a case, the engine will accidentally execute the next case below it, leading to disastrous logic errors.

// In modern enterprise JavaScript, we ban the switch statement. Instead, we use an Object Dictionary (often called a Lookup Table or Hash Map).Because JavaScript Objects map a "Key" to a "Value" and retrieve it instantly in $O(1)$ time complexity (meaning it takes the exact same amount of time to find an item whether there are 5 items or 50,000 items), they are the perfect replacement for conditional routing.

const userRole = "ADMIN";
console.log("===== The Legacy Switch (BANNED)");
// ------------------------------------------
// This takes 13 lines of code. It is vulnerable to the missing 'break' bug.
// It is also imperative (it tells the engine *how* to assign the variable step-by-step).

let accessLevel;

switch (userRole) {
  case "GUEST":
    accessLevel = 1;
    break;
  case "USER":
    accessLevel = 2;
    break;
  case "ADMIN":
    accessLevel = 3;
    break;
  default:
    accessLevel = 0;
}
console.log("Legacy Switch Result: " + accessLevel);

console.log("===== The Enterprise Dictionary (Standard)");
// ------------------------------------------
// We define a strict configuration object. This is declarative.
// It is vastly easier to read, test, and maintain.
const roleDictionary = {
  GUEST: 1,
  USER: 2,
  ADMIN: 5,
};
// We use bracket notation to look up the key dynamically.
// If the key doesn't exist, it returns `undefined`, so we use the Logical OR (||) operator to provide a default fallback (0).

const modernAccessLevel = roleDictionary[userRole] || 0;

console.log("===== Advanced Routing (Executing Functions)");
// ------------------------------------------
// Dictionaries don't just hold numbers or strings. They can hold logic.
// This is how modern Redux reducers or API routing controllers are built.

const processPayment = () => "Connecting to Stripe API...";
const processRefund = () => "Reversing transaction...";
const processCancel = () => "Closing order...";

const actionType = "REFUND";

const actionRouter = {
  PAY: processPayment,
  REFUND: processRefund,
  CANCEL: processCancel,
};

// 1. Look up the function in the dictionary using the actionType.
const selectedAction = actionRouter[actionType];
// 2. If it exists, execute it. If not, return an error.
if (selectedAction) {
  console.log(selectedAction());
} else {
  console.log("Error: Unknown Action");
}
// This pattern is non-negotiable when building scalable systems. If you need to add 20 new roles tomorrow, you don't write 20 new if/else or case blocks. You just add them to the dictionary data structure.

// The Object as a "Dictionary"
// When we use an object not to describe a single thing, but to map a list of inputs (keys) to a list of outputs (values) for fast routing, we are using it as a Dictionary.
