/* =========================================================
   HAMIM CODE COMPILER
   GitHub Pages + Vercel Flask Backend
========================================================= */


/* =========================================================
   BACKEND
========================================================= */

const VERCEL_BACKEND_URL =
  "https://compiler-beige.vercel.app";


const IS_GITHUB_PAGES =
  window.location.hostname.endsWith(
    "github.io"
  );


const API_BASE_URL =
  IS_GITHUB_PAGES
    ? VERCEL_BACKEND_URL
    : "";


function apiUrl(path) {

  return API_BASE_URL + path;

}


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


const visualizerSubtitle =
  document.getElementById(
    "visualizerSubtitle"
  );


/* =========================================================
   7 COMPILER STAGES
========================================================= */

const stages = [

  {
    el:
      document.getElementById(
        "stageLexical"
      ),

    output:
      document.getElementById(
        "lexicalOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageSyntax"
      ),

    output:
      document.getElementById(
        "syntaxOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageSemantic"
      ),

    output:
      document.getElementById(
        "semanticOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageIntermediate"
      ),

    output:
      document.getElementById(
        "intermediateOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageOptimization"
      ),

    output:
      document.getElementById(
        "optimizationOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageTarget"
      ),

    output:
      document.getElementById(
        "targetOutput"
      )
  },


  {
    el:
      document.getElementById(
        "stageBinary"
      ),

    output:
      document.getElementById(
        "binaryOutput"
      )
  }

];


/* =========================================================
   PYODIDE
========================================================= */

let pyodide = null;

let pyodidePromise = null;


async function getPyodide() {

  if (pyodide) {

    return pyodide;

  }


  if (!pyodidePromise) {

    pyodidePromise =
      loadPyodide();

  }


  pyodide =
    await pyodidePromise;


  return pyodide;

}


/* =========================================================
   LINE NUMBERS
========================================================= */

function updateLineNumbers() {

  const totalLines =
    codeEditor
      .value
      .split("\n")
      .length;


  const numbers = [];


  for (
    let i = 1;
    i <= totalLines;
    i++
  ) {

    numbers.push(i);

  }


  lineNumbers.textContent =
    numbers.join("\n");

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
   OUTPUT / VISUALIZER TABS
========================================================= */

function showOutput() {

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


function showVisualizer() {

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

  showOutput

);


visualizerTab.addEventListener(

  "click",

  showVisualizer

);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

  const saved =
    localStorage.getItem(
      "hamimCompilerTheme"
    );


  if (
    saved === "light"
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
   BACKEND STATUS
========================================================= */

async function checkBackend() {

  backendStatus.textContent =
    "Backend checking...";


  backendStatus.classList.remove(
    "ok",
    "bad"
  );


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


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const contentType =
      response.headers.get(
        "content-type"
      )
      ||
      "";


    if (
      !contentType.includes(
        "application/json"
      )
    ) {

      throw new Error(
        "Backend returned invalid response"
      );

    }


    const data =
      await response.json();


    if (
      data.status !==
      "success"
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

    console.error(
      "Backend status error:",
      error
    );


    backendStatus.textContent =
      "Backend Offline";


    backendStatus.classList.add(
      "bad"
    );

  }

}


/* =========================================================
   RESET STAGES
========================================================= */

function resetStages() {

  stages.forEach(

    stage => {

      stage.el.classList.remove(
        "running",
        "done",
        "error"
      );


      const status =
        stage.el.querySelector(
          ".stage-top b"
        );


      if (status) {

        status.textContent =
          "Waiting";

      }


      stage.output.textContent =
        "—";

    }

  );


  visualizerSubtitle.textContent =
    "Python compiler analysis pipeline";

}


/* =========================================================
   STAGE RUNNING
========================================================= */

function stageRunning(
  index,
  text = "Processing..."
) {

  const stage =
    stages[index];


  stage.el.classList.remove(
    "done",
    "error"
  );


  stage.el.classList.add(
    "running"
  );


  const status =
    stage.el.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Processing";

  }


  stage.output.textContent =
    text;

}


/* =========================================================
   STAGE DONE
========================================================= */

function stageDone(
  index,
  text
) {

  const stage =
    stages[index];


  stage.el.classList.remove(
    "running",
    "error"
  );


  stage.el.classList.add(
    "done"
  );


  const status =
    stage.el.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Completed";

  }


  stage.output.textContent =
    text ?? "";

}


/* =========================================================
   STAGE ERROR
========================================================= */

function stageError(
  index,
  text
) {

  const stage =
    stages[index];


  stage.el.classList.remove(
    "running",
    "done"
  );


  stage.el.classList.add(
    "error"
  );


  const status =
    stage.el.querySelector(
      ".stage-top b"
    );


  if (status) {

    status.textContent =
      "Error";

  }


  stage.output.textContent =
    text;

}


/* =========================================================
   FORMAT LEXICAL TOKENS
========================================================= */

function formatTokens(tokens) {

  if (
    !Array.isArray(tokens)
    ||
    tokens.length === 0
  ) {

    return "No tokens generated.";

  }


  const lines = [

    "TYPE            VALUE             POSITION",

    "------------------------------------------------------"

  ];


  for (
    const item
    of tokens
  ) {

    const type =
      String(
        item.type ?? ""
      )
      .padEnd(16);


    let value =
      String(
        item.value ?? ""
      );


    if (!value) {

      value =
        "[empty]";

    }


    value =
      value.padEnd(18);


    lines.push(

      `${type}${value}Line ${item.line}, Col ${item.column}`

    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   FORMAT SEMANTIC ANALYSIS
========================================================= */

function formatSemantic(data) {

  if (!data) {

    return "No semantic information.";

  }


  const lines = [];


  lines.push(

    `Valid: ${data.valid ? "Yes" : "No"}`

  );


  lines.push("");


  lines.push(
    "Defined Variables:"
  );


  lines.push(

    data.defined_variables
      ?.join(", ")
    ||
    "None"

  );


  lines.push("");


  lines.push(
    "Used Variables:"
  );


  lines.push(

    data.used_variables
      ?.join(", ")
    ||
    "None"

  );


  lines.push("");


  lines.push(
    "Undefined Variables:"
  );


  lines.push(

    data.undefined_variables
      ?.join(", ")
    ||
    "None"

  );


  if (
    Array.isArray(
      data.messages
    )
    &&
    data.messages.length
  ) {

    lines.push("");

    lines.push(
      "Messages:"
    );


    data.messages.forEach(

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
   FORMAT INTERMEDIATE CODE
========================================================= */

function formatIntermediate(data) {

  return [

    "INTERMEDIATE CODE",

    "=================",

    "",

    "Three Address Code / Educational IR",

    "",

    data.intermediate_code_text

    ||

    (
      Array.isArray(
        data.intermediate_code
      )

        ? data.intermediate_code.join(
            "\n"
          )

        : "No intermediate code generated."
    )

  ].join(
    "\n"
  );

}


/* =========================================================
   FORMAT OPTIMIZER
========================================================= */

function formatOptimization(
  optimization,
  optimizedCode
) {

  const lines = [

    "CODE OPTIMIZATION",

    "=================",

    ""

  ];


  if (
    optimization
    &&
    Array.isArray(
      optimization.applied_steps
    )
  ) {

    lines.push(
      "Applied Steps:"
    );


    optimization
      .applied_steps
      .forEach(

        step => {

          lines.push(
            "✓ " + step
          );

        }

      );

  }


  lines.push("");


  lines.push(
    "OPTIMIZED SOURCE"
  );


  lines.push(
    "================"
  );


  lines.push("");


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
   FORMAT CODE GENERATOR
========================================================= */

function formatTargetCode(
  target
) {

  if (!target) {

    return "No generated code.";

  }


  if (
    target.status ===
    "error"
  ) {

    return (

      "Code Generation Error\n\n"

      +

      (
        target.message
        ||
        "Unknown error"
      )

    );

  }


  if (
    target.disassembly
  ) {

    return [

      "CODE GENERATOR",

      "==============",

      "",

      `Type: ${target.type || "CPython Bytecode"}`,

      "",

      "GENERATED CPYTHON BYTECODE",

      "==========================",

      "",

      target.disassembly

    ].join(
      "\n"
    );

  }


  return JSON.stringify(
    target,
    null,
    2
  );

}


/* =========================================================
   FORMAT BINARY
========================================================= */

function formatBinaryCode(
  binary
) {

  if (!binary) {

    return "No binary representation.";

  }


  if (
    binary.status ===
    "error"
  ) {

    return (

      "Binary Error\n\n"

      +

      (
        binary.message
        ||
        "Unknown error"
      )

    );

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

    lines.push("");

    lines.push(
      "NOTE"
    );

    lines.push(
      "===="
    );

    lines.push("");

    lines.push(
      binary.note
    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   PYTHON RUNNER
========================================================= */

async function executePython(
  code
) {

  const runtime =
    await getPyodide();


  runtime.globals.set(
    "__hamim_code",
    code
  );


  runtime.globals.set(
    "__hamim_input",
    ""
  );


  const result =
    await runtime.runPythonAsync(`

import sys
import io
import traceback
import contextlib

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

_stdin_buffer = io.StringIO(
    __hamim_input
)

_old_stdin = sys.stdin

try:

    sys.stdin = _stdin_buffer

    with contextlib.redirect_stdout(
        _stdout_buffer
    ), contextlib.redirect_stderr(
        _stderr_buffer
    ):

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


_output = _stdout_buffer.getvalue()

_error = _stderr_buffer.getvalue()


if _error:

    if _output:

        _output += "\\n"

    _output += _error


_output

  `);


  const output =
    String(
      result ?? ""
    );


  return output.trim()

    ? output

    : "Program finished with no output.";

}


/* =========================================================
   RUN BUTTON
========================================================= */

async function runPython() {

  showOutput();


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

    const output =
      await executePython(
        code
      );


    outputConsole.textContent =
      output;

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
   VISUALIZER
========================================================= */

async function visualizeCompiler() {

  showVisualizer();


  resetStages();


  const code =
    codeEditor.value;


  if (
    !code.trim()
  ) {

    stageError(

      0,

      "Please write Python code first."

    );


    return;

  }


  visualizeBtn.disabled =
    true;


  visualizeBtn.textContent =
    "Visualizing...";


  try {


    /* ===============================================
       01 LEXICAL ANALYZER
    =============================================== */

    stageRunning(

      0,

      "Sending source code to compiler backend..."

    );


    const response =
      await fetch(

        apiUrl(
          "/api/compile"
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


    const contentType =
      response.headers.get(
        "content-type"
      )
      ||
      "";


    if (
      !contentType.includes(
        "application/json"
      )
    ) {

      const text =
        await response.text();


      throw new Error(

        `API did not return JSON. HTTP ${response.status}. `

        +

        text.slice(
          0,
          120
        )

      );

    }


    const data =
      await response.json();


    stageDone(

      0,

      formatTokens(
        data.lexical_analysis
      )

    );


    /* ===============================================
       02 SYNTAX ANALYZER
    =============================================== */

    if (
      data.syntax_analysis
      &&
      data.syntax_analysis.valid
      === false
    ) {

      stageError(

        1,

        [

          "SYNTAX ERROR",

          "============",

          "",

          data.syntax_analysis.message

          ||

          "Invalid syntax",

          "",

          `Line: ${data.syntax_analysis.line ?? "Unknown"}`,

          `Column: ${data.syntax_analysis.column ?? "Unknown"}`

        ].join(
          "\n"
        )

      );


      visualizerSubtitle.textContent =
        "Compiler pipeline stopped at Syntax Analyzer";


      return;

    }


    if (
      !response.ok
    ) {

      throw new Error(

        data.message

        ||

        `Backend error ${response.status}`

      );

    }


    stageDone(

      1,

      [

        "Syntax Valid: Yes",

        "",

        data.syntax_analysis
          ?.message

        ||

        "Syntax analysis completed."

      ].join(
        "\n"
      )

    );


    /* ===============================================
       03 SEMANTIC ANALYZER
    =============================================== */

    stageDone(

      2,

      formatSemantic(
        data.semantic_analysis
      )

    );


    /* ===============================================
       04 INTERMEDIATE CODE GENERATOR
    =============================================== */

    stageDone(

      3,

      formatIntermediate(
        data
      )

    );


    /* ===============================================
       05 CODE OPTIMIZER
    =============================================== */

    stageDone(

      4,

      formatOptimization(

        data.code_optimization,

        data.optimized_code

      )

    );


    /* ===============================================
       06 CODE GENERATOR
    =============================================== */

    stageDone(

      5,

      formatTargetCode(
        data.target_code
      )

    );


    /* ===============================================
       07 BINARY REPRESENTATION
    =============================================== */

    stageDone(

      6,

      formatBinaryCode(
        data.binary_code
      )

    );


    visualizerSubtitle.textContent =
      "Compiler pipeline completed successfully";


    backendStatus.textContent =
      "Backend Online";


    backendStatus.classList.remove(
      "bad"
    );


    backendStatus.classList.add(
      "ok"
    );

  }

  catch (error) {

    console.error(
      error
    );


    const runningIndex =
      stages.findIndex(

        stage =>

          stage.el.classList.contains(
            "running"
          )

      );


    if (
      runningIndex !== -1
    ) {

      stageError(

        runningIndex,

        "Backend connection failed.\n\n"

        +

        error.message

      );

    }

    else {

      stageError(

        0,

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


    visualizerSubtitle.textContent =
      "Compiler pipeline stopped";

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
   CLEAR
========================================================= */

clearBtn.addEventListener(

  "click",

  () => {

    codeEditor.value =
      "";


    outputConsole.textContent =
      "Ready. Click Run.";


    updateLineNumbers();


    resetStages();


    codeEditor.focus();

  }

);


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

function init() {

  loadTheme();


  updateLineNumbers();


  resetStages();


  checkBackend();

}


init();