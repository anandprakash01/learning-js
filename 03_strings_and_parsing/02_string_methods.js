// Strings in JavaScript are Primitives, Primitives are immutable. This means String methods never change the original string in memory. They always calculate the change and return a brand new string.

const str = new String("Be the best version of you");
console.log(typeof str, str);

console.log("===== Modern Character Access (Bracket Notation)");
// ------------------------------------------
// Bracket Notation (str[1]) vs .charAt(): Modern JavaScript treats strings as array-like structures. Using brackets [ ] is the enterprise standard for reading a specific character. We only fall back to .charAt() if we are dealing with very old legacy systems.
// Strings in JS are iterable. We can access characters exactly like an Array.
// This is the cleanest, most modern syntax.
const rawFilename = "financial_report.pdf";
let firstChar = rawFilename[0]; //"f"

// If the index doesn't exist, bracket notation returns `undefined`.
console.log("Out of bounds: " + rawFilename[100]); // undefined

console.log("===== Legacy Character Access (.charAt)");
// ------------------------------------------
// This does the exact same thing as Bracket Notation, but it is older.
const legacyChar = rawFilename.charAt(1);
console.log("Legacy charAt(1): " + legacyChar); // "i"

// If the index doesn't exist, charAt returns an empty string, NOT undefined.
// This difference can cause silent UI bugs in React/Angular.
console.log("Out of bounds charAt: '" + rawFilename.charAt(100) + "'"); // ""

console.log("===== Formatting & Sanitization");
// ------------------------------------------
console.log("hello\nWorld"); // for next line
const rawInput = "   ADMIN_anand@Enterprise.com   ";
// .trim() removes whitespace from both the extreme left and extreme right.
// .toLowerCase() normalizes the text so database lookups don't fail due to case sensitivity.
const trimmedInput = rawInput.trim();
console.log("Trimmed: '" + trimmedInput + "'"); // "ADMIN_anand@Enterprise.com"

const normalizedEmail = trimmedInput.toLowerCase();
console.log("Normalized: '" + normalizedEmail + "'"); // "admin_anand@enterprise.com"
console.log("Capitalized: " + trimmedInput.toUpperCase());

// Because each method returns a new string, we can chain them together instantly.
const finalEmail = rawInput.trim().toLowerCase();

console.log("===== Validation & Searching");
// ------------------------------------------
// In modern JS (ES6+), we use these methods to check for truths, rather than checking if an index exists. They return exact Booleans.

const systemLog = "[ERROR] Database connection timed out.";
console.log("Starts with [ERROR]? " + systemLog.startsWith("[ERROR]")); // true
console.log("Ends with timeout.? " + systemLog.endsWith("timed out.")); // true
console.log("Contains 'Database'? " + systemLog.includes("Database")); // true
console.log("Index(First) of Database.? " + systemLog.indexOf("Database")); // first occurrence
console.log("Index(Last) of Database.? " + systemLog.lastIndexOf("Database")); //last occurrence

console.log("===== Extraction: .substring() and .slice()");
// ------------------------------------------
// .substring(startIndex, endIndex)
// .slice(startIndex, endIndex)
const filename = "financial_report_2026.pdf";

// Both extract characters from a start index up to (but not including) an end index.
console.log("Substring: " + filename.substring(0, 9)); // "financial"
console.log("Slice: " + filename.slice(0, 9)); // "financial"

// If you omit the endIndex, it goes all the way to the end.
console.log("Substring: " + filename.slice(10)); // "report_2026.pdf"
console.log("Slice: " + filename.substring(10)); // "report_2026.pdf"

// The Negative Number Trap
// .slice(-4) intelligently counts 4 characters, slice backwards from the end of the string.
console.log("Slice (-4): " + filename.slice(-4)); // ".pdf"

// .substring() panics when it sees a negative number, changes it to 0, and gives you the whole string. Unpredictable and dangerous.
console.log("Substring (-4): " + filename.substring(-4)); // "financial_report.pdf" (BUG!)

// .substr() (Considered legacy/deprecated/BANNED)❌
// .substr(startIndex, length)
// It has been officially deprecated by the ECMAScript standard. Do not use it in modern architecture.
// Extracting from index 0 till length of 9(no of characters)
console.log("Substr (Deprecated): " + filename.substr(0, 9)); // "financial"

console.log("===== Transformation (.split and .replace)");
// ------------------------------------------
// .split(separator) destroys the string at a specific character and returns an ARRAY of the remaining pieces. Crucial for parsing CSVs or URL paths.

const urlPath = "users/anand/permissions/view";
const urlSegments = urlPath.split("/");
console.log("URL Segments: ", urlSegments); // ["users", "anand", "permissions", "view"]

// .replace(target, replacement) swaps out text.
// Note: standard .replace() ONLY replaces the FIRST instance it finds.

const sloppyText = "The server is down. The server is burning.";
const fixedText = sloppyText.replace("server", "database");
console.log("Single Replace: " + fixedText); // "The database is down. The server is burning."

// .replaceAll() (ES2021) targets every single instance globally.
const completelyFixedText = sloppyText.replaceAll("server", "database");
console.log("Global Replace: " + completelyFixedText); // "The database is down. The database is burning."

console.log("===== Low-Level Character Codes (.charCodeAt)");
// ------------------------------------------
// Returns the UTF-16 integer representing the character.
// We use this when writing low-level encryption or bitmasking text.
// 'f' is 102 in the ASCII/UTF-16 table.
const text = "anandprakash21";
let charCode = text.charCodeAt(0);
console.log("Character Code of 'f': " + charCode); // 102
charCode = text.charCodeAt(14);
console.log("Character Code of '1': " + charCode); // NaN

console.log("===== .concat() (BANNED)");
// ------------------------------------------
// .concat(): Valid, but obsolete. We banned string concatenation using + in Module 3.1 in favor of Template Literals (`${}`). We ban .concat() for the exact same reason.
// .concat() glues strings together.
const baseName = "Anand";
const formalName = baseName.concat(" Prakash");
console.log("Concat: " + formalName); // "Anand Prakash"

// Why it's banned: Template Literals are vastly superior for readability and memory.
// Enterprise Standard replacement:
const enterpriseName = `${baseName} Prakash`;

// The toString() method in JavaScript takes an optional parameter called the radix (or base).

// Base 10 uses numbers 0-9.

// Base 16 (hexadecimal) uses 0-9 and a-f.

// Base 36 uses all numbers 0-9 and all letters a-z (10 + 26 = 36).
