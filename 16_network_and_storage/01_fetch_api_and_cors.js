// To build a persistent, global application, the browser must open a communication socket to the outside world. It must talk to external databases, microservices, and third-party APIs.

// The V8 Engine handles this using a modern Web API called fetch. But opening a port to the internet is dangerous, so browser architects built a massive security wall called CORS.

// ==========================================
// PART I: THE NETWORK BRIDGE (GET Requests)
// ==========================================
// `fetch` is a Web API that delegates HTTP requests to a background thread.
// It instantly returns a Promise (Connecting back to Phase 13!).

const getUserD = () => {
  console.log("1. Starting Fetch...");
  fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => response.json())
    .then(result => {
      console.log("2. Fetch completed: ", result.name);
    })
    .catch(error => {
      console.error("Unable to fetch data... ", error.message);
    });
};
getUserD();

const getUserData = async () => {
  console.log("1. Opening network socket...");

  try {
    // The engine suspends this function while the network thread waits for the server.
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    // THE TWO-STEP UNWRAP:
    // `fetch` resolves as soon as the headers arrive. But the body (the data) might still be streaming in over the wire!
    // We must `await` a second time to parse the streaming bytes into a JSON object.
    const data = await response.json();

    console.log("2. Data received:", data.name);
  } catch (error) {
    console.error("Network failed physically (e.g., WiFi dropped):", error);
  }
};

getUserData();

// ==========================================
// PART II: THE POST PAYLOAD (Sending Data)
// ==========================================
// To send data to a server, we must configure the HTTP Request.
// We pass a Configuration Object as the second argument to `fetch`.

const createServerNode = async nodeName => {
  const payload = {name: nodeName, status: "active"};

  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST", // The HTTP Action
    headers: {
      // We MUST tell the receiving server how to decode our data!
      "Content-Type": "application/json",
    },
    // We cannot send memory pointers over a wire.
    // We must serialize the Object into a flat string of bytes.
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log("Server created:", result);
};
createServerNode();

// ==========================================
// PART III: THE ENTERPRISE TRAP (Error Handling)
// ==========================================
// `fetch` ONLY rejects its Promise if the physical network fails (e.g., unplugged router).
// It does NOT reject if the server replies with a 404 (Not Found) or 500 (Server Crash)!

async function dangerousFetch() {
  try {
    // We request a URL that doesn't exist
    const response = await fetch("https://jsonplaceholder.typicode.com/invalid-url");

    // ❌ ASSUMPTION: "If I'm here, it succeeded!"
    // Actually, the server successfully replied with: "404 Error"

    // ✅ THE ARCHITECT'S CHECK:
    // We must manually inspect the `ok` property (true if status is 200-299)
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`); // Manually route to catch block
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    // Now it correctly catches both WiFi drops AND 404/500 errors!
    console.error("Fetch aborted:", error.message);
  }
}
// dangerousFetch();

// ==========================================
// PART IV: CORS (Cross-Origin Resource Sharing)
// ==========================================
// By default, browsers enforce the "Same-Origin Policy" for extreme security.
// If your frontend is running on `http://localhost:3000`, the browser strictly FORBIDS it from fetching data from `https://api.github.com`... unless GitHub gives explicit permission.

const fetchSecureData = async () => {
  // When you attempt this fetch, the browser pauses.
  // It secretly sends an invisible "OPTIONS" request (Preflight) to the server first.
  // It asks: "Is localhost:3000 allowed to talk to you?"
  // If the server does NOT reply with a header saying:
  // `Access-Control-Allow-Origin: *` (or your specific URL)...
  // The browser physically blocks the response and throws a CORS Error in your console!
  /*
      THE FIX: 
      CORS errors cannot be fixed in Frontend JavaScript. 
      They are a strict browser security mechanism. 
      You MUST configure your Backend Node.js/Python server to send the correct headers, 
      or use a Proxy server to bypass the browser entirely.
    */
};
// The Double Await: fetch() resolves the headers. .json() resolves the streaming body. You must await both.

// The 404 Trap: A 404 is technically a "successful" communication with the server. The server successfully told you it couldn't find the file. Therefore, the Promise fulfills. You must manually check response.ok.
