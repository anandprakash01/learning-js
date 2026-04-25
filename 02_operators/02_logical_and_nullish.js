// In JavaScript, the following six values are "falsy":
// 1. false
// 2. 0
// 3. "" (empty string)
// 4. null
// 5. undefined
// 6. NaN.

// Logical Short-Circuiting: The engine reads && and || from left to right. It is lazy; the moment it finds a definitive answer, it stops reading the rest of the line. We use this behavior intentionally in enterprise code to replace clunky if statements.

console.log("===== Logical OR (||) and Fallbacks");
// ------------------------------------------
// Returns the FIRST truthy value it finds.-

let name_user = "Anand" || ""; // "hello" (first truthy)
let id_user = 1 || 5; // 1
let is_active = "" || undefined; // undefined (both falsy, returns the last one)
let string_user = "" || "yay" || "boo"; // "yay"
let count_user = 0 || "" || 5; // 5 (Skipped 0 and "", found 5)
let users = [] || ""; // [] (Empty array is truthy in JS!)
let pinged_user = {} || 0; // {} (Empty object is truthy in JS!)

console.log("OR users: ", users);
console.log("Type of users: " + typeof users); // "object" (Arrays are objects)
console.log("OR pinged_user: " + pinged_user);

// If a user legitimately sets their volume to 0, the || operator sees 0 as falsy, panics, and overrides it with the default volume (e.g., 100). This is a critical bug.

// ES2020 introduced the Nullish Coalescing Operator (??). It acts exactly like ||, but it only looks for "nullish" values: strictly null or undefined. It respects 0, false, and "" as valid, intentional data.

// Explicitly want volume muted (0) and theme empty ("").
const userVolume = 0;
const userTheme = "";
// The || operator checks if the left side is "truthy".
// Since 0 is considered falsy, the engine rejects it and uses 100.
const finalVolume = userVolume || 100;

// Since "" (empty string) is falsy, the engine rejects it and uses "dark".
const finalTheme = userTheme || "dark";

// BUG: The user's preferences were completely destroyed.
console.log("Bugged Volume: " + finalVolume); // 100 (Expected 0)
console.log("Bugged Theme: " + finalTheme); // "dark" (Expected "")

console.log("===== The Enterprise Fix (Nullish Coalescing)");
// ------------------------------------------
// The ?? operator ONLY falls back to the right side if the left is `null` or `undefined`.
// It treats 0, "", and false as perfectly valid data.
const safeVolume = userVolume ?? 100;
const safeTheme = userTheme ?? "dark";

// SUCCESS: State is perfectly preserved.
console.log("Safe Volume: " + safeVolume); // 0
console.log("Safe Theme: '" + safeTheme + "'"); // ""

console.log("===== Short-Circuiting with Logical AND (&&)");
// ------------------------------------------
// The && operator evaluates from left to right.
// If the left side is truthy, it executes the right side.(returns last)
// If the left side is falsy, it immediately stops (short-circuits)-returns first.

const isLoggedIn = true;
const userRole = "Admin";

const canAccess = isLoggedIn && userRole === "Admin";
console.log("Dashboard Access: " + canAccess); // true

// If the left side is falsy, the engine never even looks at the right side.
const isPremiumUser = false;
const result = isPremiumUser && getUserInfo(); // this fun is not defined yet it does not looks at second

console.log("Result: " + result); // false

console.log("AND strings: " + ("hello" && "world")); // 'world'
console.log("AND with falsy: " + (undefined && 0)); // undefined (Short-circuited!)
console.log("AND with zero: " + (0 && 6)); // 0 (0 is falsy, short-circuited!)

console.log("===== Logical NOT (!) and Boolean Casting");
// ------------------------------------------
console.log(!false);
console.log(!undefined); //undefined is false value so will give true

// The Double Bang (!!) - Enterprise Boolean Casting
// Using !! forces any value to reveal its true boolean nature.
console.log("Double Not false: " + !!false); // false
console.log("Boolean cast of empty string: " + !!""); // false
console.log("Boolean cast of string: " + !!"Anand"); // true
