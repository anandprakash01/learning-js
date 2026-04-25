// Regular Expressions (Regex) form a dedicated sub-language built directly into the V8 engine. Instead of searching for exact text, Regex searches for mathematical patterns.

// Regex patterns are enclosed in forward slashes /pattern/, followed by optional "flags" that change how the engine reads the pattern (e.g., g for global search, i for case-insensitive).

// ^ means "Start of the string".

// $ means "End of the string".

// \d means "Any digit (0-9)".

// \w means "Any word character (a-z, A-Z, 0-9, _)".

// + means "One or more of the previous rule".

// [] means "Any character inside these brackets".

// Catastrophic Backtracking: Regex evaluates text incredibly fast, but a poorly written pattern can force the engine into an infinite loop trying to guess combinations, instantly crashing your entire server. We use strictly defined, bounded regex patterns.

console.log("===== The Syntax & Validation (.test)");
// ------------------------------------------
// .test() is the fastest Regex method. It returns a strict Boolean.
// We use this for Gateway Validation (Should we let this data into our system?)
const userInputPhone = "555-0198";

const phoneRegex = /^\d{3}-\d{4}$/;
// Pattern Breakdown:
// ^   : Must start exactly here
// \d{3} : Exactly 3 digits
// -   : A literal dash
// \d{4} : Exactly 4 digits
// $   : Must end exactly here

console.log("===== Data Extraction (.match)");
// ------------------------------------------
// .match() scans a string and returns an Array of everything that fits the pattern.
// If it finds nothing, it returns `null`.
const invoiceText = "Order 1: $45.00, Order 2: $150.50, Discount: -$10.00";
const priceRegex = /\$\d+\.\d{2}/g;
// Pattern Breakdown:
// \$  : We must escape the $ with a backslash, because normally $ means "end of string".
// \d+ : One or more digits.
// \.  : A literal decimal point.
// \d{2}: Exactly 2 digits (for the cents).
// g   : The Global flag. (Don't stop after the first match, find all of them).
const extractedPrices = invoiceText.match(priceRegex);
console.log("Extracted Prices: ", extractedPrices); // ["$45.00", "$150.50", "$10.00"]

console.log("===== Enterprise Sanitization (.replace with Regex)");
// ------------------------------------------
// Users often paste text containing invisible characters, illegal symbols, or malicious scripts.
// We use Regex inside .replace() to instantly scrub the data clean.
const maliciousInput = "   <script>alert('hack');</script>   Anand_Admin!!!  ";
// Goal: We ONLY want alphanumeric characters and underscores. Destroy everything else.
const cleanRegex = /[^a-zA-Z0-9_]/g;
// Pattern Breakdown:
// [^a-zA-Z0-9_] : The ^ inside brackets means "NOT". So, match anything that is NOT a letter, number, or underscore.
// g : Global flag (target every instance in the string).

// We replace every illegal character with an empty string "" (effectively deleting it).
const sanitizedData = maliciousInput.replace(cleanRegex, "");
console.log("Sanitized Input: '" + sanitizedData + "'");
// Output: "scriptalerthackscriptAnand_Admin"
// Note: It stripped the spaces, the brackets < >, the quotes, and the exclamation points.
// It is perfectly safe for a database constraint now.
