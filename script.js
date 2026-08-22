/* =========================================================
   HAMIM CODE COMPILER
   GitHub Pages + Flask Backend
========================================================= */


/* =========================================================
   BACKEND CONFIGURATION
========================================================= */

/*
   IMPORTANT

   Render backend deploy করার পর শুধু এই URL change করবে।

   Example:

   const RENDER_BACKEND_URL =
     "https://hamim-compiler.onrender.com";
*/

const RENDER_BACKEND_URL =
  "https://YOUR-RENDER-URL.onrender.com";


/*
   GitHub Pages হলে Render backend use করবে।

   Flask/local/Codespaces-এ same origin use করবে।
*/

const IS_GITHUB_PAGES =
  window.location.hostname.endsWith(
    "github.io"
  );


const API_BASE_URL =
  IS_GITHUB_PAGES
    ? RENDER_BACKEND_URL
    : "";


/* =========================================================
   ELEMENTS
========================================================= */

const codeEditor =
  document.getElementById(
    "codeEditor"
  );

const lineNumbers =
  document.getElementById(
    "lineNumbers"
  );

const programInput =
  document.getElementById(
    "programInput"
  );

const outputConsole =
  document.getElementById(
    "outputConsole"
  );

const runBtn =
  document.getElementById(
    "runBtn"
  );

const visualizeBtn =
  document.getElementById(
    "visualizeBtn"
  );

const clearBtn =
  document.getElementById(
    "clearBtn"
  );

const themeBtn =
  document.getElementById(
    "themeBtn"
  );

const backendStatus =
  document.getElementById(
    "backendStatus"
  );


/* =========================================================
   TABS
========================================================= */

const outputTab =
  document.getElementById(
    "outputTab"
  );

const visualizerTab =
  document.getElementById(
    "visualizerTab"
  );

const outputView =
  document.getElementById(
    "outputView"
  );

const visualizerView =
  document.getElementById(
    "visualizerView"
  );


/* =========================================================
   STAGES
========================================================= */

const stageSource =
  document.getElementById(
    "stageSource"
  );

const stageLexical =
  document.getElementById(
    "stageLexical"
  );

const stageSyntax =
  document.getElementById(
    "stageSyntax"
  );

const stageAst =
  document.getElementById(
    "stageAst"
  );

const stageSemantic =
  document.getElementById(
    "stageSemantic"
  );

const stageSymbol =
  document.getElementById(
    "stageSymbol"
  );

const stageIntermediate =
  document.getElementById(
    "stageIntermediate"
  );

const stageOptimization =
  document.getElementById(
    "stageOptimization"
  );

const stageTarget =
  document.getElementById(
    "stageTarget"
  );

const stageBinary =
  document.getElementById(
    "stageBinary"
  );

const stageExecution =
  document.getElementById(
    "stageExecution"
  );


/* =========================================================
   OUTPUTS
========================================================= */

const sourceOutput =
  document.getElementById(
    "sourceOutput"
  );

const lexicalOutput =
  document.getElementById(
    "lexicalOutput"
  );

const syntaxOutput =
  document.getElementById(
    "syntaxOutput"
  );

const astOutput =
  document.getElementById(
    "astOutput"
  );

const semanticOutput =
  document.getElementById(
    "semanticOutput"
  );

const symbolOutput =
  document.getElementById(
    "symbolOutput"
  );

const intermediateOutput =
  document.getElementById(
    "intermediateOutput"
  );

const optimizationOutput =
  document.getElementById(
    "optimizationOutput"
  );

const targetOutput =
  document.getElementById(
    "targetOutput"
  );

const binaryOutput =
  document.getElementById(
    "binaryOutput"
  );

const executionOutput =
  document.getElementById(
    "executionOutput"
  );

const visualizerSubtitle =
  document.getElementById(
    "visualizerSubtitle"
  );


const stages = [

  stageSource,

  stageLexical,

  stageSyntax,

  stageAst,

  stageSemantic,

  stageSymbol,

  stageIntermediate,

  stageOptimization,

  stageTarget,

  stageBinary,

  stageExecution

];


const stageOutputs = [

  sourceOutput,

  lexicalOutput,

  syntaxOutput,

  astOutput,

  semanticOutput,

  symbolOutput,

  intermediateOutput,

  optimizationOutput,

  targetOutput,

  binaryOutput,

  executionOutput

];


/* =========================================================
   PYODIDE
========================================================= */

let pyodide = null;

let pyodideLoadingPromise = null;


/* =========================================================
   LINE NUMBERS
========================================================= */

function updateLineNumbers() {

  const count =
    codeEditor.value
      .split("\n")
      .length;


  const numbers = [];


  for (
    let i = 1;
    i <= count;
    i++
  ) {

    numbers.push(
      i
    );

  }


  lineNumbers.textContent =
    numbers.join(
      "\n"
    );

}


codeEditor.addEventListener(
  "input",
  updateLineNumbers
);


codeEditor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      codeEditor.scrollTop;

  }
);


/* =========================================================
   TAB KEY
========================================================= */

codeEditor.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Tab"
    ) {

      return;

    }


    event.preventDefault();


    const start =
      codeEditor.selectionStart;


    const end =
      codeEditor.selectionEnd;


    codeEditor.value =

      codeEditor.value.substring(
        0,
        start
      )

      +

      "    "

      +

      codeEditor.value.substring(
        end
      );


    codeEditor.selectionStart =
      start + 4;


    codeEditor.selectionEnd =
      start + 4;


    updateLineNumbers();

  }
);


/* =========================================================
   TABS
========================================================= */

function showOutputTab() {

  outputTab.classList.add(
    "active"
  );


  visualizerTab.classList.remove(
    "active"
  );


  outputView.classList.add(
    "active"
  );


  visualizerView.classList.remove(
    "active"
  );

}


function showVisualizerTab() {

  visualizerTab.classList.add(
    "active"
  );


  outputTab.classList.remove(
    "active"
  );


  visualizerView.classList.add(
    "active"
  );


  outputView.classList.remove(
    "active"
  );

}


outputTab.addEventListener(
  "click",
  showOutputTab
);


visualizerTab.addEventListener(
  "click",
  showVisualizerTab
);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

  const savedTheme =
    localStorage.getItem(
      "hamimCompilerTheme"
    );


  if (
    savedTheme === "light"
  ) {

    document.body.classList.add(
      "light"
    );

  }

}


themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light"
    );


    const theme =
      document.body.classList.contains(
        "light"
      )
        ? "light"
        : "dark";


    localStorage.setItem(
      "hamimCompilerTheme",
      theme
    );

  }
);


/* =========================================================
   API URL
========================================================= */

function apiUrl(
  endpoint
) {

  return (
    API_BASE_URL
    +
    endpoint
  );

}


/* =========================================================
   BACKEND STATUS
========================================================= */

async function checkBackend() {

  backendStatus.classList.remove(
    "ok",
    "bad"
  );


  if (
    IS_GITHUB_PAGES
    &&
    RENDER_BACKEND_URL.includes(
      "YOUR-RENDER-URL"
    )
  ) {

    backendStatus.textContent =
      "Backend URL Required";


    backendStatus.classList.add(
      "bad"
    );


    return;

  }


  backendStatus.textContent =
    "Backend checking...";


  try {

    const response =
      await fetch(

        apiUrl(
          "/api/status"
        ),

        {
          cache:
            "no-store"
        }

      );


    if (!response.ok) {

      throw new Error(
        "Backend unavailable"
      );

    }


    const data =
      await response.json();


    if (
      data.status !== "success"
    ) {

      throw new Error(
        "Backend unavailable"
      );

    }


    backendStatus.textContent =
      "Backend Online";


    backendStatus.classList.add(
      "ok"
    );

  }

  catch (error) {

    backendStatus.textContent =
      "Backend Offline";


    backendStatus.classList.add(
      "bad"
    );

  }

}


/* =========================================================
   CLEAR
========================================================= */

clearBtn.addEventListener(
  "click",
  () => {

    codeEditor.value =
      "";


    programInput.value =
      "";


    outputConsole.textContent =
      "Ready. Click Run.";


    updateLineNumbers();


    resetVisualizer();


    codeEditor.focus();

  }
);


/* =========================================================
   PYODIDE
========================================================= */

async function initializePyodide() {

  if (pyodide) {

    return pyodide;

  }


  if (
    pyodideLoadingPromise
  ) {

    return pyodideLoadingPromise;

  }


  pyodideLoadingPromise =
    loadPyodide();


  try {

    pyodide =
      await pyodideLoadingPromise;


    return pyodide;

  }

  finally {

    pyodideLoadingPromise =
      null;

  }

}


/* =========================================================
   RUN PYTHON
========================================================= */

async function runPython() {

  showOutputTab();


  const code =
    codeEditor.value;


  if (
    !code.trim()
  ) {

    outputConsole.textContent =
      "Please write Python code first.";


    return;

  }


  runBtn.disabled =
    true;


  runBtn.textContent =
    "Running...";


  outputConsole.textContent =
    "Loading Python runtime...";


  try {

    const runtime =
      await initializePyodide();


    runtime.globals.set(
      "__hamim_code",
      code
    );


    runtime.globals.set(
      "__hamim_input",
      programInput.value
    );


    const result =
      await runtime.runPythonAsync(`
import sys
import io
import traceback
import contextlib

_stdout = io.StringIO()
_stderr = io.StringIO()

_stdin = io.StringIO(
    __hamim_input
)

_old_stdin = sys.stdin

try:

    sys.stdin = _stdin

    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stderr):

        try:

            exec(
                compile(
                    __hamim_code,
                    "<main.py>",
                    "exec"
                ),
                {
                    "__name__":
                        "__main__"
                }
            )

        except Exception:

            traceback.print_exc()

finally:

    sys.stdin = _old_stdin


_output = _stdout.getvalue()

_error = _stderr.getvalue()


if _error:

    if _output:

        _output += "\\n"

    _output += _error


_output
      `);


    const text =
      String(
        result ?? ""
      );


    outputConsole.textContent =
      text.trim()
        ? text
        : "Program finished with no output.";

  }

  catch (error) {

    outputConsole.textContent =
      "Runtime Error:\n\n"
      +
      error.message;

  }

  finally {

    runBtn.disabled =
      false;


    runBtn.textContent =
      "Run";

  }

}


runBtn.addEventListener(
  "click",
  runPython
);


/* =========================================================
   VISUALIZER RESET
========================================================= */

function resetVisualizer() {

  stages.forEach(
    stage => {

      stage.classList.remove(
        "running",
        "done",
        "error"
      );


      const status =
        stage.querySelector(
          ".stage-top b"
        );


      if (status) {

        status.textContent =
          "Waiting";

      }

    }
  );


  stageOutputs.forEach(
    output => {

      output.textContent =
        "—";

    }
  );


  visualizerSubtitle.textContent =
    "Backend-powered Python compiler visualization";

}


/* =========================================================
   STAGE HELPERS
========================================================= */

function setStageRunning(
  stage,
  output,
  message = "Processing..."
) {

  stage.classList.remove(
    "done",
    "error"
  );


  stage.classList.add(
    "running"
  );


  const status =
    stage.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Processing";

  }


  output.textContent =
    message;

}


function setStageDone(
  stage,
  output,
  content
) {

  stage.classList.remove(
    "running",
    "error"
  );


  stage.classList.add(
    "done"
  );


  const status =
    stage.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Completed";

  }


  output.textContent =
    content ?? "";

}


function setStageError(
  stage,
  output,
  content
) {

  stage.classList.remove(
    "running",
    "done"
  );


  stage.classList.add(
    "error"
  );


  const status =
    stage.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Error";

  }


  output.textContent =
    content;

}


/* =========================================================
   VISUALIZE
========================================================= */

async function visualizeCompiler() {

  showVisualizerTab();


  resetVisualizer();


  const code =
    codeEditor.value;


  if (
    !code.trim()
  ) {

    setStageError(
      stageSource,
      sourceOutput,
      "Please write Python code first."
    );


    return;

  }


  if (
    IS_GITHUB_PAGES
    &&
    RENDER_BACKEND_URL.includes(
      "YOUR-RENDER-URL"
    )
  ) {

    setStageError(

      stageLexical,

      lexicalOutput,

      "Render backend URL has not been added yet."

    );


    return;

  }


  visualizeBtn.disabled =
    true;


  visualizeBtn.textContent =
    "Visualizing...";


  try {

    setStageRunning(
      stageSource,
      sourceOutput
    );


    setStageDone(
      stageSource,
      sourceOutput,
      code
    );


    setStageRunning(
      stageLexical,
      lexicalOutput,
      "Sending source code to backend..."
    );


    const response =
      await fetch(

        apiUrl(
          "/compile"
        ),

        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              language:
                "python",

              code:
                code

            })

        }

      );


    const data =
      await response.json();


    setStageDone(
      stageLexical,
      lexicalOutput,
      formatTokens(
        data.lexical_analysis
      )
    );


    if (
      data.syntax_analysis
      &&
      data.syntax_analysis.valid === false
    ) {

      setStageError(

        stageSyntax,

        syntaxOutput,

        [
          "Syntax Error",
          "",
          data.syntax_analysis.message
            || "",
          "",
          `Line: ${data.syntax_analysis.line ?? "Unknown"}`,
          `Column: ${data.syntax_analysis.column ?? "Unknown"}`
        ].join(
          "\n"
        )

      );


      return;

    }


    if (!response.ok) {

      throw new Error(
        data.message
        ||
        "Backend error"
      );

    }


    setStageDone(

      stageSyntax,

      syntaxOutput,

      [
        "Syntax Valid: Yes",
        "",
        data.syntax_analysis?.message
        ||
        "Syntax analysis completed."
      ].join(
        "\n"
      )

    );


    setStageDone(
      stageAst,
      astOutput,
      data.ast_tree
      ||
      "No AST generated."
    );


    setStageDone(

      stageSemantic,

      semanticOutput,

      formatSemantic(
        data.semantic_analysis
      )

    );


    setStageDone(

      stageSymbol,

      symbolOutput,

      formatSymbolTable(
        data.symbol_table
      )

    );


    setStageDone(

      stageIntermediate,

      intermediateOutput,

      data.intermediate_code_text
      ||
      (
        data.intermediate_code
          || []
      ).join(
        "\n"
      )

    );


    setStageDone(

      stageOptimization,

      optimizationOutput,

      formatOptimization(
        data.code_optimization,
        data.optimized_code
      )

    );


    setStageDone(

      stageTarget,

      targetOutput,

      formatTargetCode(
        data.target_code
      )

    );


    setStageDone(

      stageBinary,

      binaryOutput,

      formatBinaryCode(
        data.binary_code
      )

    );


    const executionText =
      await runForVisualizer(
        code
      );


    setStageDone(

      stageExecution,

      executionOutput,

      executionText

    );


    visualizerSubtitle.textContent =
      "Compiler pipeline completed successfully";

  }

  catch (error) {

    console.error(
      error
    );


    const current =
      stages.find(
        stage =>
          stage.classList.contains(
            "running"
          )
      );


    if (current) {

      const index =
        stages.indexOf(
          current
        );


      setStageError(

        current,

        stageOutputs[index],

        "Backend connection failed.\n\n"
        +
        error.message

      );

    }


    backendStatus.textContent =
      "Backend Offline";


    backendStatus.classList.remove(
      "ok"
    );


    backendStatus.classList.add(
      "bad"
    );

  }

  finally {

    visualizeBtn.disabled =
      false;


    visualizeBtn.textContent =
      "Visualize";

  }

}


visualizeBtn.addEventListener(
  "click",
  visualizeCompiler
);


/* =========================================================
   FORMAT TOKENS
========================================================= */

function formatTokens(
  tokens
) {

  if (
    !Array.isArray(tokens)
    ||
    !tokens.length
  ) {

    return "No tokens generated.";

  }


  const lines = [

    "TYPE            VALUE             POSITION",

    "---------------------------------------------------"

  ];


  tokens.forEach(
    item => {

      const type =
        String(
          item.type ?? ""
        )
        .padEnd(
          16
        );


      let value =
        String(
          item.value ?? ""
        );


      if (!value) {

        value =
          "[empty]";

      }


      value =
        value.padEnd(
          18
        );


      lines.push(

        `${type}${value}Line ${item.line}, Col ${item.column}`

      );

    }
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   FORMAT SEMANTIC
========================================================= */

function formatSemantic(
  semantic
) {

  if (!semantic) {

    return "No semantic information.";

  }


  const lines = [];


  lines.push(

    `Valid: ${semantic.valid ? "Yes" : "No"}`

  );


  lines.push(
    ""
  );


  lines.push(
    "Defined:"
  );


  lines.push(

    semantic.defined_variables?.join(
      ", "
    )
    ||
    "None"

  );


  lines.push(
    ""
  );


  lines.push(
    "Used:"
  );


  lines.push(

    semantic.used_variables?.join(
      ", "
    )
    ||
    "None"

  );


  lines.push(
    ""
  );


  lines.push(
    "Undefined:"
  );


  lines.push(

    semantic.undefined_variables?.join(
      ", "
    )
    ||
    "None"

  );


  if (
    semantic.messages?.length
  ) {

    lines.push(
      ""
    );


    semantic.messages.forEach(
      message => {

        lines.push(
          "• " + message
        );

      }
    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   SYMBOL TABLE
========================================================= */

function formatSymbolTable(
  symbols
) {

  if (
    !Array.isArray(symbols)
    ||
    !symbols.length
  ) {

    return "No symbols found.";

  }


  const lines = [

    "NAME          TYPE                  VALUE",

    "------------------------------------------------"

  ];


  symbols.forEach(
    symbol => {

      const name =
        String(
          symbol.name ?? ""
        )
        .padEnd(
          14
        );


      const type =
        String(
          symbol.type ?? ""
        )
        .padEnd(
          22
        );


      lines.push(

        `${name}${type}${symbol.value ?? ""}`

      );

    }
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   OPTIMIZATION
========================================================= */

function formatOptimization(
  optimization,
  optimizedCode
) {

  const lines = [

    "OPTIMIZATION",
    "============",
    ""

  ];


  if (
    optimization?.applied_steps
  ) {

    optimization.applied_steps.forEach(
      step => {

        lines.push(
          "✓ " + step
        );

      }
    );

  }


  lines.push(
    ""
  );


  lines.push(
    "OPTIMIZED SOURCE"
  );


  lines.push(
    "================"
  );


  lines.push(
    ""
  );


  lines.push(
    optimizedCode
    ||
    "No optimized source."
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   TARGET CODE
========================================================= */

function formatTargetCode(
  target
) {

  if (!target) {

    return "No target code.";

  }


  if (
    target.disassembly
  ) {

    return (

      "Type: "
      +
      (
        target.type
        ||
        "CPython Bytecode"
      )

      +

      "\n\n"

      +

      target.disassembly

    );

  }


  return JSON.stringify(
    target,
    null,
    2
  );

}


/* =========================================================
   BINARY CODE
========================================================= */

function formatBinaryCode(
  binary
) {

  if (!binary) {

    return "No binary representation.";

  }


  const lines = [

    "BINARY REPRESENTATION",

    "=====================",

    "",

    `Type: ${binary.type || ""}`,

    `Total Bytes: ${binary.byte_count ?? ""}`,

    "",

    "BINARY",

    "======",

    "",

    binary.binary
    ||
    "Binary unavailable.",

    "",

    "HEX",

    "===",

    "",

    binary.hex
    ||
    "Hex unavailable."

  ];


  if (
    binary.note
  ) {

    lines.push(
      ""
    );


    lines.push(
      "NOTE"
    );


    lines.push(
      "===="
    );


    lines.push(
      ""
    );


    lines.push(
      binary.note
    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   VISUALIZER EXECUTION
========================================================= */

async function runForVisualizer(
  code
) {

  try {

    const runtime =
      await initializePyodide();


    runtime.globals.set(
      "__visual_code",
      code
    );


    runtime.globals.set(
      "__visual_input",
      programInput.value
    );


    const result =
      await runtime.runPythonAsync(`
import sys
import io
import traceback
import contextlib

_out = io.StringIO()
_err = io.StringIO()
_in = io.StringIO(__visual_input)

_old_stdin = sys.stdin

try:

    sys.stdin = _in

    with contextlib.redirect_stdout(_out), contextlib.redirect_stderr(_err):

        try:

            exec(
                compile(
                    __visual_code,
                    "<main.py>",
                    "exec"
                ),
                {
                    "__name__":
                        "__main__"
                }
            )

        except Exception:

            traceback.print_exc()

finally:

    sys.stdin = _old_stdin


_text = _out.getvalue()

_error = _err.getvalue()


if _error:

    if _text:

        _text += "\\n"

    _text += _error


_text
      `);


    const output =
      String(
        result ?? ""
      );


    return [

      "EXECUTION",
      "=========",

      "",

      "Runtime: Pyodide",

      "",

      "FINAL OUTPUT",

      "============",

      "",

      output.trim()
        ? output
        : "Program finished with no output."

    ].join(
      "\n"
    );

  }

  catch (error) {

    return (

      "Execution Error\n\n"
      +
      error.message

    );

  }

}


/* =========================================================
   CTRL + ENTER
========================================================= */

codeEditor.addEventListener(
  "keydown",
  event => {

    if (
      event.ctrlKey
      &&
      event.key === "Enter"
    ) {

      event.preventDefault();


      runPython();

    }

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeApp() {

  loadTheme();


  updateLineNumbers();


  resetVisualizer();


  checkBackend();

}


initializeApp();