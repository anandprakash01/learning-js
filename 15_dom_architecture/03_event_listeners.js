// ==========================================
// PART I: THE ELECTRICAL WIRE (addEventListener)
// ==========================================
// We select our button from the HTML Canvas.
const saveButton = document.querySelector(".btn-primary");

// We attach an Event Listener.
// Arg 1: The physical event to listen for (e.g., 'click', 'mouseenter', 'keydown').
// Arg 2: The Callback Function to execute when the event happens.
saveButton.addEventListener("click", function () {
  console.log("✅Configuration Saved!✅");
});

// THE PHYSICS OF THE EVENT LOOP:
// When you attach a listener, V8 registers it with the Browser's Web APIs.
// When the user actually clicks the mouse, the Browser pushes the callback function into the MACROTASK QUEUE. The Event Loop waits for the Call Stack to empty, and then executes your function.

// ==========================================
// PART II: THE EVENT OBJECT (The Data Payload)
// ==========================================
// Whenever an event fires, the browser automatically passes a massive C++ Object into your callback function. This object contains every detail about the exact microsecond the hardware triggered the event.

const loginForm = document.querySelector(".form-group");
const usernameInput = document.querySelector(".form-group input");

// We listen for the user typing on the keyboard...
usernameInput.addEventListener("keydown", event => {
  // The `event` object tells us EXACTLY what they pressed!
  console.log(`User pressed the key: ${event.key}`);

  // Architect Trick: Preventing spaces in a username!
  if (event.key === " ") {
    event.preventDefault(); // INSTANTLY blocks the default browser behavior!
    console.warn("Spaces are not allowed in usernames.");
  }
});

// ==========================================
// PART III: PREVENTING FORM SUBMISSIONS
// ==========================================
// By default, when a user clicks 'Submit' on a <form>, the browser instantly triggers a hard page refresh, destroying your entire JavaScript memory state!

loginForm.addEventListener("submit", event => {
  // 1. STOP THE HARD REFRESH!
  event.preventDefault();

  // 2. Now we can safely execute our JavaScript logic.
  console.log(`Authenticating user: ${usernameInput.value}`);

  // (Here is where we would use fetch() to talk to our Node.js server)
});

// ==========================================
// PART IV: MEMORY LEAKS & REMOVAL (Connecting to Phase 14)
// ==========================================
// If you delete an element from the DOM, but forget to remove its Event Listener, the V8 Engine keeps the element alive in the Heap! (A Memory Leak).

function deploySystem() {
  console.log("Deploying Server...");

  // We want this button to only work ONCE.
  // So we must explicitly detach the wire after it fires.
  deployButton.removeEventListener("click", deploySystem);
  console.log("Listener removed. Button is now dead.");
}

const deployButton = document.querySelectorAll(".btn-primary")[1];

// Notice we pass the named function, NOT an anonymous arrow function!
// You cannot use `removeEventListener` with anonymous functions, because the engine needs the exact memory pointer to know which wire to cut.
deployButton.addEventListener("click", deploySystem);

// ARCHITECT'S SHORTCUT:
// Modern browsers let you pass a configuration object to do this automatically!
// deployButton.addEventListener('click', deploySystem, { once: true });

// The Physics of { once: true }
// Historically, addEventListener only took two arguments: the event ('click') and the callback function (deploySystem).

// But as web applications got massive, developers kept forgetting to use removeEventListener, causing thousands of memory leaks. To fix this, browser architects added an optional third argument: a Configuration Object.

// When you pass { once: true }, you are giving the Browser's Event Loop a strict set of instructions:

// Listen: Attach the wire to the button.

// Execute: When the user clicks the button, fire the deploySystem function.

// Self-Destruct: The exact microsecond the function finishes running, automatically sever the wire and delete the Event Listener from memory.

// If you have a "Submit Payment" button or a "Deploy Server" button, you never want the user to be able to click it twice. Instead of manually writing button.removeEventListener(...) inside your own function, you just pass { once: true } and let the C++ browser engine handle the memory cleanup flawlessly.

// Browser events:
//     -> click
//     -> submit / focus / change / select / reset
//     -> keydown/keyup
//     -> mouseover/mouseout
//     -> mousedown/mouseup
//     -> mousemove
//     -> contexmenu   (mouse right click)

//     -> DOMContentLoaded
//     -> transitionend
