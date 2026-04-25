// JavaScript is NOT purely interpreted, nor is it purely compiled. It is "Just-In-Time" (JIT) compiled.
//
// 1. Parsing: The code is turned into an Abstract Syntax Tree (AST).
// 2. Ignition (Interpreter): Reads the AST and generates baseline "Bytecode". (Fast to start, slow to run).
// 3. The Profiler: Watches the code run. If a function is called thousands of times, it marks it as "HOT".
// 4. TurboFan (Compiler): Takes the "HOT" Bytecode and compiles it into ultra-fast, machine-level C++ code.

console.log("===== Hidden Classes (Shapes)");
// ------------------------------------------
// C++ is fast because it knows exactly where memory lives. JS Objects are dynamic, which is slow.
// V8 fixes this by silently creating "Hidden Classes" (C++ structs) behind the scenes.
function createUser(x, y) {
  this.x = x;
  this.y = y;
}
// Good Architecture: Both objects have the exact same keys added in the exact same order.
// V8 assigns them the SAME Hidden Class. TurboFan optimizes this instantly.
const userA = new createUser(10, 20);
const userB = new createUser(30, 40);

console.log("===== Monomorphic vs Polymorphic Functions (TurboFan Trap)");
// ------------------------------------------

// "HOT" Function being watched by the Profiler
function calculateArea(shape) {
  return shape.width * shape.height;
}
const square1 = {width: 10, height: 10};
const square2 = {width: 20, height: 20};
// We call it 10,000 times with the EXACT SAME object structure.
// V8 sees this is "Monomorphic" (One Shape). TurboFan converts `calculateArea` into raw Machine Code.
calculateArea(square1);
calculateArea(square2);

const triangle = {width: 10, height: 10, angle: 45};
// CATASTROPHE: DE-OPTIMIZATION (Bailout)
// We suddenly pass an object with a different structure (Polymorphic).
// TurboFan panics. The machine code is invalid. It throws the optimized code in the trash,
// issues a "Bailout", and sends the function BACK to the slow Ignition Interpreter.
calculateArea(triangle);
