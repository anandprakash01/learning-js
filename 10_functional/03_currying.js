// In standard JavaScript, if a function asks for 3 arguments and you only give it 1, the other two become undefined, and the function usually crashes. But in Functional Programming, we use a mathematical technique called Currying.

// Currying transforms a function that takes multiple arguments f(a, b, c) into a sequence of functions that each take exactly one argument f(a)(b)(c).

console.log("===== The Standard Function (All at once)");
// ------------------------------------------
const standardAdd = (a, b, c) => a + b + c;
console.log(standardAdd(10, 20, 30)); // 60
console.log(standardAdd(10)); // it returns NaN because b and c are undefined.

console.log("===== The Curried Function (One by one)");
// ------------------------------------------
// We return a sequence of Arrow Functions.
// Every arrow function creates a Closure, trapping the previous variable in memory.

const curriedAdd = a => {
  return b => {
    return c => {
      // By the time we reach here, `a` and `b` are safely trapped in Closures!
      return a + b + c;
    };
  };
};
// Execution Phase 1: We pass `a`. The engine returns the next function.
const step1 = curriedAdd(10);

// Execution Phase 2: We pass `b`. The engine returns the final function.
const step2 = step1(20);

// Execution Phase 3: We pass `c`. The math executes.
const finalResult = step2(30);

console.log("Curried Result: ", finalResult); // 60

// Modern One-Liner Syntax (Standard in Enterprise Codebases):
const modernCurry = a => b => c => a + b + c;
console.log("One-Liner Execution: ", modernCurry(10)(20)(30)); // 60

// ==========================================
// Why do we actually use this? To "Pre-Load" Configuration.
// ===== Example A: The API Fetcher
// ------------------------------------------
// Imagine we are hitting a database. We need a URL, an Endpoint, and an ID.
const fetchApi = baseURL => endpoint => id => {
  return `Fetching: ${baseURL}/${endpoint}/${id}`;
};

// 1. We Pre-Load the Base URL at the start of our app.
const myAppApi = fetchApi("https://api.enterprise.com/v1");

// 2. We Pre-Load specific Modules
const userApi = myAppApi("users");
const productApi = myAppApi("products");

// 3. Later, deep in our React components, we just pass the ID!
console.log(userApi("9981")); // "Fetching: https://api.enterprise.com/v1/users/9981"
console.log(productApi("A-12")); // "Fetching: https://api.enterprise.com/v1/products/A-12"

// ===== Example B: The Global Logger
// ------------------------------------------
// We want to log events, but we don't want to keep passing the severity and module name.
const createLogger = severity => moduleName => message => {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(`[${timestamp}] [${severity}] [${moduleName}]: ${message}`);
};

// We configure a highly specific logger by locking in the first two arguments.
const criticalAuthLog = createLogger("CRITICAL")("AuthService");

// Now, wherever we are in the Auth files, we just call the final function:
criticalAuthLog("Database connection timed out.");
criticalAuthLog("User 991 attempted breach.");
// OUTPUT:
// [12:45:10] [CRITICAL] [AuthService]: Database connection timed out.
// [12:45:10] [CRITICAL] [AuthService]: User 991 attempted breach.

// ==========================================
// Currying explicitly means EVERY function takes EXACTLY ONE argument.
// Partial Application is the cousin: We lock in *some* arguments, and pass the *rest* later.

// We can use the native V8 `.bind()` method to do this without writing nested arrow functions!

const calculateDiscount = (tax, discount, price) => {
  return price - discount + price * tax;
};

// We want to lock in a 10% tax and a $5 discount.
// `.bind(thisArg, arg1, arg2...)`
// We pass `null` for `this` because we are functional, not object-oriented.
const holidaySaleCalc = calculateDiscount.bind(null, 0.1, 5.0);

// Later, we just pass the remaining `price` argument.
console.log("Holiday Sale Price: $", holidaySaleCalc(100)); // 105
