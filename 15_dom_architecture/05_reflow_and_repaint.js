// ==========================================
// PART I: THE BROWSER PIPELINE
// ==========================================
// When JavaScript changes a DOM node, the browser goes through 4 physical steps:
//
// 1. RECALCULATE STYLE: Merges DOM changes with CSS.
// 2. LAYOUT (REFLOW): Calculates the exact X/Y geometry and size of every box.
// 3. PAINT (REPAINT): Fills in the pixels (colors, shadows, text).
// 4. COMPOSITE: The GPU flattens multiple layers together and sends them to the monitor.

// ==========================================
// PART II: REFLOW (The CPU Killer)
// ==========================================
// A "Reflow" happens when you change the physical geometry of an element.
// Because elements push against each other, changing the width of ONE element forces the browser to recalculate the Layout of the ENTIRE page. It is incredibly slow.

const warningBox = document.querySelector(".box");

function triggerReflow() {
  // These trigger a massive Reflow!
  warningBox.style.width = "500px";
  warningBox.style.height = "100px";
  warningBox.style.marginTop = "50px";
  warningBox.style.left = "100px";

  // READING geometry also triggers a forced synchronous Reflow!
  // The browser has to pause JS, calculate the layout, and then return the number.
  const currentWidth = warningBox.offsetWidth;
}
triggerReflow();

// ==========================================
// PART III: REPAINT (The Lighter Operation)
// ==========================================
// A "Repaint" happens when you change the look of an element WITHOUT changing its geometry.
// The browser skips the Layout phase and just redraws the pixels. It is much faster.

function triggerRepaint() {
  // These trigger a Repaint (No Layout changes)
  warningBox.style.backgroundColor = "#ff0000";
  warningBox.style.color = "#ffffff";
  // warningBox.style.visibility = "hidden"; // Hidden takes up space, so no geometry changed!
}
triggerRepaint();

// ==========================================
// PART IV: THE ARCHITECT'S SECRET (GPU Compositing)
// ==========================================
// If Reflow is slow, and Repaint is okay... how do we animate things at 60 FPS?
// We completely bypass BOTH of them by sending the math directly to the Graphics Card (GPU).

// There are exactly TWO CSS properties that skip Layout and Paint entirely, and only trigger the "Composite" phase on the GPU:
// 1. transform (translate, scale, rotate)
// 2. opacity

// ❌ THE JUNIOR ANIMATION (CPU Reflow - Laggy)
function badAnimation() {
  // Animating 'left' forces the CPU to recalculate the page geometry 60 times a second!
  let pos = 0;
  setInterval(() => {
    warningBox.style.left = `${pos++}px`;
  }, 16);
}
// badAnimation();
// By default, every single element in HTML is born with a CSS property of position: static.

// In the "Static" layout mode, the browser places elements exactly where they fall in the document flow, and it strictly ignores any directional coordinates like top, bottom, left, or right

// ✅ THE ENTERPRISE ANIMATION (GPU Compositing - Silky Smooth 60FPS)
function goodAnimation() {
  // Using 'transform' lifts the element onto its own invisible 3D layer.
  // The CPU does zero work. The GPU just slides the layer across the screen!
  let pos = 0;
  let dir = 1; // 1 for right -1 for left

  setInterval(() => {
    pos += dir;
    if (pos >= 50) {
      dir = -1;
    } else if (pos <= 0) {
      dir = 1;
    }
    warningBox.style.transform = `translateX(${pos}px)`;
  }, 16);
}
// goodAnimation();

// If you want 120 FPS, the math says you should run the interval every ~8.33 milliseconds (1000ms / 120). But the V8 Engine and the Browser are not perfectly synchronized. If JavaScript fires the calculation at 8.33ms, but the monitor is busy drawing a frame, they clash. This results in Screen Tearing and stuttering.

// To achieve true 60, 120, or 144 FPS, Enterprise Architects completely abandon setInterval and use a built-in browser C++ function called requestAnimationFrame.

// ==========================================
// PART V: THE HARDWARE ANIMATION LOOP (requestAnimationFrame)
// ==========================================
// const warningBox = document.querySelector(".box");
const toggleBtn = document.getElementById("toggle-anim");

// Animation State Variables
let pos = 0;
let direction = 1; // 1 for right, -1 for left
let isAnimating = false; // Kill switch flag
let animationFrameId; // Memory pointer to the running loop

// The Core Animation Engine
function paintNextFrame() {
  // 1. Calculate the new physics (Oscillate 0 to 50)
  pos += direction * 2; // Move 2 pixels per frame

  if (pos >= 50) {
    direction = -1; // Hit the right wall, bounce left
  } else if (pos <= 0) {
    direction = 1; // Hit the left wall, bounce right
  }

  // 2. Send the layout math directly to the GPU
  warningBox.style.transform = `translateX(${pos}px)`;

  // 3. THE ARCHITECT'S LOOP: requestAnimationFrame
  // We do NOT use a hardcoded timer (like 16ms or 8ms).
  // We hand the function back to the Browser and say:
  // "Execute this function again at the exact microsecond your monitor is ready for the next frame."
  // If you have a 120Hz monitor, this automatically runs at exactly 120 FPS!
  if (isAnimating) {
    animationFrameId = requestAnimationFrame(paintNextFrame);
  }
}

// The Kill Switch Event Listener
toggleBtn.addEventListener("click", () => {
  if (isAnimating) {
    // STOP: We flip the flag and use cancelAnimationFrame to kill the memory pointer
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
    toggleBtn.innerText = "Start Hardware Animation";
  } else {
    // START: We flip the flag and ignite the loop
    isAnimating = true;
    animationFrameId = requestAnimationFrame(paintNextFrame);
    toggleBtn.innerText = "Stop Hardware Animation";
  }
});
// Hardware Sync: requestAnimationFrame talks to the physical monitor. If the user has a standard 60Hz screen, it runs 60 times a second. If they bought a high-end 144Hz gaming monitor, it automatically scales to 144 FPS. You never have to guess the milliseconds.

// Battery Saver: If the user minimizes the browser tab or switches to another window, setInterval will stupidly keep burning CPU power in the background. requestAnimationFrame detects that the tab is hidden and pauses automatically, saving massive amounts of battery and RAM.

// The Kill Switch: Just like clearInterval(id), the browser provides cancelAnimationFrame(id) to safely destroy the loop and prevent memory leaks.

// Never animate width, height, top, left, or margin. (Reflow).

// Always animate transform: translate() and scale(). (GPU Compositing).

// If you need to hide an element, display: none triggers a Reflow (because the geometry collapses). opacity: 0 triggers GPU Compositing (the geometry stays, it just becomes invisible).
