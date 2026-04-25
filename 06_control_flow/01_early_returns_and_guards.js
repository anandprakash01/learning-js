const mockUser = {
  id: "U_9942",
  isVerified: true,
  accountBalance: 50.0,
};

console.log("===== Pyramid of Doom (BANNED)");
// ------------------------------------------
// deeply nested if/else statements that form a horizontal wedge across the screen. We call this the Pyramid of Doom. It is visually chaotic, hard to test, and a nightmare to debug.
// You have to read 14 lines deep just to find the success state.

function processWithdrawal(user, amount) {
  if (user) {
    if (user.isVerified) {
      if (amount > 0) {
        if (user.accountBalance >= amount) {
          // THE CORE LOGIC IS BURIED HERE
          user.accountBalance -= amount;
          return `Success. New balance: ${user.accountBalance}`;
        } else {
          return "Error: Insufficient funds.";
        }
      } else {
        return " Error: Amount must be greater than Zero.";
      }
    } else {
      return "Error: User email not verified.";
    }
  } else {
    return "Error: User does not exist.";
  }
}

console.log("===== The Enterprise Standard (Guard Clauses)");
// ------------------------------------------
// A Guard Clause checks for a failure condition. If the failure is detected, we immediately return out of the function, killing the Execution Context instantly. By handling all the errors upfront, the main "happy path" logic can sit completely flat at the bottom of the function, without any indentation.

function processWithdrawalModern(user, amount) {
  // 1. The Guards (Bouncers at the door)
  if (!user) return "Error: User does not exist.";
  if (!user.isVerified) return "Error: User email not verified.";
  if (amount <= 0) return "Error: Amount must be greater than zero.";
  if (user.accountBalance < amount) return "Error: Insufficient funds.";
  // 2. The Core Logic (The Happy Path)
  // If the engine reaches this line, we have absolute mathematical certainty that the user is valid, verified, and has enough money. No nesting required.
  user.accountBalance -= amount;
  return `Success. New balance: $${user.accountBalance}`;
}
console.log("Legacy Attempt: " + processWithdrawal(mockUser, 20));
console.log("Modern Attempt: " + processWithdrawalModern(mockUser, 20));

console.log("===== Break and Continue");
//break
for (let i = 0; i < 10; i++) {
  console.log(i);
  if (i == 5) {
    break;
  }
}
//continue

for (let i = 0; i < 10; i++) {
  if (i == 5) {
    continue;
  }
  console.log(i);
}
