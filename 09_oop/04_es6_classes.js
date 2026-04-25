// the TC39 committee realized that making developers type .prototype and manually link objects was confusing for engineers coming from C++ and Java. So, in ES6, they created a massive "syntactic sugar" wrapper over this exact prototype system.
// The `class` keyword is just a prettier way to write the same code we had before. It does NOT change how the engine works under the hood. It is purely for readability and developer ergonomics.
// Underneath the syntax, there are no actual rigid classes in JavaScript. The V8 Engine takes your class code and secretly compiles it down into the exact same Constructor Functions and Prototype Chains.

console.log("===== Modern Syntax");

class DatabaseNode {
  // 1. The `constructor` block is exactly the same as the old Constructor Function.
  // This is where we define data UNIQUE to each instance.
  constructor(ipAddress, port) {
    this.ipAddress = ipAddress;
    this.port = port;
  }
  // 2. Methods written directly inside the class body are AUTOMATICALLY placed onto the `DatabaseNode.prototype` vault by the V8 Engine.
  // They are NOT duplicated on every instance!
  connect() {
    return `Connecting to ${this.ip}...`;
  }
}
const nodeA = new DatabaseNode("192.168.0.1", 8080);

// ------------------------------------------
// Let's prove that this is just fake syntax hiding our old prototype system:
console.log(typeof DatabaseNode); // "function" (Wait, it's not a class? No, it's a function!)

console.log(DatabaseNode.prototype); // {} (The methods are on the prototype vault but here doesn't show!)

const hiddenMethods = Object.getOwnPropertyNames(DatabaseNode.prototype);
console.log(hiddenMethods); // here methods will show, check at the last for more details

console.log(nodeA.__proto__ === DatabaseNode.prototype); // true (The hidden link is still there!)
console.log(nodeA.hasOwnProperty("connect")); // false (It lives in the shared vault)

console.log("===== Hoisting Strictness (The TDZ Trap)");
// ------------------------------------------
// Classic Constructor Functions are fully hoisted. You can `new` them before they are written.
// ES6 Classes are NOT hoisted. They are trapped in the Temporal Dead Zone (TDZ).

// const crash = new Server("AWS"); // ReferenceError: Cannot access 'Server' before initialization
class Server {
  constructor(name) {
    this.name = name;
  }
}

console.log("===== Getters and Setters (Data Encapsulation)");
// ------------------------------------------
// Enterprise codebases use `get` and `set` to run validation logic before allowing a developer to read or mutate a property.

class UserAccount {
  constructor(username, initialPassword) {
    this.username = username;
    // Standard convention: use `_` to signal a property is meant to be "private" (not actually private, just a convention)
    this._password = initialPassword;
  }
  // GETTER: Acts like a property, but runs a function.
  get password() {
    // Masking the return value
    return `${this._password.slice(0, 3)}****`;
  }
  // SETTER: intercepts assignment (=) to run validation.
  set password(newVal) {
    if (newVal.length < 6) {
      console.error("Password too short!");
      return;
    }
    this._password = newVal;
  }
}

const admin = new UserAccount("Anand", "secret123");

// We access them like properties, NOT functions! (No parentheses)
console.log(admin.password); // "sec****"
admin.password = "123"; // "Password too short!"

console.log("===== Static Methods (Constructor-Level Memory)");
// ------------------------------------------
// Sometimes you need a utility function that belongs to the Class itself,
// NOT to the instances it creates. We use the `static` keyword.

class MathUtils {
  // This is attached directly to the `MathUtils` function object in memory.
  // It is NEVER attached to `MathUtils.prototype`.
  static generateId() {
    return Math.random().toString(36).substring(2);
  }
}

// You call it directly on the Class:
console.log(MathUtils.generateId());

// You CANNOT call it on an instance:
const utilInstance = new MathUtils();
// console.log(utilInstance.generateId()); // TypeError: utilInstance.generateId is not a function

// ========================================
// why "DatabaseNode.prototype" give empty obj

// theres nothing wrong, and the connect method is physically in the memory vault. The reason terminal is printing {} (an empty object) comes down to a hidden V8 Engine configuration called Property Descriptors.

// Every property inside a JavaScript object has a hidden configuration object attached to it. One of the settings in that configuration is called enumerable.

// If enumerable: true, the property shows up in console.log() and for...in loops.
// If enumerable: false, the engine hides it from the console to keep loops clean, even though it physically exists in memory.

//  ES5 vs ES6 Physics
// When we manually mutated the prototype in the older ES5 syntax, the V8 Engine defaulted to making our method visible.
// When the TC39 committee designed ES6 Classes, they made a strict architectural decision: All methods defined inside a class body are automatically set to enumerable: false. They did this to protect prototype methods from accidentally firing if developer writes a for...in loop over the object.

// The for...in Loop Trap
// The for...in loop is designed to iterate over the keys of an Object.
// However, it does not stop at the object itself. By default, it travels up the hidden __proto__ chain and grabs every single enumerable property it finds in the shared vaults as well.

// Let's look at exactly what happens if we use the old ES5 architecture where prototype methods were visible (enumerable: true).

function LegacyUser(name, age) {
  this.name = name;
  this.age = age;
}
LegacyUser.prototype.deleteAccount = function () {
  console.log("DANGER: Account Deleted!");
};

const userA = new LegacyUser("Anand", 28);
for (let key in userA) {
  // They expect this to just print "name" and "age"
  console.log(`Key: ${key} | Value: ${userA[key]}`);
}
// OUTPUT:
// Key: name | Value: Anand
// Key: age | Value: 28
// Key: deleteAccount | Value: function() { console.log("DANGER...") } <-- THE BUG!

// The Pre-ES6 "Manual" Fix
// To prevent this in the old days, Senior Architects couldn't just write,
// LegacyUser.prototype.method = function()
// They had to write massive, ugly blocks of code using Object.defineProperty to manually lock the memory vault:

Object.defineProperty(LegacyUser.prototype, "deleteAccount", {
  value: function () {
    console.log("Deleted");
  },
  enumerable: false, // <-- Forcing the V8 Engine to hide it from loops
  writable: true,
  configurable: true,
});

console.log(LegacyUser.prototype); // now this will not show in console.log()

// The ES6 class Solution
// The V8 Engine do it automatically for every single method inside a class block.
