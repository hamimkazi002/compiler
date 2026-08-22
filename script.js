/* =========================================================
   HAMIM CODE COMPILER
   script.js
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const codeEditor =
  document.getElementById("codeEditor");

const lineNumbers =
  document.getElementById("lineNumbers");

const programInput =
  document.getElementById("programInput");

const outputConsole =
  document.getElementById("outputConsole");

const runBtn =
  document.getElementById("runBtn");

const visualizeBtn =
  document.getElementById("visualizeBtn");

const clearBtn =
  document.getElementById("clearBtn");

const themeBtn =
  document.getElementById("themeBtn");

const backendStatus =
  document.getElementById("backendStatus");


/* =========================================================
   TABS
========================================================= */

const outputTab =
  document.getElementById("outputTab");

const visualizerTab =
  document.getElementById("visualizerTab");

const outputView =
  document.getElementById("outputView");

const visualizerView =
  document.getElementById("visualizerView");


/* =========================================================
   VISUALIZER
========================================================= */

const visualizerSubtitle =
  document.getElementById("visualizerSubtitle");


const stageSource =
  document.getElementById("stageSource");

const stageLexical =
  document.getElementById("stageLexical");

const stageSyntax =
  document.getElementById("stageSyntax");

const stageAst =
  document.getElementById("stageAst");

const stageSemantic =
  document.getElementById("stageSemantic");

const stageSymbol =
  document.getElementById("stageSymbol");

const stageIntermediate =
  document.getElementById("stageIntermediate");

const stageOptimization =
  document.getElementById("stageOptimization");

const stageTarget =
  document.getElementById("stageTarget");

const stageBinary =
  document.getElementById("stageBinary");

const stageExecution =
  document.getElementById("stageExecution");


/* =========================================================
   VISUALIZER OUTPUT ELEMENTS
========================================================= */

const sourceOutput =
  document.getElementById("sourceOutput");

const lexicalOutput =
  document.getElementById("lexicalOutput");

const syntaxOutput =
  document.getElementById("syntaxOutput");

const astOutput =
  document.getElementById("astOutput");

const semanticOutput =
  document.getElementById("semanticOutput");

const symbolOutput =
  document.getElementById("symbolOutput");

const intermediateOutput =
  document.getElementById("intermediateOutput");

const optimizationOutput =
  document.getElementById("optimizationOutput");

const targetOutput =
  document.getElementById("targetOutput");

const binaryOutput =
  document.getElementById("binaryOutput");

const executionOutput =
  document.getElementById("executionOutput");


/* =========================================================
   STAGE LIST
========================================================= */

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

let pyodideLoading = false;


/* =========================================================
   LINE NUMBERS
========================================================= */

function updateLineNumbers() {

  const numberOfLines =
    codeEditor.value.split("\n").length;


  const numbers = [];


  for (
    let i = 1;
    i <= numberOfLines;
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
   TAB KEY INSIDE EDITOR
========================================================= */

codeEditor.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Tab") {

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
   TAB SWITCHING
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


  if (savedTheme === "light") {

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
        "/api/status",
        {
          cache: "no-store"
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
      data.status === "success"
    ) {

      backendStatus.textContent =
        "Backend Online";


      backendStatus.classList.add(
        "ok"
      );

    } else {

      throw new Error(
        "Backend unavailable"
      );

    }

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

    codeEditor.value = "";

    programInput.value = "";

    outputConsole.textContent =
      "Ready. Click Run.";


    resetVisualizer();


    updateLineNumbers();


    codeEditor.focus();

  }
);


/* =========================================================
   PYODIDE LOAD
========================================================= */

async function initializePyodide() {

  if (pyodide) {

    return pyodide;

  }


  if (pyodideLoading) {

    while (!pyodide) {

      await sleep(100);

    }


    return pyodide;

  }


  pyodideLoading = true;


  outputConsole.textContent =
    "Loading Python runtime...";


  try {

    pyodide =
      await loadPyodide();


    return pyodide;

  }

  catch (error) {

    pyodideLoading = false;

    throw error;

  }

  finally {

    pyodideLoading = false;

  }

}


/* =========================================================
   RUN PYTHON IN BROWSER
========================================================= */

async function runPython() {

  showOutputTab();


  const code =
    codeEditor.value;


  if (!code.trim()) {

    outputConsole.textContent =
      "Please write Python code first.";

    return;

  }


  runBtn.disabled = true;

  runBtn.textContent =
    "Running...";


  outputConsole.textContent =
    "Preparing Python runtime...";


  try {

    const runtime =
      await initializePyodide();


    const userInput =
      programInput.value;


    runtime.globals.set(
      "__hamim_code",
      code
    );


    runtime.globals.set(
      "__hamim_input",
      userInput
    );


    const result =
      await runtime.runPythonAsync(`
import sys
import io
import traceback
import contextlib

__stdout_buffer = io.StringIO()
__stderr_buffer = io.StringIO()
__stdin_buffer = io.StringIO(__hamim_input)

__old_stdin = sys.stdin

try:
    sys.stdin = __stdin_buffer

    with contextlib.redirect_stdout(__stdout_buffer), contextlib.redirect_stderr(__stderr_buffer):
        try:
            exec(
                compile(
                    __hamim_code,
                    "<main.py>",
                    "exec"
                ),
                {"__name__": "__main__"}
            )
        except Exception:
            traceback.print_exc()

finally:
    sys.stdin = __old_stdin

__output = __stdout_buffer.getvalue()
__error = __stderr_buffer.getvalue()

if __error:
    if __output:
        __output += "\\n"
    __output += __error

__output
    `);


    const text =
      String(result ?? "");


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

    runBtn.disabled = false;

    runBtn.textContent =
      "Run";

  }

}


/* =========================================================
   RUN BUTTON
========================================================= */

runBtn.addEventListener(
  "click",
  runPython
);


/* =========================================================
   VISUALIZE BUTTON
========================================================= */

visualizeBtn.addEventListener(
  "click",
  visualizeCompiler
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
   STAGE STATUS HELPERS
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


  if (output) {

    output.textContent =
      message;

  }

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


  if (output) {

    output.textContent =
      content ?? "";

  }

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


  if (output) {

    output.textContent =
      content;

  }

}


/* =========================================================
   COMPILER VISUALIZATION
========================================================= */

async function visualizeCompiler() {

  showVisualizerTab();


  resetVisualizer();


  const code =
    codeEditor.value;


  if (!code.trim()) {

    setStageError(
      stageSource,
      sourceOutput,
      "Please write Python code first."
    );


    return;

  }


  visualizeBtn.disabled =
    true;


  visualizeBtn.textContent =
    "Visualizing...";


  visualizerSubtitle.textContent =
    "Source code is being processed by the compiler backend";


  /* =====================================================
     SOURCE
  ===================================================== */

  setStageRunning(
    stageSource,
    sourceOutput
  );


  await sleep(150);


  setStageDone(
    stageSource,
    sourceOutput,
    code
  );


  /* =====================================================
     BACKEND REQUEST
  ===================================================== */

  try {

    setStageRunning(
      stageLexical,
      lexicalOutput,
      "Sending source code to backend..."
    );


    const response =
      await fetch(
        "/compile",
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
                code,

              input:
                programInput.value

            })

        }
      );


    const data =
      await response.json();


    /* ===================================================
       LEXICAL
    =================================================== */

    setStageDone(
      stageLexical,
      lexicalOutput,
      formatTokens(
        data.lexical_analysis
      )
    );


    /* ===================================================
       SYNTAX ERROR
    =================================================== */

    if (
      data.syntax_analysis
      &&
      data.syntax_analysis.valid === false
    ) {

      const syntaxError =
        [
          "Syntax Error",
          "============",
          "",
          data.syntax_analysis.message
            || "Invalid syntax",
          "",
          `Line: ${data.syntax_analysis.line ?? "Unknown"}`,
          `Column: ${data.syntax_analysis.column ?? "Unknown"}`
        ]
        .join("\n");


      setStageError(
        stageSyntax,
        syntaxOutput,
        syntaxError
      );


      markRemainingStagesSkipped(
        3
      );


      return;

    }


    if (!response.ok) {

      throw new Error(
        data.message
        ||
        "Compiler backend returned an error."
      );

    }


    /* ===================================================
       SYNTAX
    =================================================== */

    setStageRunning(
      stageSyntax,
      syntaxOutput
    );


    await sleep(120);


    setStageDone(
      stageSyntax,
      syntaxOutput,
      formatSyntax(
        data.syntax_analysis
      )
    );


    /* ===================================================
       AST
    =================================================== */

    setStageRunning(
      stageAst,
      astOutput
    );


    await sleep(120);


    setStageDone(
      stageAst,
      astOutput,
      data.ast_tree
      ||
      "No AST generated."
    );


    /* ===================================================
       SEMANTIC
    =================================================== */

    setStageRunning(
      stageSemantic,
      semanticOutput
    );


    await sleep(120);


    setStageDone(
      stageSemantic,
      semanticOutput,
      formatSemantic(
        data.semantic_analysis
      )
    );


    /* ===================================================
       SYMBOL TABLE
    =================================================== */

    setStageRunning(
      stageSymbol,
      symbolOutput
    );


    await sleep(120);


    setStageDone(
      stageSymbol,
      symbolOutput,
      formatSymbolTable(
        data.symbol_table
      )
    );


    /* ===================================================
       INTERMEDIATE CODE
    =================================================== */

    setStageRunning(
      stageIntermediate,
      intermediateOutput
    );


    await sleep(120);


    setStageDone(
      stageIntermediate,
      intermediateOutput,
      formatIntermediateCode(
        data
      )
    );


    /* ===================================================
       OPTIMIZATION
    =================================================== */

    setStageRunning(
      stageOptimization,
      optimizationOutput
    );


    await sleep(120);


    setStageDone(
      stageOptimization,
      optimizationOutput,
      formatOptimization(
        data.code_optimization,
        data.optimized_code
      )
    );


    /* ===================================================
       TARGET CODE
    =================================================== */

    setStageRunning(
      stageTarget,
      targetOutput
    );


    await sleep(120);


    if (
      data.target_code
      &&
      data.target_code.status === "error"
    ) {

      setStageError(
        stageTarget,
        targetOutput,
        data.target_code.message
        ||
        "Target code generation failed."
      );

    } else {

      setStageDone(
        stageTarget,
        targetOutput,
        formatTargetCode(
          data.target_code
        )
      );

    }


    /* ===================================================
       BINARY
    =================================================== */

    setStageRunning(
      stageBinary,
      binaryOutput
    );


    await sleep(120);


    if (
      data.binary_code
      &&
      data.binary_code.status === "error"
    ) {

      setStageError(
        stageBinary,
        binaryOutput,
        data.binary_code.message
        ||
        "Binary generation failed."
      );

    } else {

      setStageDone(
        stageBinary,
        binaryOutput,
        formatBinaryCode(
          data.binary_code
        )
      );

    }


    /* ===================================================
       EXECUTION + FINAL OUTPUT
    =================================================== */

    setStageRunning(
      stageExecution,
      executionOutput
    );


    await sleep(120);


    let executionText;


    if (
      data.execution
      &&
      Object.keys(
        data.execution
      ).length > 0
    ) {

      executionText =
        formatExecution(
          data.execution,
          data.final_output
        );

    } else {

      executionText =
        await runForVisualizer(
          code
        );

    }


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


    const currentStage =
      stages.find(
        stage =>
          stage.classList.contains(
            "running"
          )
      );


    if (currentStage) {

      const outputIndex =
        stages.indexOf(
          currentStage
        );


      setStageError(
        currentStage,
        stageOutputs[
          outputIndex
        ],
        "Backend connection failed.\n\n"
        +
        error.message
        +
        "\n\nRun: python3 backend/app.py"
      );

    } else {

      setStageError(
        stageExecution,
        executionOutput,
        error.message
      );

    }


    visualizerSubtitle.textContent =
      "Compiler pipeline stopped because of an error";

  }

  finally {

    visualizeBtn.disabled =
      false;


    visualizeBtn.textContent =
      "Visualize";

  }

}


/* =========================================================
   SKIP REMAINING STAGES
========================================================= */

function markRemainingStagesSkipped(
  startIndex
) {

  for (
    let i = startIndex;
    i < stages.length;
    i++
  ) {

    const stage =
      stages[i];


    const output =
      stageOutputs[i];


    const status =
      stage.querySelector(
        ".stage-top b"
      );


    if (status) {

      status.textContent =
        "Skipped";

    }


    output.textContent =
      "Skipped because compilation stopped at an earlier stage.";

  }

}


/* =========================================================
   FORMAT TOKENS
========================================================= */

function formatTokens(
  tokens
) {

  if (
    !Array.isArray(tokens)
    ||
    tokens.length === 0
  ) {

    return "No tokens generated.";

  }


  const lines = [

    "TYPE           VALUE              POSITION",
    "-----------------------------------------------------"

  ];


  tokens.forEach(
    item => {

      const type =
        String(
          item.type ?? ""
        )
        .padEnd(
          15,
          " "
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
          19,
          " "
        );


      const position =
        `Line ${item.line}, Col ${item.column}`;


      lines.push(
        `${type}${value}${position}`
      );

    }
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   FORMAT SYNTAX
========================================================= */

function formatSyntax(
  syntax
) {

  if (!syntax) {

    return "No syntax result.";

  }


  return [

    `Valid: ${syntax.valid ? "Yes" : "No"}`,

    "",

    syntax.message
    ||
    "Syntax analysis completed."

  ].join(
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

    return "No semantic analysis generated.";

  }


  const lines = [];


  lines.push(
    `Valid: ${semantic.valid ? "Yes" : "No"}`
  );


  lines.push(
    ""
  );


  lines.push(
    "Defined Variables:"
  );


  lines.push(

    Array.isArray(
      semantic.defined_variables
    )

      ?

      semantic.defined_variables.join(
        ", "
      )
      || "None"

      :

      "None"

  );


  lines.push(
    ""
  );


  lines.push(
    "Used Variables:"
  );


  lines.push(

    Array.isArray(
      semantic.used_variables
    )

      ?

      semantic.used_variables.join(
        ", "
      )
      || "None"

      :

      "None"

  );


  lines.push(
    ""
  );


  lines.push(
    "Undefined Variables:"
  );


  lines.push(

    Array.isArray(
      semantic.undefined_variables
    )

      ?

      semantic.undefined_variables.join(
        ", "
      )
      || "None"

      :

      "None"

  );


  if (
    Array.isArray(
      semantic.messages
    )
    &&
    semantic.messages.length
  ) {

    lines.push(
      ""
    );


    lines.push(
      "Semantic Messages:"
    );


    semantic.messages.forEach(
      message => {

        lines.push(
          `• ${message}`
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
    symbols.length === 0
  ) {

    return "No symbols found.";

  }


  const lines = [

    "NAME           TYPE                 VALUE                 SCOPE",
    "-----------------------------------------------------------------------"

  ];


  symbols.forEach(
    symbol => {

      const name =
        String(
          symbol.name ?? ""
        )
        .padEnd(
          15,
          " "
        );


      const type =
        String(
          symbol.type ?? ""
        )
        .padEnd(
          21,
          " "
        );


      let value =
        String(
          symbol.value ?? ""
        );


      if (
        value.length > 20
      ) {

        value =
          value.substring(
            0,
            17
          )
          +
          "...";

      }


      value =
        value.padEnd(
          22,
          " "
        );


      const scope =
        String(
          symbol.scope ?? ""
        );


      lines.push(
        `${name}${type}${value}${scope}`
      );

    }
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   INTERMEDIATE CODE
========================================================= */

function formatIntermediateCode(
  data
) {

  if (
    data.intermediate_code_text
  ) {

    return [
      "Three Address Code / Educational IR",
      "===================================",
      "",
      data.intermediate_code_text
    ].join(
      "\n"
    );

  }


  if (
    Array.isArray(
      data.intermediate_code
    )
  ) {

    return [
      "Three Address Code / Educational IR",
      "===================================",
      "",
      data.intermediate_code.join(
        "\n"
      )
    ].join(
      "\n"
    );

  }


  return "No intermediate code generated.";

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
    optimization
    &&
    Array.isArray(
      optimization.techniques
    )
  ) {

    lines.push(
      "Techniques:"
    );


    optimization.techniques.forEach(
      technique => {

        lines.push(
          `• ${technique}`
        );

      }
    );


    lines.push(
      ""
    );

  }


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


    optimization.applied_steps.forEach(
      step => {

        lines.push(
          `✓ ${step}`
        );

      }
    );


    lines.push(
      ""
    );

  }


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
    "No optimized source generated."
  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   TARGET CODE
========================================================= */

function formatTargetCode(
  targetCode
) {

  if (
    !targetCode
    ||
    Object.keys(
      targetCode
    ).length === 0
  ) {

    return "No target code generated.";

  }


  const lines = [];


  lines.push(
    "TARGET CODE"
  );


  lines.push(
    "==========="
  );


  lines.push(
    ""
  );


  lines.push(
    `Type: ${targetCode.type || "CPython Bytecode"}`
  );


  lines.push(
    ""
  );


  if (
    targetCode.disassembly
  ) {

    lines.push(
      "DISASSEMBLY"
    );


    lines.push(
      "==========="
    );


    lines.push(
      ""
    );


    lines.push(
      targetCode.disassembly
    );

  }

  else if (
    Array.isArray(
      targetCode.instructions
    )
  ) {

    targetCode.instructions.forEach(
      instruction => {

        const offset =
          String(
            instruction.offset ?? ""
          )
          .padStart(
            4,
            " "
          );


        const opname =
          String(
            instruction.opname ?? ""
          )
          .padEnd(
            24,
            " "
          );


        const argrepr =
          instruction.argrepr ?? "";


        lines.push(
          `${offset}  ${opname}${argrepr}`
        );

      }
    );

  }

  else {

    lines.push(
      JSON.stringify(
        targetCode,
        null,
        2
      )
    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   BINARY CODE
========================================================= */

function formatBinaryCode(
  binaryCode
) {

  if (
    !binaryCode
    ||
    Object.keys(
      binaryCode
    ).length === 0
  ) {

    return "No binary representation generated.";

  }


  const lines = [];


  lines.push(
    "BINARY REPRESENTATION"
  );


  lines.push(
    "====================="
  );


  lines.push(
    ""
  );


  lines.push(
    `Type: ${binaryCode.type || "CPython Bytecode Binary"}`
  );


  if (
    binaryCode.byte_count
    !== undefined
  ) {

    lines.push(
      `Total Bytes: ${binaryCode.byte_count}`
    );

  }


  lines.push(
    ""
  );


  lines.push(
    "BINARY"
  );


  lines.push(
    "======"
  );


  lines.push(
    ""
  );


  lines.push(
    binaryCode.binary
    ||
    "Binary unavailable."
  );


  if (
    binaryCode.hex
  ) {

    lines.push(
      ""
    );


    lines.push(
      "HEX"
    );


    lines.push(
      "==="
    );


    lines.push(
      ""
    );


    lines.push(
      binaryCode.hex
    );

  }


  if (
    Array.isArray(
      binaryCode.execution_path
    )
  ) {

    lines.push(
      ""
    );


    lines.push(
      "EXECUTION PATH"
    );


    lines.push(
      "=============="
    );


    lines.push(
      ""
    );


    binaryCode.execution_path.forEach(
      (item, index) => {

        lines.push(
          item
        );


        if (
          index
          <
          binaryCode.execution_path.length - 1
        ) {

          lines.push(
            "↓"
          );

        }

      }
    );

  }


  if (
    binaryCode.note
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
      binaryCode.note
    );

  }


  return lines.join(
    "\n"
  );

}


/* =========================================================
   EXECUTION RESULT
========================================================= */

function formatExecution(
  execution,
  finalOutput
) {

  const lines = [];


  lines.push(
    "EXECUTION"
  );


  lines.push(
    "========="
  );


  lines.push(
    ""
  );


  if (execution) {

    lines.push(
      `Status: ${execution.status || "unknown"}`
    );


    if (
      execution.return_code
      !== undefined
      &&
      execution.return_code
      !== null
    ) {

      lines.push(
        `Return Code: ${execution.return_code}`
      );

    }

  }


  lines.push(
    ""
  );


  lines.push(
    "FINAL OUTPUT"
  );


  lines.push(
    "============"
  );


  lines.push(
    ""
  );


  lines.push(

    finalOutput

    ||

    execution?.output

    ||

    execution?.stdout

    ||

    "Program finished with no output."

  );


  return lines.join(
    "\n"
  );

}


/* =========================================================
   VISUALIZER EXECUTION FALLBACK
   Uses Pyodide if backend does not execute
========================================================= */

async function runForVisualizer(
  code
) {

  try {

    const runtime =
      await initializePyodide();


    runtime.globals.set(
      "__hamim_visual_code",
      code
    );


    runtime.globals.set(
      "__hamim_visual_input",
      programInput.value
    );


    const result =
      await runtime.runPythonAsync(`
import sys
import io
import traceback
import contextlib

__out = io.StringIO()
__err = io.StringIO()
__input = io.StringIO(__hamim_visual_input)

__old_stdin = sys.stdin

try:
    sys.stdin = __input

    with contextlib.redirect_stdout(__out), contextlib.redirect_stderr(__err):
        try:
            exec(
                compile(
                    __hamim_visual_code,
                    "<main.py>",
                    "exec"
                ),
                {"__name__": "__main__"}
            )
        except Exception:
            traceback.print_exc()

finally:
    sys.stdin = __old_stdin

__text = __out.getvalue()
__error = __err.getvalue()

if __error:
    if __text:
        __text += "\\n"
    __text += __error

__text
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

    return [

      "EXECUTION ERROR",
      "===============",
      "",
      error.message

    ].join(
      "\n"
    );

  }

}


/* =========================================================
   SLEEP HELPER
========================================================= */

function sleep(
  milliseconds
) {

  return new Promise(
    resolve => {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

}


/* =========================================================
   KEYBOARD SHORTCUT
   CTRL + ENTER = RUN
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