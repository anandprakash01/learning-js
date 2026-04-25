// Imperative Loops vs. Iterable Protocols
// For 20 years, developers relied on the classic for (let i = 0; i < array.length; i++) loop. This is Imperative Programming. You are micromanaging the V8 engine, telling it exactly how to count, where to stop, and how to access the data. It is highly prone to "off-by-one" memory errors and infinite loops.

// In modern enterprise architecture, we prefer Declarative Programming. We want to tell the engine what we want, not how to do it.

// ES6 introduced the Iterable Protocol. This is a standardized way for data structures (Arrays, Strings, Maps, Sets) to tell the engine: "Here is how you loop over me safely." This gave birth to the for...of loop, which completely abstracts away the index math.

const serverNodes = ["Node_Alpha", "Node_Beta", "Node_Gamma"];

console.log("===== The Legacy Imperative Loop (Discouraged)");
// ------------------------------------------
// You manage the index (i), the boundary (.length), and the increment (++).
// One typo here (like i <= length) causes an undefined memory read.

for (let i = 0; i < serverNodes.length; i++) {
  console.log(`Pinging: ${serverNodes}`);
}

console.log("===== The Modern Iterable Protocol (for...of)");
// ------------------------------------------
// The engine automatically asks the Array for its Iterator.
// It handles the counting, the extraction, and the termination automatically.
// This is the enterprise standard when you NEED a traditional loop.

for (const node of serverNodes) {
  // Note: We use `const` because `node` is a brand new variable created
  // for every single iteration of the loop.
  console.log(`Pinging: ${node}`);
}

console.log("===== The Object Iteration Trap (for...in)");
// ------------------------------------------
// Rule on for...in: > Never use for...in on an Array. for...in is designed to loop over the string Keys of an Object, not the Values of an Array. If someone modifies the Array's prototype, for...in will iterate over the injected prototype methods and crash your logic.
// Objects are NOT Iterables. You cannot use `for...of` on a standard Object.
// If you must loop an Object, you use `for...in`, which grabs the KEYS.

Object.prototype.hackedProperty = "I am everywhere now...";
// The for...in loop doesn't just loop through the properties you explicitly added to an object. It also loops through any enumerable properties the object inherited from its prototype chain.
const databaseConfig = {
  host: "10.0.0.45",
  port: 5432,
  ssl: true,
};

for (const key in databaseConfig) {
  console.log(`Config [${key}] = ${databaseConfig[key]}`);
}

// for (const key, value in databaseConfig){
//    console.log(`Config [${key}] = ${value}`);
// }

console.log("===== The Functional Teaser (.forEach)");
// ------------------------------------------
// While `for...of` is great, in React and Node.js, we heavily favor Functional Array Methods. These methods lock the iteration inside an Execution Context Callback.

serverNodes.forEach(node => {
  console.log(`Pinging : ${node}`);
});

// When do you use which?
// Need to loop an Array and might need to break or continue early? Use for...of.

// Need to loop an Object's keys? Use for...in (or better yet, Object.keys(obj)).

// Need to execute an asynchronous await inside the loop? You must use for...of or a standard for loop. (Functional .forEach cannot handle await properly).

// Just need to run logic on every item in an array? Use .forEach().

//while loop
var i = 1;
while (i < 5) {
  // console.log(i);
  i++;
}

//do while loop
var j = 5;
do {
  // console.log(j);
  j++;
} while (j < 4);
