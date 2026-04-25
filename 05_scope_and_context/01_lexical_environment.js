// The word "Lexical" simply means "relating to the text or the words." In JavaScript, Lexical Scope means that scope is determined entirely by where you physically type the code in your editor, before the engine ever runs it.
// Every time the V8 Engine creates an Execution Context (a box on the Call Stack), it creates a corresponding Lexical Environment object to attach to it.
// This Lexical Environment object has exactly two parts:

// The Environment Record: A local memory table storing all the let, const, and function declarations defined inside that specific block.

// The Outer Environment Reference: A hidden pointer (often called [[Scope]] in the engine specification) that points directly to the Lexical Environment of its parent.
// If the engine cannot find a variable in the local Environment Record, it uses the Outer Reference to look at the parent. If it's not there, it looks at the grandparent, all the way up to the Global Environment. This is the foundation of the Scope Chain.

console.log("===== The Global Environment");
// ------------------------------------------
// This variable lives in the Global Lexical Environment.
// Its Environment Record holds `globalSecret`.
// Its Outer Reference is `null` (it has no parent).
const globalSecret = "Alpha_Protocol";

console.log("===== The Parent Environment");
// ------------------------------------------
function secureFacility() {
  // This variable lives in secureFacility's Environment Record.
  const facilityCode = "Sector_7";

  console.log("===== The Child Environment");
  // ------------------------------------------
  // Because `accessVault` is physically written INSIDE `secureFacility`,
  // its Outer Reference points to `secureFacility`.
  function accessVault() {
    const vaultId = "Vault_99";

    // The engine looks for `vaultId` locally. Found it.
    console.log("Accessing: " + vaultId);

    // The engine looks for `facilityCode` locally. Not here.
    // It follows the Outer Reference up to `secureFacility`. Found it.
    console.log("Facility: " + facilityCode);

    // The engine looks for `globalSecret` locally. Not here.
    // It checks the parent (`secureFacility`). Not here.
    // It checks the grandparent (Global). Found it.
    console.log("Clearance: " + globalSecret);
  }

  // We invoke the child function from within the parent.
  accessVault();
}

// Trigger the sequence.
secureFacility();

console.log("===== The Lexical Illusion (Static vs Dynamic)");
// Lexical scope is fixed at compile time. It DOES NOT matter where a function is called from.
// It ONLY matters where it was written.
const targetId = "External_Target";
function reportTarget() {
  // This function is physically written in the Global scope.
  // Its Outer Reference points to Global, ALWAYS.
  console.log("Target Locked: " + targetId);
}
function executeMission() {
  const targetId = "Internal_Target"; // This is a trap.
  // Even though we call `reportTarget` from inside `executeMission`,
  // `reportTarget` does NOT care about `executeMission`'s variables.
  // It only cares about where it was physically defined (Global).
  reportTarget();
}
// Outputs: "External_Target".
// It completely ignores "Internal_Target" because of Lexical Scoping.
executeMission();
