// Imagine you are building an email client (like Gmail). The user's inbox has 1,000 emails. Each email has a "Delete" button.

// If you use a for loop to attach an addEventListener to all 1,000 delete buttons, you have just created 1,000 separate memory pointers. The browser's RAM usage will spike, the page will load slowly, and if the user deletes a row, you have to manually detach the listener to prevent a memory leak.

// Senior Engineers never do this. They attach exactly ONE event listener to handle all 1,000 buttons.

// ==========================================
// SETUP: Injecting 50 Items (Using our Fragment trick!)
// ==========================================
const connectionList = document.getElementById("connection-list"); // <ul>
const fragment = document.createDocumentFragment();

for (let i = 2; i <= 50; i++) {
  const li = document.createElement("li");
  li.innerHTML = `Connection ${i} <button class="delete-btn" data-id="${i}">Terminate</button>`;
  fragment.append(li);

  const liMarkup = `<li>Connection ${i} <button class="delete-btn" data-id="${i}">Terminate</button></li>`;
  // fragment.append(liMarkup);
  // .append() treats strings as plain text rather than HTML elements. Instead of seeing a list item with a button, your page likely displays the literal code: <li>Connection 1...</li>.

  // This parses the string as HTML
  // fragment.insertAdjacentHTML("beforeend", liMarkup);
  // DocumentFragment does not support insertAdjacentHTML.
}
// connectionList.append(fragment);

// ==========================================
// PART I: THE PHYSICS OF EVENT BUBBLING
// ==========================================
// The standard DOM Events describes 3 phases of event propagation:
// => Capturing phase – the event goes down to the element.
// => Target phase – the event reached the target element.
// => Bubbling phase – the event bubbles up from the element.

// When you click a button inside an <li>, which is inside a <ul>, which is inside a <div>...
// The browser doesn't just trigger the button.
// The "Click Event" starts at the button, and then physically BUBBLES UP the DOM tree.
// Button clicked -> <li> clicked -> <ul> clicked -> <div> clicked -> <body> clicked.

// We can prove this by attaching a listener to the very top of the page!
document.body.addEventListener("click", () => {
  // If you click ANYWHERE on the screen, this will fire!
  console.log("A click bubbled all the way up to the Body!");
});

// ==========================================
// PART II: EVENT DELEGATION (The Enterprise Pattern)
// ==========================================
// Instead of attaching 50 listeners to 50 buttons, we attach ONE listener to the parent container (the <ul>).

connectionList.addEventListener("click", event => {
  // event.stopPropagation();// to prevent the event bubbling, this is event capturing

  // The `event` object tracks two very different things:
  // 1. event.currentTarget: The element that HAS the listener attached (The <ul>)
  // 2. event.target: The EXACT deepest element that physically triggered the event (The Button)

  console.log("Listener fired on:", event.currentTarget.tagName);
  console.log("User physically clicked:", event.target.dataset.id);

  // ==========================================
  // PART III: THE FILTER (The Magic Step)
  // ==========================================
  // Because the listener is on the <ul>, it fires if we click the blank space between rows!
  // We must FILTER the target to ensure they actually clicked a "Terminate" button.

  if (event.target.classList.contains("delete-btn")) {
    // We use the `dataset` API to read the exact ID of the button they clicked
    const dbId = event.target.dataset.id;
    console.log(`Executing termination sequence for Database ID: ${dbId}`);

    // We traverse UP from the button to the <li> and delete the entire row
    const rowToDelete = event.target.parentElement;
    rowToDelete.remove();

    // We just handled 50 buttons with ONE single event listener in memory.
  }
});
