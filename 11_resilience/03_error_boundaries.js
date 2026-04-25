// ==========================================
// PART I: THE NODE.JS GLOBAL CATCHERS
// ==========================================
// In a Node.js backend environment, the `process` object is the master controller of the entire V8 Engine instance. We can attach emergency listeners directly to it.

console.log("===== uncaughtException (Synchronous Panics)");
// ------------------------------------------
// This fires when a standard `throw` statement completely escapes all `try/catch` blocks and reaches the absolute top of the Call Stack.

process.on("uncaughtException", error => {
  console.error("\n[🚨 CRITICAL]: Uncaught Exception detected!");
  console.error(`Message: ${error.message}`);
  console.error(`Stack: ${error.stack}`);

  // THE ENTERPRISE RULE: The "Let It Crash" Philosophy
  // NEVER leave the server running after an uncaught exception.
  // The V8 Heap memory is now in an undefined, potentially corrupted state.
  // If you don't exit, you risk leaking sensitive data or cross-contaminating user sessions.

  // We log it to our telemetry system (e.g., Datadog, Sentry), then explicitly kill the server.
  // `1` means "Exit with a Failure Code" so the system knows it crashed.
  console.error("[SYSTEM]: Initiating emergency shutdown...");
  process.exit(1);
});

console.log("===== unhandledRejection (Asynchronous Panics)");
// ------------------------------------------
// This fires when a Promise fails (e.g., a database connection drops), but nobody attached a `.catch()` block to handle the failure.

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n[⚠️ WARNING]: Unhandled Promise Rejection!");
  console.error("Reason: ", reason);

  // Unlike an uncaughtException, an unhandledRejection doesn't always corrupt the global Heap.
  // However, Node.js is moving toward terminating the process on these as well.
  // Best practice is to treat them as critical failures.

  // server.close(() => process.exit(1)); // Graceful shutdown pattern
});

// ==========================================
// PART II: THE FRONTEND EQUIVALENT (React)
// ==========================================
// Browsers do not have a `process` object. If an unhandled error reaches the top of the browser's execution context, React unmounts the ENTIRE component tree, leaving the user staring at a blank white screen (The White Screen of Death).

// To fix this, React Architects build an "Error Boundary" Class Component.
// This is one of the rare times you MUST use an OOP Class in modern React, because hooks do not support this lifecycle method yet.

/*
class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // 1. The Interceptor: Catches the crash before it kills the screen.
    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    // 2. The Telemetry Hook: Sends the crash report to the backend.
    componentDidCatch(error, errorInfo) {
        logErrorToMyService(error, errorInfo.componentStack);
    }

    // 3. The Graceful Degradation: Show a friendly message instead of a white screen.
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong. Our team has been notified.</h1>;
        }
        return this.props.children; 
    }
}
*/

// ==========================================
// THE EXECUTION: Forcing a Global Panic
// ==========================================

const executeRogueFunction = () => {
  console.log("System running normally...");

  // We throw an error with NO try/catch around it.
  // This will instantly trigger the `process.on('uncaughtException')` listener at the top of the file.
  throw new Error("A rogue module just corrupted the memory!");
};

// to detonate the system and test the Global Catchers:
executeRogueFunction();
