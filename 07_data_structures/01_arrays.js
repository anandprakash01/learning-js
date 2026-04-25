// Arrays are Reference Types. They are too large to fit on the Call Stack.
// The V8 Engine places the array data in the 'Heap' (a massive, unstructured memory pool), and places a hexadecimal pointer (e.g., 0x001) on the Call Stack.

// JavaScript Arrays have two types of built-in methods:

// Mutating Methods: (.push(), .pop(), .splice(), .sort()). These physically reach into the Heap and permanently alter the original data.

// Non-Mutating Methods: (.slice(), .concat(), .filter()). These create a brand new Array in the Heap, copy the data over, modify the copy, and return a new pointer.

console.log("===== Memory Allocation (Stack vs Heap)");
// ------------------------------------------
// 'masterNodeList' is just a pointer on the Call Stack holding a hexadecimal memory address that points to the Array's location in the Heap.
// The actual array ["Node_1", "Node_2"] lives in the Heap.
const nodeList = ["Node_1", "Node_2", "Node_3"];
let list = ["samsung", 69, true, undefined, 33.3];
const myArr = new Array(1, 3, 5, 7);
const newMyArr = new Array(10); // [ <10 empty items> ]
console.log(newMyArr);

console.log("===== Reference Trap (Mutation");
// ------------------------------------------
// Assigning an array to a new variable DOES NOT copy the data.
// It simply creates a second pointer to the exact same Heap address.
const backupList = nodeList;

// If we mutate the backup...
backupList.push("Node_4");
// We have accidentally destroyed/modified the original as well!
console.log("Original nodeList: ", nodeList); // ["Node_1", "Node_2", "Node_3", "Node_4"]

console.log("===== READ / UPDATE Operations");
// ------------------------------------------
// In lower-level languages like C++ or Java, an Array is a strict, continuous block of memory. If you ask for an index that doesn't exist, the program violently crashes with an "Out of Bounds" memory error.
// JavaScript is different. Under the hood, a JavaScript Array is actually just an Object where the keys are numbers ({ "0": "Apple", "1": "Banana" }). Because of this, it has very specific, sometimes dangerous, behaviors when you read, update, or sort it.
// NOTE: Out of Bounds
// JS arrays are technically Objects, asking for list[10] is exactly like asking for an Object property that doesn't exist. The engine does NOT crash. It simply returns `undefined`.
const ServerList = ["Server_A", "Server_B", "Server_C"];
console.log(`Read Index 0: ${ServerList[0]}`); // "Server_A"
console.log(`Read Index 10: ${ServerList[10]}`); // undefined

ServerList[1] = "Server_D"; // Updates the already existing item at index
console.log("Update: ", ServerList); // Output: [ 'Server_A', 'Server_D', 'Server_C' ]

// You can dynamically create new indices. The engine will automatically expand the array. However, doing this creates "empty slots" (sparse arrays), which degrades V8 engine performance.
ServerList[10] = "Server_10";
console.log("Added at index 10 : ", ServerList);
//[ 'Server_A', 'Server_D', 'Server_C', <7 empty items>, 'Server_10' ]
console.log(ServerList[8]); // undefined

console.log("===== ADD / REMOVE (O(1) vs O(N) Operations)");
// ------------------------------------------
const newList = [1, 2, 3, 4, 5];
// O(1) Operations: Fast. Only touches the very end of the memory block.
let newLen = newList.push("Loki"); // Adds to the end. MUTATES. Returns new length.
let removed = newList.pop(); // Removes from the end. MUTATES. Returns removed item (Loki).
console.log(`New Length: ${newLen}, Removed: ${removed}`);

// O(N) Operations: Slow. Forces the engine to recalculate the index of EVERY subsequent item.
newLen = newList.unshift("Iron man"); // Adds to the front. MUTATES. Returns new length (6).
removed = newList.shift(); // Removes from the front. MUTATES. Returns removed item (Iron man).
console.log(`New Length: ${newLen}, Removed: ${removed}`);

console.log("===== SPLICE vs SLICE (The Core Difference)");
// ------------------------------------------
// ===== splice() =====
// -> MUTATES the original array. Returns an array of DELETED items.
// Syntax: .splice(startIndex, deleteCount, itemsToAdd...)
// startIndex (Required):
// If greater than the array length, actual start index will be set to array length.
// If negative, it counts backward from the end.

// deleteCount (Optional):
// If omitted, or if its value is greater than the number of elements remaining, all elements from startIndex to the end are deleted.
// If 0 or negative, no elements are removed (but you should provide items to add).

// item1, item2, ... (Optional): The elements to add to the array, beginning from the startIndex.

const months = ["Jan", "March", "April", "June", "July", "Aug"];

let deletedItems = months.splice(1, 0, "Feb"); // Insert at index 1 (0 deleted)
console.log("Deleted: ", deletedItems);
console.log("Spliced: ", months); // ['Jan', 'Feb', 'March', 'April', 'June','July','Aug']

deletedItems = months.splice(2, 2); // Start at index 2, delete 2 items.
console.log("Spliced: ", months); // [ "Iron Man","Captain America","Loki","Thor",]
console.log("Deleted: ", deletedItems);

months.splice(2); // Delete everything from index 2 onwards
console.log(months); // ['Jan', 'Feb']

// ===== slice() =====
// -> Does not MUTATES. Returns a brand new array in the Heap.
// Syntax: .slice(startIndex, endIndexNotInclusive)
// startIndex (Optional):
// If omitted, it defaults to 0.
// If negative, it counts backward from the end of the array (e.g., -1 is the last element).

// endIndex (Optional):
// slice extracts up to, but not including this index.
// If omitted, it extracts through the end of the sequence.
// If negative, it counts backward from the end.
const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
slicedFruits = fruits.slice(1, 3); // from index 1 up to (but not including) 3
console.log("Sliced Fruits: ", slicedFruits); // ['Banana', 'Cherry']
slicedFruits = fruits.slice(2); // from index 2 to the end
console.log("Sliced Fruits: ", slicedFruits); // ['Cherry', 'Date', 'Elderberry']

slicedFruits = fruits.slice(-2); // the last two elements
console.log("Sliced Fruits: ", slicedFruits); // ['Date', 'Elderberry']

slicedFruits = fruits.slice(); // returns a copy
// The original array remains completely untouched
console.log("Original Fruits: ", fruits);

console.log("===== COMBINING & REVERSING");
// ------------------------------------------
// .concat(array2, array3...) -> IMMUTABLE. Returns a new combined array. It does not change the existing arrays
const listOne = [1, 2, 3];
const listTwo = [4, 5, 10];
const combinedList = listOne.concat(listTwo); // [1,2,3,4,5,10]
console.log("Combined List: ", combinedList);

// .reverse() -> MUTATES the original array in place.
combinedList.reverse();
console.log("Reversed List: ", combinedList);

console.log("===== SEARCHING & INDEXING");
// ------------------------------------------
list = [11, 22, 33, 44, 22, 44, 69];
// .includes(searchElement, fromIndex) -> Returns boolean (true/false).
let check = list.includes(33); // true
check = list.includes(33, 3); // false
console.log("Includes : ", check);

// .indexOf(searchElement, fromIndex) -> Returns FIRST occurrence, or -1 if missing.
let index = list.indexOf(44); // 3
index = list.indexOf(33, 3); // -1
console.log("Index of: ", index);

// .lastIndexOf(searchElement, fromIndex) -> Returns LAST occurrence, or -1 if missing.
index = list.lastIndexOf(44); // 5
console.log("Last occurrence: ", index);

console.log("===== ARRAY TO STRING CONVERSIONS");
// ------------------------------------------
list = [44, 55, 22, 112];
// .toString() -> Always returns a comma-separated string.
let strResult = list.toString(); // "44,55,22,112"
console.log("Converted String: ", strResult);

// .join(separator) -> Returns string based on provided separator.
console.log(list.join()); // "44,55,22,112" (Default is comma)
console.log(list.join("")); // "445522112"    (No spacing)
console.log(list.join("-")); // "44-55-22-112" (Dash delimited)

console.log("===== MODERN ES6+ MANIPULATION & EXTRACTION API");
// ------------------------------------------
// Array.from(iterable) -> Converts array-like objects (Strings, NodeLists, Sets) to Arrays.
const strToArr = Array.from("MERN");
console.log("Array.from: ", strToArr); // ["M", "E", "R", "N"]

// .fill(value, startIndex, endIndexNotInclusive) -> MUTATES. Fills slots with static value.
let emptyBlocks = new Array(3).fill("BLANK");
console.log("Filled Empty Blocks: ", emptyBlocks); // ["BLANK", "BLANK", "BLANK"]

emptyBlocks.fill("X", 1, 2); // Replace elements from index 1 to 2 with "X"
console.log("Filled Empty Blocks: ", emptyBlocks); // ["BLANK", "X", "BLANK"]

// .flat(depth) -> IMMUTABLE. Unpacks nested arrays.
let nestedList = [1, [2, 3], [[4, 5]]];
console.log("Flat (Depth 1): ", nestedList.flat(1)); // [1, 2, 3, [4, 5]]
console.log("Flat (Depth 2): ", nestedList.flat(2)); // [1, 2, 3, 4, 5]
console.log("Flat (Infinity): ", nestedList.flat(Infinity)); // [1, 2, 3, 4, 5]

// .copyWithin(targetIndex, startIndex, endIndexExclusive) -> MUTATES. Shallow copies part of an array to another location in the same array.
const copyArr = ["A", "B", "C", "D", "E"];
copyArr.copyWithin(0, 3); // Copy from index 3 to the end, and paste starting at index 0
console.log("Copy Within: ", copyArr); // ["D", "E", "C", "D", "E"]
copyArr.copyWithin(0, 2, 4); // Copy index 2-3 ("C","D") to index 0.
console.log("copyWithin: ", copyArr); // ["C", "D", "E", "D", "E"]

const modernList = ["A", "B", "C"];
// .at(index) -> Allows negative indexing (counts from the back).
console.log(modernList.at(-1)); // "C"
console.log(modernList.at(1)); // "B"

// Array.isArray(value) -> Static method. The ONLY safe way to check for an array.
console.log(Array.isArray(modernList)); // true
console.log(typeof modernList); // "object" (Legacy engine flaw)

console.log("===== The Engine Traps (Length & Sorting)");
// ------------------------------------------
// TRAP A: Memory Truncation via Length
const memoryBlock = [1, 2, 3, 4, 5];
// .length is writable. Reducing it permanently deletes data from the Heap.
memoryBlock.length = 3;
console.log("Truncated: ", memoryBlock); // [1, 2, 3]

// TRAP B: String Coercion Sorting
const numbers = [10, 2, 30, 4];
// Default .sort() without a comparator coerces everything to Strings first.. 10 comes before 2 alphabetically.
console.log("Buggy Sort: ", numbers.sort()); // [10, 2, 30, 4]

// Enterprise Standard: Always provide a mathematical comparator.
const safeSort = numbers.sort((a, b) => a - b);
console.log("Safe Sort: ", safeSort); // [2, 4, 10, 30]
