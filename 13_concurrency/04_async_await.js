// Dummy fetcher for our examples
const fetchUser = () =>
  new Promise(resolve => setTimeout(() => resolve({name: "Anand"}), 1000));

// async and await are keywords used to handle asynchronous operations—tasks that take time to complete, like fetching data from a server or reading a large file—without freezing the rest of your application.

// ==========================================
// PART I: THE `async` KEYWORD
// ==========================================
// Placing `async` in front of ANY function instantly changes its physical behavior.
// 1. It forces the function to ALWAYS return a Promise.
// 2. If the function returns a value, it is automatically wrapped in a resolved promise. `Promise.resolve()`.

async function getSystemStatus() {
  return "SYSTEM ONLINE"; // The Engine translates this to: return Promise.resolve("SYSTEM ONLINE")
}

// PROOF: It returns a Promise, not a string!
console.log(getSystemStatus()); // Output: Promise { 'SYSTEM ONLINE' }

// ==========================================
// PART II: THE `await` PHYSICS (Suspending the Context)
// ==========================================
// `await` can ONLY be used inside an `async` function.
// When the V8 Engine reads the word `await`, it does something incredible:
// It completely PAUSES the execution of this specific function, steps out of the function, and goes back to the main Event Loop to run other code.
// When the Promise resolves, the engine comes back and resumes this function on the exact next line.

async function displayDashboard() {
  console.log("1. Requesting user data...");

  // THE SUSPENSION:
  // The engine hits `await`. It pauses `displayDashboard` right here.
  // It unwraps the Promise and assigns the FULFILLED data directly to the variable!
  console.log(fetchUser()); // Promise { <pending> }
  const user = await fetchUser();

  // This line physically cannot run until the Promise above is resolved.
  console.log(`2. Welcome to the dashboard, ${user.name}`);
}

displayDashboard();
console.log("3. Meanwhile, the main thread is NOT blocked!");

// OUTPUT ORDER:
// "1. Requesting user data..."
// "3. Meanwhile, the main thread is NOT blocked!"
// [1 second later...]
// "2. Welcome to the dashboard, Anand"

// ==========================================
// PART III: ERROR ROUTING (Bringing back try/catch)
// ==========================================
// Because `await` unwraps Promises synchronously, we can no longer use `.catch()`.
// Instead, we get to use the exact same `try/catch` architecture

const dangerousFetch = () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error("DB Crash")), 1000));

async function secureProcess() {
  try {
    console.log("Attempting secure fetch...");
    // If this Rejects, the engine instantly throws an Exception.
    const data = await dangerousFetch();

    // This line is skipped if an error is thrown.
    console.log(data);
  } catch (error) {
    // The Panic is routed cleanly into our standard error boundary!
    console.error("Caught the panic:", error.message);
  }
}
secureProcess();

// ==========================================
// PART IV: THE ENTERPRISE CONCURRENCY TRAP
// ==========================================
// This is the #1 mistake developers make with Async/Await. They accidentally destroy concurrency by `await`ing in a sequence.

const fetchPosts = () => new Promise(r => setTimeout(() => r("Posts"), 2000));
const fetchComments = () => new Promise(r => setTimeout(() => r("Comments"), 2000));

// ❌ Sequential - Takes 4 Seconds
async function loadPageSlow() {
  const posts = await fetchPosts(); // Engine pauses for 2s
  const comments = await fetchComments(); // Engine pauses for ANOTHER 2s
  console.log("loadPageSlow: ", posts, comments);
}
loadPageSlow();

// ✅ THE ARCHITECT'S FIX (Concurrent - Takes 2 Seconds)
// We kick off both Promises WITHOUT awaiting them so they run at the exact same time. Then, we use Promise.all to await the array!
async function loadPageFast() {
  const postsPromise = fetchPosts();
  const commentsPromise = fetchComments();

  // We await the Master Promise.
  const [posts, comments] = await Promise.all([postsPromise, commentsPromise]);
  console.log("loadPageFast: ", posts, comments);
}

loadPageFast();
