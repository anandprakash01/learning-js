// ==========================================
// MODULE 17.2: MOCKING & SPIES (THE STUNT DOUBLES)
// ==========================================

// ==========================================
// PART I: THE TARGET (The Dangerous Function)
// ==========================================
// Imagine we have a file that charges credit cards.
// 📄 paymentService.js
export const chargeCard = async amount => {
  // Imagine this actually hits the Stripe API and moves real money!
  console.log(`Physically charging $${amount}...`);
  return true;
};

// And we have our main Business Logic file:
// 📄 checkout.js
import {chargeCard} from "./paymentService.js";

export const completeCheckout = async cartTotal => {
  if (cartTotal <= 0) return false;

  // We rely on the external service here
  const success = await chargeCard(cartTotal);
  return success;
};

// ==========================================
// PART II: THE MOCK (Faking the Module)
// ==========================================
// In our test file, we absolutely CANNOT let `chargeCard` run.
// So, we tell Jest to hijack the module system and inject a fake!

// 📄 checkout.test.js
import {completeCheckout} from "./checkout.js";
import {chargeCard} from "./paymentService.js";

// 1. THE HIJACK: We tell the engine to mock the entire file.
// Now, `chargeCard` is no longer the real function. It is a "Jest Mock Function".
jest.mock("./paymentService.js");

describe("Checkout Architecture", () => {
  test("should successfully process a valid cart", async () => {
    // 2. THE STUNT DOUBLE'S SCRIPT:
    // We tell our fake function exactly what to return when it gets called.
    // We simulate a successful network response without touching the network!
    chargeCard.mockResolvedValue(true);

    // 3. ACT
    const result = await completeCheckout(150);

    // 4. ASSERT
    expect(result).toBe(true);

    // 5. THE SPY CHECK:
    // Mocks have a secret superpower: Memory.
    // We can prove mathematically that the system tried to charge the exact right amount!
    expect(chargeCard).toHaveBeenCalledTimes(1);
    expect(chargeCard).toHaveBeenCalledWith(150);
  });
});

// ==========================================
// PART III: THE SPY (Watching Without Changing)
// ==========================================
// Sometimes, you want the REAL function to run, but you just want to
// spy on it to see if it was executed correctly.
// A common use case is spying on `console.error` to ensure errors are logged.

describe("Telemetry Spies", () => {
  test("should log a critical error on failure", () => {
    // 1. Attach a wiretap to the global console object
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // 2. Trigger the failure
    const dangerousCode = () => {
      console.error("Database Crash!");
    };
    dangerousCode();

    // 3. Assert the spy captured the event
    expect(errorSpy).toHaveBeenCalledWith("Database Crash!");

    // 4. DETACH THE WIRETAP:
    // You MUST restore the original function, or you will break all other tests!
    errorSpy.mockRestore();
  });
});

// ==========================================
// PART IV: CLEARING MOCK MEMORY (The Enterprise Trap)
// ==========================================
// This is the #1 bug Juniors write in testing files.
// Because Mocks remember how many times they were called, if you run 10 tests
// in a row using the same Mock, the memory stacks up! (Test 2 will think it was called twice).

// THE FIX: You must wipe the Mock's memory before every single test.
describe("Safe Mocking", () => {
  beforeEach(() => {
    // This is the exact equivalent of wiping the Call Stack.
    jest.clearAllMocks();
  });

  test("Mock memory is now pristine", () => {
    // Test logic...
  });
});
