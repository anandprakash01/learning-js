// Operand-- Entities on which operators operate
console.log("===== Unary Operations (Single Operand)");
// ------------------------------------------
// Unary Operators: Act on a single entity (e.g., flipping a sign with -a or casting to boolean with !!).

let num1 = 10; //assignment operator
let num2 = 20;

// Reversing the sign
num1 = -num1;

// Post-increment vs Pre-increment
let a = 2;
console.log("Post-increment (prints first, then adds): " + a++); // 2
console.log("Pre-increment (adds first, then prints): " + ++a); // 4

console.log("===== Binary & Arithmetic (Two Operands)");
// ------------------------------------------
// Binary Operators: Act on two entities (e.g., a + b). It has two operand

console.log(num1 - num2);
let b = 4;
a = 2; // Resetting 'a'

// Complex expression combining operators
let result = a * a + 2 * a * b + b * b;
console.log("Algebraic Result: " + result); // 36

// Exponential Operator (ES7)
console.log("3 cubed (3 ** 3): " + 3 ** 3); // 27
