// When the V8 Engine is executing a function and encounters a variable, it must figure out what data that variable holds. It performs a Variable Lookup using the Scope Chain.
// Here is the exact algorithmic rule the engine follows:

// 1. Look in the Local Environment Record. Is the variable declared here? If yes, use it and stop searching.

// 2. If not, follow the Outer Reference pointer to the Parent Environment. Is it there? If yes, use it and stop.

// 3. If not, follow the pointer to the Grandparent Environment.

// 4. Repeat this until you hit the Global Environment (the top of the chain).

// 5. If it is not in the Global Environment, the engine violently crashes the thread with a ReferenceError: X is not defined.

// Rule of Uni-directionality:
// The Scope Chain is strictly a one-way street. It only goes up. An inner function has full access to its parent's data, but a parent function has absolutely zero access to its child's data.
// Shadowing:
// Because the engine stops searching the exact millisecond it finds a matching variable name, you can declare a variable inside a child function with the exact same name as a variable in the parent. The child variable will "shadow" (hide) the parent variable. The engine will never see the parent's version.

console.log("===== The Global Anchor");
const masterKey = "Global_Admin_Key";
const systemStatus = "Global status";

console.log("===== The Chain Execution");
// ------------------------------------------
function parent() {
  const gatewayStatus = "Authorized";
  const systemStatus = "Parent status"; // SHADOWING: This hides the Global systemStatus.
  // In JavaScript, illegal shadowing happens when you try to declare a variable using var inside a block scope, but a variable with the exact same name already exists in the outer scope declared with let or const.

  // This causes a SyntaxError because the var declaration tries to "leak" out of the block and overwrite the let or const variable, violating JavaScript's rules against redeclaring variables in the same scope.

  function child() {
    const vaultId = 99;
    const systemStatus = "Child status"; // SHADOWING: This hides the Parents's systemStatus.

    console.log("--- Executing Child ---");

    // 1. Local Lookup
    // The engine looks locally. Found it immediately.
    console.log("Vault ID: " + vaultId); // 99

    // 2. One Level Up (Parent Lookup)
    // The engine looks locally. Not found. Moves up to parent. Found it.
    console.log("Gateway: " + gatewayStatus); // "Authorized"

    // 3. Two Levels Up (Global Lookup)
    // The engine looks locally -> Parent -> Global. Found it.
    console.log("Master Key: " + masterKey); // "Global_Admin_Key"

    // 4. Variable Shadowing in Action
    // The engine looks locally. Found it immediately! It stops searching.
    // It never knows that the Parent or Global versions of `systemStatus` exist.
    console.log("System Status: " + systemStatus); // "Child status"
  }

  child();

  console.log("===== The Unidirectional Trap");
  // ------------------------------------------
  // The Gateway tries to look DOWN into the Vault.
  // The engine looks locally -> Global. It never looks down.
  // console.log(vaultId); // ReferenceError: vaultId is not defined

  console.log("--- Executing Parent ---");
  // The Gateway looks locally for systemStatus. It finds its own version.
  console.log("Gateway System Status: " + systemStatus); // "Parent status"
}

// Trigger the sequence
parent();
// The Global scope looks for systemStatus. It only sees its own.
console.log("--- Executing Global ---");
console.log("Global System Status: " + systemStatus); // "Global status"
