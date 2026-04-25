// In mathematics, composition is the act of passing the output of one function directly into the input of another: $f(g(x))$. In JavaScript, doing this manually creates a nightmare called "Callback Hell." To fix it, Architects build a custom pipeline tool called pipe.

// ==========================================
// PART I: THE MANUAL NESTING TRAP
// ==========================================

// We have three Pure Functions. They do ONE thing.
const trimText = str => str.trim();
const capitalize = str => str.toUpperCase();
const addExclamation = str => `${str}!`;

// The Goal: Take a raw user string, trim it, capitalize it, and add an exclamation.

// ❌ THE NESTING TRAP (Inside-Out Reading)
const rawInput = "   hello world   ";

// The V8 Engine has to evaluate this from the INSIDE out.
// It is incredibly difficult for humans to read.
const manualResult = addExclamation(capitalize(trimText(rawInput)));
console.log("Manual Result: ", manualResult); // "HELLO WORLD!"

// ==========================================
// PART II: BUILDING THE ENGINE (`pipe`)
// ==========================================
// We want to read our code Left-to-Right, Top-to-Bottom.
// To do this, we use a Higher-Order Function combined with our old friend: `.reduce()`.

// THE ARCHITECTURE OF `pipe`:
// 1. It takes a list of functions using the Rest Operator (`...fns`).
// 2. It returns a new function waiting for the initial data (`initialData`).
// 3. It uses `.reduce()` to loop through the functions, passing the accumulator (the current data) into the next function.

const pipe = (...functions) => {
  return initialData => {
    return functions.reduce((currentData, currentFunction) => {
      return currentFunction(currentData);
    }, initialData);
  };
};

// Enterprise One-Liner Version:
// const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// ==========================================
// PART III: THE ENTERPRISE PIPELINE
// ==========================================

// We create a custom tool by passing our functions into `pipe`.
// The order here is exactly how the data will flow.
const formatString = pipe(trimText, capitalize, addExclamation);

// We pass the data in. It flows down the pipe automatically!
console.log("Piped Result: ", formatString("   system active   ")); // "SYSTEM ACTIVE!"

// ==========================================
// PART IV: COMBINING CURRYING & COMPOSITION
// ==========================================
// Standard functions take 1 input and return 1 output.
// But what if a step in our pipe needs TWO inputs? We use Currying!

const users = [
  {name: "anand", role: "admin"},
  {name: "sarah", role: "guest"},
  {name: "mike", role: "admin"},
];

// 1. Pure Curried Tools
// Because these are curried, they take the configuration first, and wait for the array!
const filterByRole = targetRole => array => array.filter(u => u.role === targetRole);
const mapToNames = array => array.map(u => u.name);
const capitalizeNames = array => array.map(n => n.toUpperCase());

// 2. The Master Pipeline
// We assemble the factory. Notice how `filterByRole("admin")` returns a function that perfectly accepts the array flowing down the pipe!
const getAdminNames = pipe(filterByRole("admin"), mapToNames, capitalizeNames);

// 3. The Execution
const finalAdmins = getAdminNames(users);

console.log("Admin Names: ", finalAdmins); // [ 'ANAND', 'MIKE' ]
