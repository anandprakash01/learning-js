// In strongly typed languages like Java or C#, if you try to add a String to a Number, the compiler immediately halts and throws an error. JavaScript, however, tries to be "helpful." When it sees two different data types interacting, it automatically converts (coerces) one of them to match the other behind the scenes. This is called Implicit Type Coercion, and relying on it is a massive architectural liability.

// The + vs - Paradox:

// The + operator has a dual purpose in JavaScript: Math addition AND String concatenation. If either side of a + is a String, the V8 engine aggressively converts the other side to a String and glues them together.

// The -, *, and / operators only have one purpose: Math. If you use them on Strings, the engine attempts to force the Strings into Numbers. If it fails, it returns NaN (Not a Number).

// The == (Loose) vs === (Strict) Equality:

// == (Loose Equality): Checks if values are the same after the engine tries to coerce them into matching types. Under loose equality, 0 equals false, and "" (empty string) equals 0. This is unpredictable and banned in enterprise codebases.

// === (Strict Equality): Checks if BOTH the value AND the data type are identical. No coercion is allowed. If the types do not match, it instantly returns false.

console.log("===== Implicit conversion");
// ------------------------------------------
// This is string concatenation, not math.
const additionTrap = "2" + 2;
console.log("string + number: " + additionTrap); // "22"
let result = 50 + "";
console.log("string + number : " + result, typeof result); // "50"

// Coerces the String "2" into the Number 2.
const subtractionTrap = "3" - 2;
console.log("string - number: " + subtractionTrap); // 1

// If the string cannot be turned into a number, it results in NaN.
const failedMath = "Anand" - 5;
console.log("Invalid Math: " + failedMath); // NaN (Not a Number)
result = 50 + true;
console.log("number + boolean : " + result); // 51

let a = true * "hello";
console.log(typeof a, a);
let b = 3 * "hello";
console.log(typeof b, b);

console.log('2 * "2.5" = ', 2 * "2.5"); // 5 // string is converted to number

console.log("===== Relational Operators");
// ------------------------------------------
console.log("Is 10 >= 20? " + (10 >= 20)); // false
console.log("Is cat != dog? " + ("cat" != "dog")); // true

console.log("===== Loose Equality");
// ------------------------------------------
// Loose equality (==) tries to coerce types before comparing.
// This leads to terrifyingly inaccurate truths.
console.log("Does 0 loosely equal false? ", 0 == false); // true
console.log("Does empty string loosely equal 0? ", "" == 0); // true
console.log("Does string '42' loosely equal number 42? ", "42" == 42); // true

console.log("===== Strict Equality (The Enterprise Standard)");
// ------------------------------------------

// Strict equality (===) demands exact type matches. No coercion is performed.
console.log("Does 0 strictly equal false? ", 0 === false); // false
console.log("Does empty string strictly equal 0? ", "" === 0); // false
console.log("Does string '42' strictly equal number 42? ", "42" === 42); // false

console.log("===== Explicit Coercion / Explicit conversion or type casting");
// ------------------------------------------
// In enterprise apps, data often comes from the UI (like input fields) as Strings.
// We NEVER trust implicit coercion. We explicitly cast types before calculation.

const uiInputVal = "500";
const databaseVal = 500;

// BAD: Relying on the engine to figure it out
if (uiInputVal == databaseVal) {
  /* ... */
}

// GOOD: We explicitly cast the String to a Number, THEN strictly compare.
// This proves mathematical intent to anyone reading the code.
if (Number(uiInputVal) === databaseVal) {
  console.log("Explicit check passed. Data is safe to process.");
}
// We can also explicitly cast to Strings if we need text normalization.
const transactionId = 98765;
const formattedId = String(transactionId);
console.log("Type of formattedId: " + typeof formattedId); // "string"

let userName = "anand";
userName = Number(userName);
console.log("Type of userName: " + typeof userName, userName);

let check = false;
check = Number(check);
console.log(typeof check, check);

check = "";
check = Boolean(check);
console.log(typeof check, check);

// toString() Method: For an array, this conversion process calls its toString() method. The array's toString() method joins all its elements with a comma.
// [1, 2, 3].toString() results in the string '1,2,3'.
console.log("3 + [1, 2, 3] = " + (3 + [1, 2, 3])); // '31,2,3' // array is converted to string and added to number
console.log("3 + [1] = " + (3 + [1])); // '31' // array with single element is converted to string
