// ==========================================
// PART I: THE BASE CLASS (The Parent)
// ==========================================

class Employee {
  constructor(name, department) {
    this.name = name;
    this.department = department;
  }
  login() {
    return `${this.name} has logged into the ${this.department} network`;
  }
}
// ==========================================
// PART II: THE `extends` KEYWORD (Memory Welding)
// ==========================================
// `extends` does exactly one thing in the V8 Engine:
// It takes the `Manager.prototype` vault and permanently sets its hidden `__proto__` link to point to the `Employee.prototype` vault.

class Manager extends Employee {
  // ==========================================
  // PART III: THE `super()` KEYWORD
  // ==========================================
  constructor(name, department, accessLevel) {
    // TRAP: The "this" Keyword Paradox
    // In a child class, the V8 Engine DOES NOT automatically create the `{}` for `this`. It forces the Parent class to create it first.
    // If you try to use `this` before calling `super()`, the engine crashes instantly:
    // this.accessLevel = accessLevel;// ReferenceError: Must call super constructor in derived class before accessing 'this'
    // FIX: You MUST call `super()`.
    // `super` is literally a pointer to the Parent's constructor (`Employee`).
    // We pass the required data UP the chain to the parent.
    super(name, department);

    // Now, and ONLY now, does `this` exist in memory.
    // We can safely attach our unique child data to it.
    this.accessLevel = accessLevel;
  }
  // ==========================================
  // PART IV: POLYMORPHISM (Method Overriding)
  // ==========================================
  // If the Child has a method with the EXACT SAME NAME as the Parent, the Child's method "shadows" (overrides) the Parent's method.
  // Why? Because the engine searches the Child's prototype first!

  login() {
    // What if we want to run the Parent's logic, AND add our own?
    // We use `super.methodName()` to reach up the chain and grab the parent's function.
    const baseLoginMessage = super.login();

    return `${baseLoginMessage} [OVERRIDE: Admin Access Level ${this.accessLevel} Granted]`;
  }
  terminateEmployee(employeeName) {
    return `Manager ${this.name} has terminated ${employeeName}.`;
  }
}

// ==========================================
// THE EXECUTION & MEMORY VERIFICATION
// ==========================================

const director = new Manager("Anand", "Engineering", 5);

// 1. Calling an overridden method
console.log(director.login());
// "Anand has logged into the Engineering network. [OVERRIDE: Admin Access Level 5 Granted]"

// 2. Calling a child-specific method
console.log(director.terminateEmployee("Legacy_System"));
// "Manager Anand has terminated Legacy_System."

// ===== PROVING THE MEMORY WELD
// Let's trace the `director` object all the way up the Prototype Chain.

console.log(director.__proto__ === Manager.prototype); // true (Level 1)
console.log(director.__proto__.__proto__ === Employee.prototype); // true! (Level 2: The Weld)
console.log(director.__proto__.__proto__.__proto__ === Object.prototype); // true (Level 3: The Master Blueprint)
console.log(director.__proto__.__proto__.__proto__.__proto__ === null); // true (The End of the Universe)

// The Golden Rules of super
// If you write a constructor in a class that extends another class, you must call super().

// You must call super() before you ever write the word this.

// super() acts as the initializer. It tells the parent to build the memory object and hand it down to the child so the child can add its own specific properties.
