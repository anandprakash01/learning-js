// ==========================================
// PART I: THE TARGET (What are we testing?)
// ==========================================
// A "Unit" is the smallest piece of testable code in your application. Usually, this is a single, pure function.

// 📄 mathUtils.js (The source code we want to test)
function add(a, b) {
  // A developer might accidentally write `a - b` here.
  return a + b;
}

function processPayment(amount) {
  if (amount <= 0) throw new Error("Invalid Amount");
  return `Processed $${amount}`;
}

// export { add, processPayment };

// ==========================================
// PART II: THE ANATOMY OF A TEST
// ==========================================
// Tests are written in a separate file, usually named `mathUtils.test.js`.
// A test framework (like Jest) provides three global functions to structure our proofs:
// 1. `describe()`: Groups related tests together (The Suite).
// 2. `test()` or `it()`: The actual individual test case.
// 3. `expect()`: The Assertion (The mathematical proof).

// 📄 mathUtils.test.js
// import { add, processPayment } from './mathUtils.js';

describe("Math Utilities Suite", () => {
  // Test 1: Standard Behavior
  test("add() should correctly sum two positive numbers", () => {
    // 1. Arrange (Set up the data)
    const num1 = 5;
    const num2 = 10;

    // 2. Act (Execute the function)
    const result = add(num1, num2);

    // 3. Assert (The Engine checks if result strictly equals 15)
    expect(result).toBe(15);
  });

  // Test 2: Edge Cases
  test("add() should handle negative numbers", () => {
    expect(add(-5, -5)).toBe(-10);
  });
});

// ==========================================
// PART III: ASSERTION MATCHERS
// ==========================================
// `toBe()` uses `Object.is()` (similar to `===`) under the hood.
// It works perfectly for Primitives (Strings, Numbers, Booleans).
// But remember: Objects and Arrays are Reference Types in the Heap!

describe("Reference Type Assertions", () => {
  test("should correctly build a user object", () => {
    const buildUser = () => ({name: "Anand", role: "Admin"});
    const user = buildUser();

    // ❌ THE JUNIOR TRAP:
    // expect(user).toBe({ name: "Anand", role: "Admin" });
    // This FAILS because they are two different memory pointers in the Heap!

    // ✅ THE ARCHITECT'S WAY:
    // `toEqual()` recursively checks every single key and value, ignoring memory addresses.
    expect(user).toEqual({name: "Anand", role: "Admin"});
  });
});

// ==========================================
// PART IV: TESTING ERRORS & PANICS
// ==========================================
// How do you test if a function correctly throws an error?
// If you just run `processPayment(-10)`, the test itself will crash!

describe("Error Boundary Tests", () => {
  test("processPayment() should throw if amount is zero or negative", () => {
    // THE FIX: You must wrap the execution inside an anonymous callback function.
    // This allows the Jest engine to safely catch the explosion and verify the error message.
    expect(() => {
      processPayment(-50);
    }).toThrow("Invalid Amount");
  });
});
