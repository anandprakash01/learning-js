// ==========================================
// MODULE 17.3: TELEMETRY & STRUCTURED LOGGING
// ==========================================

// ==========================================
// PART I: THE `console.log` TRAP
// ==========================================
// This is the #1 architectural sin of a Junior Node.js Developer.
// They deploy code with `console.log("User logged in")`.

// THE PHYSICS OF THE CRASH:
// 1. `console.log` is often SYNCHRONOUS in Node.js when writing to a terminal.
//    If you log massive objects, you block the Event Loop!
// 2. It has no "Levels". You cannot easily filter "Errors" from "Info".
// 3. It writes raw text. External monitoring tools (like Datadog or Splunk)
//    cannot search or index raw text efficiently.

// ==========================================
// PART II: STRUCTURED LOGGING (Winston / Pino)
// ==========================================
// In the Enterprise, we use a dedicated Logging Engine (like Pino or Winston).
// A Logger converts your text into highly structured JSON objects and streams
// them asynchronously so the Event Loop is never blocked.

// Pseudo-code for an Enterprise Logger setup:
/*
import pino from 'pino';

// We create a central logger instance
const logger = pino({
    level: process.env.LOG_LEVEL || 'info', // In Prod, we only log 'info' and above
    timestamp: pino.stdTimeFunctions.isoTime,
});

export const processCheckout = (userId, amount) => {
    // ❌ THE JUNIOR WAY:
    // console.log("Processing payment for", userId, "amount:", amount);

    // ✅ THE ARCHITECT'S WAY:
    // We pass an Object first (for Datadog to index), and a Message second.
    logger.info({ userId, amount, action: "checkout_started" }, "Initiating payment process");
    
    try {
        // ... payment logic ...
        logger.info({ userId }, "Payment successful");
    } catch (error) {
        // We log the exact error stack trace as 'error' level!
        logger.error({ err: error, userId }, "Payment failed");
    }
};
*/

// ==========================================
// PART III: ERROR TRACKING (The Sentry Integration)
// ==========================================
// Logs are great for searching, but you don't want to stare at logs all day.
// If a critical error happens, you want your phone to buzz immediately.
// We achieve this using an Error Tracking SDK (like Sentry).

/*
import * as Sentry from "@sentry/node";

// 1. Initialize the connection to the external Sentry server
Sentry.init({
    dsn: "https://your-secret-key@sentry.io/project-id",
    tracesSampleRate: 1.0, // Track 100% of performance bottlenecks
});

export const dangerousDatabaseQuery = async () => {
    try {
        await executeQuery();
    } catch (error) {
        // 2. THE FLIGHT RECORDER:
        // This physically pauses, gathers the exact V8 Call Stack, grabs the 
        // user's IP address, OS version, and Node version, and beams it all to Sentry.
        // Sentry then sends an alert to your company's Slack channel.
        Sentry.captureException(error);
        
        throw new Error("Database query failed");
    }
};
*/

// ==========================================
// PART IV: THE GLOBAL PANIC CATCHER
// ==========================================
// What happens if an error occurs OUTSIDE of a try/catch block?
// If a Promise rejects and nobody catches it, the Node.js process will instantly die.
// An Architect ALWAYS sets up a Global Panic Catcher at the very top of `server.js`.

process.on("uncaughtException", error => {
  // 1. Log the catastrophic failure
  // logger.fatal({ err: error }, "SERVER CRASH: Uncaught Exception");

  // 2. Beam to Sentry
  // Sentry.captureException(error);

  // 3. Gracefully shut down the server so PM2 or Kubernetes can restart a fresh copy.
  console.error("Initiating emergency shutdown...");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Async Promise Rejection:", reason);
  // Handle the same as above...
});
