// we must take that invisible memory and physically paint pixels onto the user's screen. To do this, the V8 Engine must cross a bridge to talk to the Browser's rendering engine (like Blink in Chrome). That bridge is called the Document Object Model (DOM).

// The DOM is not JavaScript. It is a massive C++ API built into the browser. JavaScript merely sends instructions across the bridge to manipulate it.

console.log("===== DOM Engine Initialized. Inspecting Nodes...");

// ==========================================
// PART I: THE NODE TREE
// ==========================================
// We verify that the browser created the Document Root and the Body element.
console.log("Document Node Type:", document.nodeType); // 9
console.log("Body Element Node Type:", document.body.nodeType); // 1

// ==========================================
// PART II: THE LEGACY SELECTORS (C++ Hash Map Speed)
// ==========================================
// 1. Grabbing the specific ID
const dashboard = document.getElementById("main-dashboard");
console.log("[getElementById]:", dashboard);

// 2. Grabbing all elements with a class (Returns an HTMLCollection)
const primaryButtons = document.getElementsByClassName("btn-primary");
console.log("[getElementsByClassName]: Found", primaryButtons, "buttons.");

// document.getElementsByTagName()

// ==========================================
// PART III: THE MODERN SELECTORS (CSS Engine)
// ==========================================
// 1. Grabbing the nested submit button inside the form
const submitButton = document.querySelector(".form-group > #submit-btn");
console.log("[querySelector]:", submitButton.innerText); // "Submit Login"

// 2. Grabbing all 'a' tags inside the 'nav' list
const navLinks = document.querySelectorAll("nav ul li a");
console.log("[querySelectorAll]: Found", navLinks.length, "navigation links.");

// ==========================================
// PART IV: THE ENTERPRISE TRAP (Live vs. Static)
// ==========================================
console.log("===== THE COLLECTION TRAP");

// We grab the 3 boxes using BOTH methods.
const liveBoxes = document.getElementsByClassName("box");
const staticBoxes = document.querySelectorAll(".box");

console.log("Initial state:");
console.log("liveBoxes length:", liveBoxes.length); // 3
console.log("staticBoxes length:", staticBoxes.length); // 3

// NOW, we dynamically hack a 4th box into the HTML using JavaScript!
const container = document.getElementById("box-container");
container.innerHTML += '<div class="box">Server Node 4 (Dynamically Injected)</div>';

console.log("After injecting a 4th box:");

// The Live Collection automatically updated itself!
console.log("liveBoxes length:", liveBoxes.length); // 4 (DANGEROUS FOR LOOPS)

// The Static NodeList stayed exactly the same as when we first queried it!
console.log("staticBoxes length:", staticBoxes.length); // 3 (SAFE FOR LOOPS)

// ===== setAttributes

// selectedEl = document.querySelector("");
// selectedEl.setAttribute("class", "box");
// selectedEl.classList.add("my-class");
// selectedEl.appendChild(newEl);
