// In ES6, JavaScript introduced Template Literals. They use backticks (`) instead of single or double quotes. They bring three massive architectural upgrades:

// Interpolation: You can inject variables or execute JavaScript directly inside the string using the ${} syntax.

// Multi-line Support: You can press "Enter" and format the string across multiple lines without the V8 engine throwing a syntax error.

// Tagged Templates: An advanced enterprise pattern where you attach a function directly to a string to parse or sanitize the data before the string is fully constructed (used heavily by libraries like styled-components in React or to prevent SQL injection).

console.log("===== The Legacy Concatenation Trap");
// ------------------------------------------
const serverName = "my-server";
const activePort = 5000;

// The old way: Prone to missing spaces and typo errors.
const legacyLog = "Server " + serverName + " is listening on port " + activePort + ".";
console.log(legacyLog);

console.log("===== The Enterprise Standard: Interpolation");
// ------------------------------------------
// Using backticks (`), we inject variables directly using ${}
const modernLog = `Server ${serverName} is listening on port ${activePort}.`;
console.log(modernLog);

console.log("===== Executing Logic Inside Strings");
// ------------------------------------------
// The ${} block creates an isolated execution context.
// You can run math, logical operators, or function calls inside it.
const maxCapacity = 1000;
const currentLoad = 950;
// We calculate the remaining capacity directly inside the string.
const alertMessage = `WARNING: Only ${maxCapacity - currentLoad} connections remaining.`;
console.log(alertMessage);
// Using a ternary operator inside the interpolation for dynamic text
const statusMessage = `Server Status: ${currentLoad > 900 ? "CRITICAL" : "STABLE"}`;
console.log(statusMessage);

console.log("===== Multi-line Architecture");
// ------------------------------------------
// Legacy strings required \n to drop to a new line.
// Template literals respect actual line breaks in your code editor.
const emailTemplate = `
    Hello System Admin,
    
    The ${serverName} has reached critical capacity.
    Please provision more resources immediately.
    
    Timestamp: ${new Date().toISOString()}
`;
console.log(emailTemplate);

console.log("===== Tagged Template Literals (Advanced)");
// ------------------------------------------
// We can define a function that intercepts the template literal.
// 'strings' is an array of the raw text blocks.
// 'values' represents the variables we passed in via ${}
function sanitizeLog(strings, ...values) {
  // In a real enterprise app, we would scrub 'values' for malicious code here
  console.log(strings);
  console.log(values);
  let finalString = "";
  // We manually rebuild the string, verifying the data as we go
  strings.forEach((str, index) => {
    let value = values[index] ? values[index] : "";
    finalString += str + value.toString().toUpperCase(); // Forcing variables to uppercase
  });
  return finalString;
}

const dbUser = "admin_anand";
const action = "drop_table";

// Notice there are NO parenthesis(). We just "tag" the string with the function name.
const auditLog = sanitizeLog`User ${dbUser} attempted to execute ${action}.`;
console.log("Sanitized Audit: " + auditLog);
// Output: "Sanitized Audit: User ADMIN_ANAND attempted to execute DROP_TABLE."
