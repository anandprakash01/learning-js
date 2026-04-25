// In 90% of web development, you will never touch Bitwise operators. They are the domain of cryptography, graphics rendering (WebGL), and low-level system permissions.

// The 32-Bit Illusion:
// JavaScript numbers are typically 64-bit floats. But when you use a Bitwise operator, the V8 engine temporarily forces the number into a 32-bit integer, performs the operation directly on the binary 1s and 0s at the CPU level, and converts it back. It is blindingly fast.

// Bitwise operations are abstract because humans think in Base-10 (decimals: 0-9), but the V8 engine operates at the hardware level in Base-2 (binary: 1s and 0s). When you use a standard operator like +, the engine does human math. When you use a Bitwise operator like | or &, the engine ignores the human number and directly manipulates the raw electrical switches (the bits) inside the memory.

// The OR Operator (|) - "The Combiner": If either switch in a column is ON (1), the resulting switch is turned ON. We use this to grant access.

// The AND Operator (&) - "The Inspector": The resulting switch is only ON if both switches in that column are ON. We use this to check if a specific permission is granted.

// The XOR Operator (^) - "The Toggler": The resulting switch is ON only if the switches are different. If they are the same (both on or both off), it turns OFF. We use this to flip permissions back and forth.

// Bitwise NOT (~): This flips every single bit in a 32-bit number. Because JavaScript uses a system called "Two's Complement" to handle negative numbers, flipping the bits of a positive number turns it into a negative number, minus one.

// Bitwise Left Shift (<<): This takes the binary bits and shoves them to the left, adding a 0 to the right side. Enterprise Secret: Shifting left by 1 is identical to multiplying by 2, but it executes at hardware speed.

// Bitwise Right Shift (>>): This shoves the bits to the right. The rightmost bit falls off the edge and is destroyed. Enterprise Secret: Shifting right by 1 is identical to dividing by 2 and stripping off any decimals (integer division).

const baseNumber = 5; // Binary: 00000000000000000000000000000101
const modifier = 1; // Binary: 00000000000000000000000000000001

console.log("===== 1. Bitwise AND (&)");
// ------------------------------------------
// The engine looks for columns where BOTH bits are 1.
// 0101 (5)
// 0001 (1)
// ----
// 0001 (1)
const andResult = 5 & 1;
console.log("5 & 1 Result: " + andResult); // 1

console.log("===== 2. Bitwise OR (|)");
// ------------------------------------------
// The engine looks for columns where EITHER bit is 1.
// 0101 (5)
// 0001 (1)
// ----
// 0101 (5)
const orResult = 5 | 1;
console.log("5 | 1 Result: " + orResult); // 5

console.log("===== 3. Bitwise NOT (~) - The Inverter");
// ------------------------------------------
// The engine flips all 32 bits. 0s become 1s, and 1s become 0s.
// Binary of 5:  00000000000000000000000000000101
// Flipped (~5): 11111111111111111111111111111010
// In JavaScript's Two's Complement memory, a leading '1' means the number is negative.
// The mathematical shortcut for ~x is: -(x + 1)
const notResult = ~5;
console.log("~5 Result: " + notResult); // -6

console.log("===== 4. Bitwise Left Shift (<<) - Fast Multiplication");
// ------------------------------------------
// The engine shifts the bits 1 space to the left and adds a 0 on the right.
// Original 5: 0101
// Shifted by 1: 1010
// 1010 in binary is exactly 10 in decimal. (5 * 2 = 10)
const leftShiftResult = 5 << 1;
console.log("5 << 1 Result: " + leftShiftResult); // 10
// If you shifted by 2 (5 << 2), it would be 5 * 2 * 2 = 20.

console.log("===== 5. Bitwise Right Shift (>>) - Fast Division");
// ------------------------------------------
// The engine shifts the bits 1 space to the right. The rightmost '1' drops off.
// Original 5: 0101
// Shifted by 1: 0010 (The last '1' was pushed off the edge)
// 0010 in binary is exactly 2 in decimal.
// It effectively did Math.floor(5 / 2).
const rightShiftResult = 5 >> 1;
console.log("5 >> 1 Result: " + rightShiftResult); // 2
