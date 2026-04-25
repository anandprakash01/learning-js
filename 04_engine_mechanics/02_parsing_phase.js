// When you save a JavaScript file, the V8 Engine receives a massive, meaningless string of text. The Parser is the first subsystem to touch this text. It operates in two violent steps:

// 1.Lexical Analysis (Tokenization): The scanner rips your raw text apart into tiny, categorized chunks called "Tokens". It throws away all your spaces, tabs, and comments.

// 2.Syntax Analysis (AST Generation): The parser takes those tokens and builds a massive, deeply nested JavaScript Object called the Abstract Syntax Tree (AST). If you forgot a parenthesis or a comma, the tree cannot be built, and the engine immediately throws a SyntaxError.

// The Enterprise Use Case:
// Why must an Architect understand the AST? Because every major tool in modern frontend development is just an AST manipulator. * Babel: Takes modern ES6 code, builds an AST, mutates the tree, and prints out old ES5 code for legacy browsers.

// ESLint: Builds an AST of your code and searches the tree for bad patterns.
// Webpack: Builds an AST to find all your import statements and bundles your files together.

// The Code: Exposing the Engine's Mind
// Because the AST is an internal C++ engine process, we cannot "run" an AST in the browser console. However, we can use standard JavaScript objects to simulate exactly what the V8 Engine's parser generates in memory.

console.log("===== The Raw Input");
// ------------------------------------------
// To us, this is a clear command.
// To the V8 Engine, this is just a string of 17 characters.
("const port = 8080;");

console.log("===== Lexical Analysis (Tokens)");
// ------------------------------------------
// The Scanner rips the string into categorized Tokens.
// Notice how the spaces were completely destroyed and ignored.
const engineTokens = [
  {type: "Keyword", value: "const"},
  {type: "Identifier", value: "port"},
  {type: "Operator", value: "="},
  {type: "Numeric", value: "8080"},
  {type: "Punctuator", value: ";"},
];

console.log("===== Syntax Analysis (The Abstract Syntax Tree)");
// ------------------------------------------
// The Parser takes the Tokens and builds a hierarchical tree.
// This exact JSON structure is what Babel and ESLint read.
const abstractSyntaxTree = {
  type: "Program",
  body: [
    {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: "port",
          },
          init: {
            type: "Literal",
            value: 8080,
            raw: "8080",
          },
        },
      ],
    },
  ],
  sourceType: "module",
};

console.log("===== The SyntaxError Trap");
// ------------------------------------------
// If we gave the engine: `const port = ;`
// The Scanner would tokenize it successfully.
// But the Parser would attempt to build the AST, see an Operator (=) immediately
// followed by a Punctuator (;), realize the `init` branch of the tree is missing, and violently crash the thread with a SyntaxError before memory is ever allocated.
