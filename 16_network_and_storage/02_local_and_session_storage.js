// ==========================================
// PART I: LOCALSTORAGE (The Persistent Vault)
// ==========================================
// Capacity: ~5MB.
// Physics: Data written here survives browser restarts, computer reboots, and OS updates.
// It is strictly tied to the Domain (e.g., localhost:3000 cannot read github.com's storage).

function saveUserPreferences() {
  // 1. Writing to the Hard Drive
  // localStorage ONLY accepts Strings. You cannot save raw Objects or Arrays!
  localStorage.setItem("theme", "dark_mode");

  // 2. Reading from the Hard Drive
  const currentTheme = localStorage.getItem("theme");
  console.log("Current Theme:", currentTheme); // "dark_mode"

  // 3. Deleting from the Hard Drive
  // localStorage.removeItem("theme");
  // localStorage.clear(); // Wipes the entire domain's vault!
}

saveUserPreferences();

// ==========================================
// PART II: SESSION STORAGE (The Volatile Vault)
// ==========================================
// Capacity: ~5MB.
// Physics: Exactly the same API as localStorage, but with one massive difference:
// The exact microsecond the user closes the Browser TAB, the OS physically deletes the data.
// It is perfect for multi-step checkout forms or temporary banking tokens.

function saveTemporaryState() {
  sessionStorage.setItem("checkout_step", "billing_address");
  console.log("Checkout Step:", sessionStorage.getItem("checkout_step"));
}
// saveTemporaryState();

// ==========================================
// PART III: THE SERIALIZATION TRAP (Objects)
// ==========================================
// Because the Storage API only accepts Strings, if you try to save an Object, the V8 Engine will forcibly coerce it into a useless string: "[object Object]".

function saveDashboardData() {
  const dashboardState = {widgets: 4, layout: "grid", active: true};

  // ❌ THE TRAP:
  localStorage.setItem("state", dashboardState);
  console.log(localStorage.getItem("state")); // Output: "[object Object]" (Data destroyed!)

  // ✅ THE ARCHITECT'S WAY (Serialization):
  // We must physically flatten the Object into a JSON string before saving.
  localStorage.setItem("state", JSON.stringify(dashboardState));

  // When we read it back, it is still a String! We must parse it back into a Memory Object.
  const rawData = localStorage.getItem("state");
  console.log("Raw String: ", rawData);
  const parsedState = JSON.parse(rawData);

  console.log("Recovered State:", parsedState); // 4
}

// saveDashboardData();

// ==========================================
// PART IV: INDEXED DB (The Enterprise Database)
// ==========================================
// Capacity: 50MB to multiple Gigabytes (Depends on hard drive size).
// Physics: LocalStorage is SYNCHRONOUS. If you try to save 5MB of data, the entire UI will freeze until the hard drive finishes spinning.
// IndexedDB is an ASYNCHRONOUS, NoSQL database built directly into the browser.

// Setting up IndexedDB requires writing ~50 lines of complex Event-Driven C++ bindings.
// In the Enterprise, we NEVER write raw IndexedDB code. We use a wrapper library like `localforage`.

/*
    // Pseudo-code of how Enterprise Apps use IndexedDB:
    import localforage from 'localforage';

    async function cacheMassiveDataset() {
        const heavyData = new Array(1000000).fill("Data");
        
        // This writes gigabytes to the hard drive WITHOUT freezing the UI!
        await localforage.setItem("massive_cache", heavyData); 
    }
*/
