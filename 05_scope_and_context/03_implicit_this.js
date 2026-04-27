// The "this" uses Dynamic Scoping. It does not care where the function was written. It only cares about how the function is called at runtime. The engine recalculates the value of this every single time the function is executed.

// There are 4 rules for how this is calculated. we cover the most common one: Implicit Binding.
// The Golden Rule of Implicit Binding:
// At the exact moment a function is invoked, look at the code. If there is a dot . immediately before the function name, the object to the left of that dot becomes this. If there is no dot, the engine panics and defaults to the Global Object (which usually causes undefined errors).

console.log("===== The Parent Object");
// ------------------------------------------
const parentObject = {
  name: "Parent Object",

  printContext: function () {
    // 'this' is completely blank right now.
    // The engine waits until the function is actually called to fill it in.
    console.log("Current Context: " + this.name);
  },
};

console.log("===== The Successful Implicit Bind");
// Look exactly to the left of the dot at the moment of invocation.
// Because 'parentObject' is to the left of the dot, 'this' becomes 'parentObject'.
parentObject.printContext(); // "Current Context: Parent Object"

console.log("===== The Nested Object");
// ------------------------------------------
const grandParentObject = {
  name: "Grandparent",
  childObject: {
    name: "Child",
    printContext: function () {
      console.log("Current Context: " + this.name);
    },
  },
};
// RULE: Only the object IMMEDIATELY to the left of the dot counts.
grandParentObject.childObject.printContext(); // "Current Context: Child"

console.log("===== The Lost Context Trap (Critical Bug)");
// This is the #1 cause of 'this' bugs in React and enterprise JavaScript.
// We create a new standalone variable, and we point it at the function.
// Note: We are NOT calling the function here (no parentheses). We are just passing the reference.
const detachedFunction = parentObject.printContext;

// Now, we invoke the standalone function.
// Look to the left of the function call. There is no dot! There is no object!
// Because there is no object, the engine binds `this` to the Global Window object.
// The Global Window does not have a 'name' property.

console.log("--- Executing Detached Function ---");
detachedFunction(); // "Current Context: undefined"
