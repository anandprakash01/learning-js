// ==========================================
console.log("===== DOM TRAVERSAL & MANIPULATION =====");
// ==========================================

// ==========================================
// PART I: TRAVERSAL (The Family Tree)
// ==========================================
// We start with a single pointer: The active node.
const activeNode = document.querySelector(".active-node");

// 1. Moving UP (Parent)
const parentList = activeNode.parentElement;
console.log("Parent:", parentList.id); // "node-list"

// 2. Moving SIDEWAYS (Siblings)
// Notice we use `ElementSibling`. If we just used `nextSibling`, the engine might return the invisible "Space/Enter key" text node!
const nextNode = activeNode.nextElementSibling;
console.log("Next Sibling:", nextNode.innerText); // "Node Beta"
const nextNode_next = nextNode.nextElementSibling;
console.log("Next Sibling of Node Beta:", nextNode_next.innerText); // "Node Gamma"

// 3. Moving DOWN (Children)
const rackContainer = document.getElementById("server-rack");
console.log("First Child:", rackContainer.firstElementChild.innerText); // "Primary Rack"
console.log("All Element Children:", rackContainer.children); // HTMLCollection

// ==========================================
// PART II: CREATION & INJECTION (Mutating the Screen)
// ==========================================
// We want to add "Node Delta" to the list. There are two ways to do this.

// ❌ METHOD 1: innerHTML)
// It is easy, but it forces the browser to completely destroy the existing UI, re-parse the HTML string, and rebuild the nodes. It is slow and exposes you to Cross-Site Scripting (XSS) attacks if you inject user input.
// parentList.innerHTML += '<li>Node Delta</li>';

// ✅ METHOD 2: The Enterprise Way (createElement)
// We tell the engine to allocate a brand new HTML Element in memory.
const newNode = document.createElement("li");

// We mutate its properties in memory (Safely escaping any text).
newNode.innerText = "Node Delta";
newNode.classList.add("standby-node");

// We physically attach the memory pointer to the DOM Tree.
parentList.append(newNode); // Adds it to the bottom
// parentList.prepend(newNode); // Adds it to the top
// activeNode.after(newNode); // Squeezes it right after Node Alpha

// ==========================================
// PART III: DELETION (Pruning the Tree)
// ==========================================
// We want to completely remove "Node Gamma" from the screen.
const allNodes = document.querySelectorAll("#node-list li");
const targetNode = allNodes[2]; // Node Gamma

// Modern browsers allow the node to physically detach itself.
targetNode.remove();

// ==========================================
// PART IV: THE ENTERPRISE PERFORMANCE TRAP (DocumentFragment)
// ==========================================
// Imagine we need to fetch 1,000 servers from a database and render them.
// If we use a `for` loop and call `parentList.append(node)` 1,000 times, the browser has to recalculate the physics of the entire screen 1,000 times.
// This is called "Layout Thrashing", and it will freeze the browser.

// THE ARCHITECT'S FIX: The DocumentFragment.
// A Fragment is an invisible, temporary DOM tree that lives purely in RAM.
// It is NOT attached to the screen.

console.time("Fragment Render");
// When the engine hits this line, it starts a high-resolution background timer in C++ and tags it with the exact string you provide (e.g., "Fragment Render").

// 1. Create the invisible memory container
const memoryFragment = document.createDocumentFragment();

// 2. Do the heavy looping and append 1,000 items to the INVISIBLE fragment.
// Because it's not on screen, the browser physics engine doesn't care!
for (let i = 1; i <= 1000; i++) {
  const li = document.createElement("li");
  li.innerText = `Virtual Node ${i}`;
  memoryFragment.append(li);
}

// 3. Attach the Fragment to the real DOM ONCE.
// The fragment itself vanishes, and its 1,000 children are injected in a single microsecond.
// parentList.append(memoryFragment);

console.timeEnd("Fragment Render");
// When the engine hits this line, it looks for the stopwatch with the exact matching string. It stops the timer, calculates the difference, and automatically prints the result to your browser console in milliseconds.
