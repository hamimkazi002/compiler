/* =========================================================
   ELEMENTS
========================================================= */

const languageSelect =
    document.getElementById("languageSelect");

const languageLogo =
    document.getElementById("languageLogo");

const fileName =
    document.getElementById("fileName");

const editorTitle =
    document.getElementById("editorTitle");

const outputType =
    document.getElementById("outputType");

const normalEditor =
    document.getElementById("normalEditor");

const webEditors =
    document.getElementById("webEditors");

const codeEditor =
    document.getElementById("codeEditor");

const htmlEditor =
    document.getElementById("htmlEditor");

const cssEditor =
    document.getElementById("cssEditor");

const htmlBox =
    document.getElementById("htmlBox");

const cssBox =
    document.getElementById("cssBox");

const webResizer =
    document.getElementById("webResizer");

const workspace =
    document.getElementById("workspace");

const editorPanel =
    document.getElementById("editorPanel");

const outputPanel =
    document.getElementById("outputPanel");

const mainResizer =
    document.getElementById("mainResizer");

const lineNumbers =
    document.getElementById("lineNumbers");

const runBtn =
    document.getElementById("runBtn");

const runText =
    document.getElementById("runText");

const clearBtn =
    document.getElementById("clearBtn");

const themeBtn =
    document.getElementById("themeBtn");

const visualizeBtn =
    document.getElementById("visualizeBtn");

const outputConsole =
    document.getElementById("outputConsole");

const previewFrame =
    document.getElementById("previewFrame");

const jsRunnerFrame =
    document.getElementById("jsRunnerFrame");

const inputSection =
    document.getElementById("inputSection");

const programInput =
    document.getElementById("programInput");

const engineStatus =
    document.getElementById("engineStatus");

const statusText =
    document.getElementById("statusText");


/* =========================================================
   OUTPUT / VISUALIZER
========================================================= */

const outputTabBtn =
    document.getElementById("outputTabBtn");

const visualizerTabBtn =
    document.getElementById("visualizerTabBtn");

const outputView =
    document.getElementById("outputView");

const visualizerView =
    document.getElementById("visualizerView");

const visualizerSubtitle =
    document.getElementById("visualizerSubtitle");


/* =========================================================
   PIPELINE
========================================================= */

const stageSource =
    document.getElementById("stageSource");

const stageLexical =
    document.getElementById("stageLexical");

const stageSyntax =
    document.getElementById("stageSyntax");

const stageSemantic =
    document.getElementById("stageSemantic");

const stageIntermediate =
    document.getElementById("stageIntermediate");

const stageOptimization =
    document.getElementById("stageOptimization");

const stageTarget =
    document.getElementById("stageTarget");

const stageMachine =
    document.getElementById("stageMachine");

const stageFinalOutput =
    document.getElementById("stageFinalOutput");


const sourceOutput =
    document.getElementById("sourceOutput");

const lexicalOutput =
    document.getElementById("lexicalOutput");

const syntaxOutput =
    document.getElementById("syntaxOutput");

const semanticOutput =
    document.getElementById("semanticOutput");

const intermediateOutput =
    document.getElementById("intermediateOutput");

const optimizationOutput =
    document.getElementById("optimizationOutput");

const targetOutput =
    document.getElementById("targetOutput");

const machineOutput =
    document.getElementById("machineOutput");

const finalVisualizerOutput =
    document.getElementById("finalVisualizerOutput");


const stages = [
    stageSource,
    stageLexical,
    stageSyntax,
    stageSemantic,
    stageIntermediate,
    stageOptimization,
    stageTarget,
    stageMachine,
    stageFinalOutput
];


/* =========================================================
   DEFAULT CODE
========================================================= */

const pythonStarter =
`a = 10
b = 20

print(a + b)`;


const javascriptStarter =
`const a = 10;
const b = 20;

console.log(a + b);`;


let savedPython =
    pythonStarter;


let savedJavaScript =
    javascriptStarter;


let currentLanguage =
    "python";


/* =========================================================
   THEME
========================================================= */

function setTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );


    if (theme === "dark") {

        themeBtn.textContent = "☀";

        themeBtn.title =
            "Switch to light theme";

    } else {

        themeBtn.textContent = "☾";

        themeBtn.title =
            "Switch to dark theme";
    }


    localStorage.setItem(
        "compiler-theme",
        theme
    );
}


const savedTheme =
    localStorage.getItem(
        "compiler-theme"
    );


setTheme(
    savedTheme || "dark"
);


themeBtn.addEventListener(
    "click",
    () => {

        const current =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );


        setTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }
);


/* =========================================================
   PYTHON ENGINE
========================================================= */

let pyodide = null;

let pythonReady = false;

let pythonFailed = false;


function setStatus(
    text,
    ready = false
) {

    statusText.textContent =
        text;


    if (ready) {

        engineStatus.classList.add(
            "ready"
        );

    } else {

        engineStatus.classList.remove(
            "ready"
        );
    }
}


/* =========================================================
   INITIALIZE PYTHON
========================================================= */

async function initializePython() {

    setStatus(
        "Loading Python"
    );


    try {

        if (
            typeof loadPyodide ===
            "undefined"
        ) {

            throw new Error(
                "Pyodide could not load."
            );
        }


        pyodide =
            await loadPyodide();


        pythonReady = true;

        pythonFailed = false;


        setStatus(
            "Python Ready",
            true
        );


        if (
            currentLanguage ===
            "python"
        ) {

            outputConsole.textContent =
                "Python is ready.\n\nWrite code and click Run.";
        }


        updateRunButton();

    } catch (error) {

        pythonReady = false;

        pythonFailed = true;


        setStatus(
            "Python Failed"
        );


        if (
            currentLanguage ===
            "python"
        ) {

            outputConsole.textContent =
                "Python failed to load.\n\n"
                +
                error.message;
        }


        updateRunButton();
    }
}


/* =========================================================
   RUN BUTTON
========================================================= */

function updateRunButton() {

    if (
        currentLanguage ===
        "python"
    ) {

        if (pythonReady) {

            runBtn.disabled = false;

            runText.textContent = "Run";

        } else if (pythonFailed) {

            runBtn.disabled = true;

            runText.textContent = "Failed";

        } else {

            runBtn.disabled = true;

            runText.textContent = "Loading";
        }

    } else {

        runBtn.disabled = false;

        runText.textContent = "Run";
    }
}


/* =========================================================
   OUTPUT / VISUALIZER TAB
========================================================= */

function showOutputView() {

    outputView.classList.remove(
        "hidden"
    );

    visualizerView.classList.add(
        "hidden"
    );

    outputTabBtn.classList.add(
        "active"
    );

    visualizerTabBtn.classList.remove(
        "active"
    );
}


function showVisualizerView() {

    outputView.classList.add(
        "hidden"
    );

    visualizerView.classList.remove(
        "hidden"
    );

    outputTabBtn.classList.remove(
        "active"
    );

    visualizerTabBtn.classList.add(
        "active"
    );
}


outputTabBtn.addEventListener(
    "click",
    showOutputView
);


visualizerTabBtn.addEventListener(
    "click",
    showVisualizerView
);


/* =========================================================
   LANGUAGE CHANGE
========================================================= */

function changeLanguage(language) {

    if (
        currentLanguage ===
        "python"
    ) {

        savedPython =
            codeEditor.value;
    }


    if (
        currentLanguage ===
        "javascript"
    ) {

        savedJavaScript =
            codeEditor.value;
    }


    currentLanguage =
        language;


    /* -------------------------
       PYTHON
    ------------------------- */

    if (
        language ===
        "python"
    ) {

        normalEditor.classList.remove(
            "hidden"
        );

        webEditors.classList.add(
            "hidden"
        );

        inputSection.classList.remove(
            "hidden"
        );


        outputConsole.hidden = false;

        previewFrame.hidden = true;


        languageLogo.textContent =
            "Py";

        fileName.textContent =
            "main.py";

        editorTitle.textContent =
            "Python Code";

        outputType.textContent =
            "Console";

        codeEditor.value =
            savedPython;


        if (pythonReady) {

            outputConsole.textContent =
                "Python is ready.\n\nWrite code and click Run.";

        } else {

            outputConsole.textContent =
                "Loading Python engine...";
        }
    }


    /* -------------------------
       JAVASCRIPT
    ------------------------- */

    if (
        language ===
        "javascript"
    ) {

        normalEditor.classList.remove(
            "hidden"
        );

        webEditors.classList.add(
            "hidden"
        );

        inputSection.classList.add(
            "hidden"
        );


        outputConsole.hidden = false;

        previewFrame.hidden = true;


        languageLogo.textContent =
            "JS";

        fileName.textContent =
            "main.js";

        editorTitle.textContent =
            "JavaScript Code";

        outputType.textContent =
            "Console";

        codeEditor.value =
            savedJavaScript;


        outputConsole.textContent =
            "JavaScript is ready.\n\nWrite code and click Run.";
    }


    /* -------------------------
       HTML + CSS
    ------------------------- */

    if (
        language ===
        "web"
    ) {

        normalEditor.classList.add(
            "hidden"
        );

        webEditors.classList.remove(
            "hidden"
        );

        inputSection.classList.add(
            "hidden"
        );


        outputConsole.hidden = true;

        previewFrame.hidden = false;


        languageLogo.textContent =
            "Web";

        fileName.textContent =
            "index.html + style.css";

        outputType.textContent =
            "Browser";


        runWeb();
    }


    showOutputView();

    updateLineNumbers();

    updateRunButton();
}


languageSelect.addEventListener(
    "change",
    () => {

        changeLanguage(
            languageSelect.value
        );
    }
);


/* =========================================================
   LINE NUMBERS
========================================================= */

function updateLineNumbers() {

    const count =
        codeEditor.value
            .split("\n")
            .length;


    lineNumbers.innerHTML =
        "";


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const line =
            document.createElement(
                "div"
            );


        line.textContent = i;


        lineNumbers.appendChild(
            line
        );
    }
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
   TAB SUPPORT
========================================================= */

function addTabSupport(editor) {

    editor.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Tab"
            ) {

                event.preventDefault();


                const start =
                    this.selectionStart;

                const end =
                    this.selectionEnd;


                this.value =
                    this.value.substring(
                        0,
                        start
                    )
                    +
                    "    "
                    +
                    this.value.substring(
                        end
                    );


                this.selectionStart =
                    this.selectionEnd =
                        start + 4;


                if (
                    editor ===
                    codeEditor
                ) {

                    updateLineNumbers();
                }
            }


            if (
                event.key === "Enter"
                &&
                (
                    event.ctrlKey
                    ||
                    event.metaKey
                )
            ) {

                event.preventDefault();

                runSelected();
            }
        }
    );
}


addTabSupport(
    codeEditor
);

addTabSupport(
    htmlEditor
);

addTabSupport(
    cssEditor
);


/* =========================================================
   RUN
========================================================= */

async function runSelected() {

    showOutputView();


    if (
        currentLanguage ===
        "python"
    ) {

        await runPython();

        return;
    }


    if (
        currentLanguage ===
        "javascript"
    ) {

        await runJavaScript();

        return;
    }


    if (
        currentLanguage ===
        "web"
    ) {

        runWeb();
    }
}


runBtn.addEventListener(
    "click",
    runSelected
);


/* =========================================================
   PYTHON RUNNER
========================================================= */

async function runPython() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        outputConsole.textContent =
            "Please write Python code.";

        return;
    }


    if (
        !pythonReady
        ||
        !pyodide
    ) {

        outputConsole.textContent =
            "Python is still loading...";

        return;
    }


    runBtn.disabled = true;

    runText.textContent =
        "Running";


    let stdout = "";

    let stderr = "";


    outputConsole.textContent =
        "Running Python...";


    try {

        pyodide.setStdout({

            batched: (text) => {

                stdout +=
                    text + "\n";
            }
        });


        pyodide.setStderr({

            batched: (text) => {

                stderr +=
                    text + "\n";
            }
        });


        const inputLines =
            programInput.value
                .replace(/\r/g, "")
                .split("\n");


        let inputIndex = 0;


        pyodide.setStdin({

            stdin: () => {

                if (
                    inputIndex <
                    inputLines.length
                ) {

                    return inputLines[
                        inputIndex++
                    ];
                }


                return null;
            }
        });


        try {

            await pyodide
                .loadPackagesFromImports(
                    code
                );

        } catch (
            packageError
        ) {

            console.warn(
                packageError
            );
        }


        await pyodide.runPythonAsync(
            code
        );


        let result = "";


        if (
            stdout.trim()
        ) {

            result +=
                stdout.trimEnd();
        }


        if (
            stderr.trim()
        ) {

            if (result) {

                result +=
                    "\n\n";
            }


            result +=
                stderr.trimEnd();
        }


        if (!result) {

            result =
                "Program finished with no output.";
        }


        result +=
            "\n\n✓ Code Execution Successful";


        outputConsole.textContent =
            result;

    } catch (error) {

        let result = "";


        if (
            stdout.trim()
        ) {

            result +=
                stdout.trimEnd();
        }


        if (
            stderr.trim()
        ) {

            if (result) {

                result +=
                    "\n\n";
            }


            result +=
                stderr.trimEnd();
        }


        if (result) {

            result +=
                "\n\n";
        }


        result +=
            error.message
            ||
            String(error);


        outputConsole.textContent =
            result;

    } finally {

        runBtn.disabled = false;

        runText.textContent =
            "Run";
    }
}


/* =========================================================
   JAVASCRIPT RUNNER
========================================================= */

async function runJavaScript() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        outputConsole.textContent =
            "Please write JavaScript code.";

        return;
    }


    runBtn.disabled = true;

    runText.textContent =
        "Running";


    outputConsole.textContent =
        "Running JavaScript...";


    const runId =
        Date.now()
            .toString()
        +
        Math.random()
            .toString(36);


    const safeCode =
        JSON.stringify(code)
            .replace(
                /</g,
                "\\u003c"
            );


    const runnerDocument =
`
<!DOCTYPE html>
<html>
<body>

<script>

const logs = [];

const runId =
    ${JSON.stringify(runId)};

const code =
    ${safeCode};


function formatValue(value) {

    if (
        typeof value === "string"
    ) {

        return value;
    }


    try {

        return JSON.stringify(
            value,
            null,
            2
        );

    } catch {

        return String(value);
    }
}


console.log =
    (...args) => {

        logs.push(
            args
                .map(formatValue)
                .join(" ")
        );
    };


console.warn =
    (...args) => {

        logs.push(
            "Warning: "
            +
            args
                .map(formatValue)
                .join(" ")
        );
    };


console.error =
    (...args) => {

        logs.push(
            "Error: "
            +
            args
                .map(formatValue)
                .join(" ")
        );
    };


(async () => {

    try {

        const AsyncFunction =
            Object.getPrototypeOf(
                async function(){}
            ).constructor;


        const fn =
            new AsyncFunction(
                code
            );


        const value =
            await fn();


        if (
            value !== undefined
        ) {

            logs.push(
                formatValue(value)
            );
        }


        parent.postMessage(
            {
                source:
                    "hamim-compiler",

                type:
                    "js-result",

                runId,

                success:
                    true,

                output:
                    logs.join("\\n")
            },
            "*"
        );

    } catch (error) {

        parent.postMessage(
            {
                source:
                    "hamim-compiler",

                type:
                    "js-result",

                runId,

                success:
                    false,

                output:
                    logs.join("\\n"),

                error:
                    error.stack
                    ||
                    error.message
            },
            "*"
        );
    }

})();

<\/script>

</body>
</html>
`;


    await new Promise(
        (resolve) => {

            const timeout =
                setTimeout(
                    () => {

                        window.removeEventListener(
                            "message",
                            handler
                        );


                        outputConsole.textContent =
                            "JavaScript execution timed out.";


                        resolve();

                    },
                    10000
                );


            function handler(event) {

                if (
                    event.source !==
                    jsRunnerFrame.contentWindow
                ) {

                    return;
                }


                const data =
                    event.data;


                if (
                    !data
                    ||
                    data.source !==
                        "hamim-compiler"
                    ||
                    data.type !==
                        "js-result"
                    ||
                    data.runId !==
                        runId
                ) {

                    return;
                }


                clearTimeout(
                    timeout
                );


                window.removeEventListener(
                    "message",
                    handler
                );


                let result =
                    data.output || "";


                if (
                    data.error
                ) {

                    if (result) {

                        result +=
                            "\n\n";
                    }


                    result +=
                        data.error;
                }


                if (
                    data.success
                ) {

                    if (!result) {

                        result =
                            "Program finished with no output.";
                    }


                    result +=
                        "\n\n✓ Code Execution Successful";
                }


                outputConsole.textContent =
                    result;


                resolve();
            }


            window.addEventListener(
                "message",
                handler
            );


            jsRunnerFrame.srcdoc =
                runnerDocument;
        }
    );


    runBtn.disabled = false;

    runText.textContent =
        "Run";
}


/* =========================================================
   HTML + CSS
========================================================= */

function runWeb() {

    const html =
        htmlEditor.value;

    const css =
        cssEditor.value;


    previewFrame.srcdoc =
`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<style>

${css}

</style>

</head>

<body>

${html}

</body>

</html>
`;
}


/* =========================================================
   CLEAR
========================================================= */

clearBtn.addEventListener(
    "click",
    () => {

        if (
            currentLanguage ===
            "web"
        ) {

            previewFrame.srcdoc =
                "";

        } else {

            outputConsole.textContent =
                "";
        }


        resetVisualizer();
    }
);


/* =========================================================
   VISUALIZER HELPERS
========================================================= */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


function resetVisualizer() {

    stages.forEach(
        stage => {

            stage.classList.remove(
                "active",
                "completed",
                "error",
                "processing"
            );
        }
    );


    sourceOutput.textContent =
        "Waiting for visualization...";

    lexicalOutput.textContent =
        "Tokens will appear here.";

    syntaxOutput.textContent =
        "AST / syntax tree will appear here.";

    semanticOutput.textContent =
        "Semantic information will appear here.";

    intermediateOutput.textContent =
        "Intermediate representation will appear here.";

    optimizationOutput.textContent =
        "Optimization information will appear here.";

    targetOutput.textContent =
        "Target code will appear here.";

    machineOutput.textContent =
`Runtime information will appear here.`;

    finalVisualizerOutput.textContent =
        "Program output will appear here.";
}


async function completeStage(
    stage,
    outputElement,
    text
) {

    stage.classList.add(
        "processing",
        "active"
    );


    outputElement.textContent =
        text;


    await sleep(
        220
    );


    stage.classList.remove(
        "processing",
        "active"
    );


    stage.classList.add(
        "completed"
    );
}


function setStageError(
    stage,
    outputElement,
    message
) {

    stage.classList.remove(
        "processing",
        "active"
    );


    stage.classList.add(
        "error"
    );


    outputElement.textContent =
        message;
}


/* =========================================================
   CHANGE VISUALIZER TITLES
========================================================= */

function setStageTitle(
    stage,
    title
) {

    const titleElement =
        stage.querySelector(
            ".stage-title"
        );


    if (
        titleElement
    ) {

        titleElement.textContent =
            title;
    }
}


/* =========================================================
   VISUALIZE
========================================================= */

visualizeBtn.addEventListener(
    "click",
    visualizeSelected
);


async function visualizeSelected() {

    showVisualizerView();

    resetVisualizer();


    visualizeBtn.disabled =
        true;


    visualizeBtn.textContent =
        "◈ Processing...";


    try {

        if (
            currentLanguage ===
            "python"
        ) {

            await visualizePython();

        } else if (
            currentLanguage ===
            "javascript"
        ) {

            await visualizeJavaScript();

        } else {

            await visualizeWeb();
        }

    } catch (error) {

        console.error(
            error
        );


        finalVisualizerOutput.textContent =
            error.message
            ||
            String(error);

    } finally {

        visualizeBtn.disabled =
            false;


        visualizeBtn.textContent =
            "◈ Visualize";
    }
}


/* =========================================================
   PYTHON VISUALIZER
========================================================= */

async function visualizePython() {

    if (
        !pythonReady
        ||
        !pyodide
    ) {

        finalVisualizerOutput.textContent =
            "Python engine is still loading.";

        return;
    }


    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        finalVisualizerOutput.textContent =
            "Please write Python code first.";

        return;
    }


    visualizerSubtitle.textContent =
        "Python compiler and runtime visualization";


    setStageTitle(
        stageSource,
        "Source Code"
    );

    setStageTitle(
        stageLexical,
        "Lexical Analysis"
    );

    setStageTitle(
        stageSyntax,
        "Syntax Analysis"
    );

    setStageTitle(
        stageSemantic,
        "Semantic Analysis"
    );

    setStageTitle(
        stageIntermediate,
        "Intermediate Code Generation"
    );

    setStageTitle(
        stageOptimization,
        "Code Optimization"
    );

    setStageTitle(
        stageTarget,
        "Target Code Generation"
    );

    setStageTitle(
        stageMachine,
        "Machine Code / Runtime"
    );

    setStageTitle(
        stageFinalOutput,
        "Final Output"
    );


    await completeStage(
        stageSource,
        sourceOutput,
        code
    );


    pyodide.globals.set(
        "__hamim_code__",
        code
    );


    const inputLines =
        programInput.value
            .replace(/\r/g, "")
            .split("\n");


    pyodide.globals.set(
        "__hamim_inputs__",
        inputLines
    );


    const analyzerCode =
`
import ast
import io
import tokenize
import token
import dis
import json
import builtins
import contextlib
import traceback


code = __hamim_code__
input_values = list(__hamim_inputs__)


result = {
    "lexical": "",
    "syntax": "",
    "semantic": "",
    "intermediate": "",
    "optimization": "",
    "target": "",
    "runtime": "",
    "output": "",
    "error": ""
}


# ========================================
# LEXICAL ANALYSIS
# ========================================

try:

    token_lines = []

    reader = io.StringIO(code).readline

    for tok in tokenize.generate_tokens(reader):

        token_name = token.tok_name.get(
            tok.type,
            str(tok.type)
        )

        if token_name in (
            "ENCODING",
            "ENDMARKER",
            "NL"
        ):
            continue

        value = tok.string

        if value == "\\n":
            value = "\\\\n"

        token_lines.append(
            f"{token_name:<12} {value}"
        )

    result["lexical"] = "\\n".join(token_lines)

except Exception as e:

    result["lexical"] = str(e)


# ========================================
# SYNTAX ANALYSIS
# ========================================

try:

    tree = ast.parse(code)

    result["syntax"] = ast.dump(
        tree,
        indent=2
    )

except Exception as e:

    result["syntax"] = str(e)

    result["error"] = str(e)


# ========================================
# SEMANTIC ANALYSIS
# ========================================

if not result["error"]:

    assigned = set()
    loaded = set()
    constants = []

    builtin_names = set(dir(builtins))

    class SemanticVisitor(ast.NodeVisitor):

        def visit_Name(self, node):

            if isinstance(
                node.ctx,
                ast.Store
            ):

                assigned.add(
                    node.id
                )

            elif isinstance(
                node.ctx,
                ast.Load
            ):

                loaded.add(
                    node.id
                )

            self.generic_visit(node)


        def visit_Constant(self, node):

            constants.append(
                (
                    repr(node.value),
                    type(node.value).__name__
                )
            )

            self.generic_visit(node)


    visitor = SemanticVisitor()

    visitor.visit(tree)


    semantic_lines = []


    if assigned:

        semantic_lines.append(
            "Defined variables:"
        )

        for name in sorted(assigned):

            semantic_lines.append(
                f"  {name}"
            )


    if constants:

        semantic_lines.append(
            "\\nDetected constants:"
        )

        for value, value_type in constants:

            semantic_lines.append(
                f"  {value} → {value_type}"
            )


    undefined = (
        loaded
        -
        assigned
        -
        builtin_names
    )


    if undefined:

        semantic_lines.append(
            "\\nPossible undefined names:"
        )

        for name in sorted(undefined):

            semantic_lines.append(
                f"  ⚠ {name}"
            )

    else:

        semantic_lines.append(
            "\\n✓ Basic semantic checks passed"
        )


    result["semantic"] = "\\n".join(
        semantic_lines
    )


# ========================================
# INTERMEDIATE CODE
# Educational representation
# ========================================

if not result["error"]:

    ir_lines = []

    temp_counter = [0]


    def new_temp():

        temp_counter[0] += 1

        return f"t{temp_counter[0]}"


    def expr_to_ir(node):

        if isinstance(
            node,
            ast.Constant
        ):

            temp = new_temp()

            ir_lines.append(
                f"{temp} = {repr(node.value)}"
            )

            return temp


        if isinstance(
            node,
            ast.Name
        ):

            return node.id


        if isinstance(
            node,
            ast.BinOp
        ):

            left = expr_to_ir(
                node.left
            )

            right = expr_to_ir(
                node.right
            )

            temp = new_temp()

            operator = type(
                node.op
            ).__name__

            ir_lines.append(
                f"{temp} = {left} {operator} {right}"
            )

            return temp


        try:

            return ast.unparse(node)

        except Exception:

            return type(node).__name__


    for statement in tree.body:

        if isinstance(
            statement,
            ast.Assign
        ):

            value = expr_to_ir(
                statement.value
            )

            for target in statement.targets:

                if isinstance(
                    target,
                    ast.Name
                ):

                    ir_lines.append(
                        f"{target.id} = {value}"
                    )


        elif isinstance(
            statement,
            ast.Expr
        ) and isinstance(
            statement.value,
            ast.Call
        ):

            call = statement.value

            try:

                function_name = ast.unparse(
                    call.func
                )

            except Exception:

                function_name = "CALL"


            args = []

            for arg in call.args:

                args.append(
                    expr_to_ir(arg)
                )


            ir_lines.append(
                f"CALL {function_name}, "
                +
                ", ".join(args)
            )


        else:

            try:

                ir_lines.append(
                    ast.unparse(statement)
                )

            except Exception:

                ir_lines.append(
                    type(statement).__name__
                )


    result["intermediate"] = (
        "\\n".join(ir_lines)
        if ir_lines
        else
        "No intermediate representation generated."
    )


# ========================================
# OPTIMIZATION
# Educational constant folding
# ========================================

if not result["error"]:

    class ConstantFolder(ast.NodeTransformer):

        def visit_BinOp(self, node):

            node = self.generic_visit(node)

            if (
                isinstance(node.left, ast.Constant)
                and
                isinstance(node.right, ast.Constant)
            ):

                try:

                    expression = ast.Expression(
                        body=node
                    )

                    value = eval(
                        compile(
                            expression,
                            "<optimizer>",
                            "eval"
                        ),
                        {}
                    )

                    return ast.copy_location(
                        ast.Constant(
                            value=value
                        ),
                        node
                    )

                except Exception:

                    pass

            return node


    optimized_tree = ConstantFolder().visit(
        ast.parse(code)
    )

    ast.fix_missing_locations(
        optimized_tree
    )


    try:

        optimized_code = ast.unparse(
            optimized_tree
        )

    except Exception:

        optimized_code = (
            "Optimization representation unavailable."
        )


    result["optimization"] = (
        "Educational constant-folding pass:\\n\\n"
        +
        optimized_code
    )


# ========================================
# TARGET CODE - REAL PYTHON BYTECODE
# ========================================

if not result["error"]:

    try:

        compiled = compile(
            code,
            "<hamim-compiler>",
            "exec"
        )


        bytecode_stream = io.StringIO()


        with contextlib.redirect_stdout(
            bytecode_stream
        ):

            dis.dis(
                compiled
            )


        result["target"] = (
            bytecode_stream.getvalue()
        )

    except Exception as e:

        result["target"] = str(e)


# ========================================
# RUNTIME / MACHINE STAGE
# ========================================

result["runtime"] = """Python Source
↓
Python Bytecode
↓
CPython Runtime
↓
Pyodide
↓
WebAssembly
↓
Browser Runtime
↓
CPU Machine Instructions

Note:
Raw native CPU machine code is not directly
exposed by Pyodide in this browser environment."""


# ========================================
# EXECUTION
# ========================================

if not result["error"]:

    stdout_buffer = io.StringIO()

    stderr_buffer = io.StringIO()


    input_iterator = iter(
        input_values
    )


    original_input = builtins.input


    def custom_input(prompt=""):

        if prompt:

            print(
                prompt,
                end=""
            )

        try:

            return next(
                input_iterator
            )

        except StopIteration:

            raise EOFError(
                "No more program input available."
            )


    builtins.input = custom_input


    try:

        execution_globals = {
            "__name__": "__main__"
        }


        with contextlib.redirect_stdout(
            stdout_buffer
        ), contextlib.redirect_stderr(
            stderr_buffer
        ):

            exec(
                compile(
                    code,
                    "<hamim-compiler>",
                    "exec"
                ),
                execution_globals
            )


        output_text = (
            stdout_buffer.getvalue()
            +
            stderr_buffer.getvalue()
        )


        if not output_text.strip():

            output_text = (
                "Program finished with no output."
            )


        result["output"] = output_text


    except Exception:

        result["output"] = (
            stdout_buffer.getvalue()
            +
            stderr_buffer.getvalue()
            +
            traceback.format_exc()
        )


    finally:

        builtins.input = original_input


json.dumps(result)
`;


    let rawResult;


    try {

        rawResult =
            await pyodide.runPythonAsync(
                analyzerCode
            );

    } catch (error) {

        setStageError(
            stageLexical,
            lexicalOutput,
            error.message
            ||
            String(error)
        );

        return;
    }


    const analysis =
        JSON.parse(
            String(rawResult)
        );


    await completeStage(
        stageLexical,
        lexicalOutput,
        analysis.lexical
        ||
        "No tokens generated."
    );


    if (
        analysis.error
    ) {

        setStageError(
            stageSyntax,
            syntaxOutput,
            analysis.syntax
            ||
            analysis.error
        );


        semanticOutput.textContent =
            "Stopped because syntax analysis failed.";

        intermediateOutput.textContent =
            "Stopped because syntax analysis failed.";

        optimizationOutput.textContent =
            "Stopped because syntax analysis failed.";

        targetOutput.textContent =
            "Stopped because syntax analysis failed.";

        finalVisualizerOutput.textContent =
            analysis.error;


        return;
    }


    await completeStage(
        stageSyntax,
        syntaxOutput,
        analysis.syntax
    );


    await completeStage(
        stageSemantic,
        semanticOutput,
        analysis.semantic
    );


    await completeStage(
        stageIntermediate,
        intermediateOutput,
        analysis.intermediate
    );


    await completeStage(
        stageOptimization,
        optimizationOutput,
        analysis.optimization
    );


    await completeStage(
        stageTarget,
        targetOutput,
        analysis.target
    );


    await completeStage(
        stageMachine,
        machineOutput,
        analysis.runtime
    );


    await completeStage(
        stageFinalOutput,
        finalVisualizerOutput,
        analysis.output
    );
}


/* =========================================================
   JAVASCRIPT VISUALIZER
========================================================= */

async function visualizeJavaScript() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        finalVisualizerOutput.textContent =
            "Please write JavaScript code first.";

        return;
    }


    visualizerSubtitle.textContent =
        "JavaScript engine pipeline visualization";


    setStageTitle(
        stageSource,
        "Source Code"
    );

    setStageTitle(
        stageLexical,
        "Lexical Analysis"
    );

    setStageTitle(
        stageSyntax,
        "Syntax Analysis"
    );

    setStageTitle(
        stageSemantic,
        "Semantic Analysis"
    );

    setStageTitle(
        stageIntermediate,
        "Intermediate Representation"
    );

    setStageTitle(
        stageOptimization,
        "JIT Optimization"
    );

    setStageTitle(
        stageTarget,
        "Target Code Generation"
    );

    setStageTitle(
        stageMachine,
        "Machine Runtime"
    );

    setStageTitle(
        stageFinalOutput,
        "Final Output"
    );


    await completeStage(
        stageSource,
        sourceOutput,
        code
    );


    const tokens =
        code.match(
            /[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|===|!==|==|!=|=>|<=|>=|\+\+|--|&&|\|\||[{}()[\];,.+\-*\/%=<>]/g
        )
        ||
        [];


    await completeStage(
        stageLexical,
        lexicalOutput,
        tokens
            .map(
                (
                    tokenValue,
                    index
                ) =>
                    `${index + 1}. ${tokenValue}`
            )
            .join("\n")
    );


    let syntaxMessage;


    try {

        new Function(
            code
        );


        syntaxMessage =
            "✓ JavaScript syntax is valid.";

    } catch (error) {

        setStageError(
            stageSyntax,
            syntaxOutput,
            error.message
        );


        return;
    }


    await completeStage(
        stageSyntax,
        syntaxOutput,
        syntaxMessage
    );


    await completeStage(
        stageSemantic,
        semanticOutput,
`Educational semantic analysis:

• Identifier references are resolved by the JavaScript engine.
• Scope rules are applied.
• Operations and function calls are validated at runtime.
• Dynamic JavaScript types may be determined during execution.`
    );


    await completeStage(
        stageIntermediate,
        intermediateOutput,
`Educational representation:

JavaScript Source
↓
Parser
↓
AST
↓
Engine Internal Representation
↓
Execution`
    );


    await completeStage(
        stageOptimization,
        optimizationOutput,
`Modern JavaScript engines may optimize frequently executed code using JIT compilation.

Possible techniques include:
• Constant folding
• Inline caching
• Function inlining
• Dead-code elimination
• Specialized machine instructions`
    );


    await completeStage(
        stageTarget,
        targetOutput,
`JavaScript engine target stage:

JavaScript
↓
Bytecode / Internal Instructions
↓
JIT Compiler
↓
Optimized Native Instructions

Exact engine bytecode is not exposed by normal browser JavaScript APIs.`
    );


    await completeStage(
        stageMachine,
        machineOutput,
`JavaScript Source
↓
Browser JavaScript Engine
↓
Interpreter / JIT Compiler
↓
Native Machine Instructions
↓
CPU`
    );


    showOutputView();

    await runJavaScript();

    const jsResult =
        outputConsole.textContent;


    showVisualizerView();


    await completeStage(
        stageFinalOutput,
        finalVisualizerOutput,
        jsResult
    );
}


/* =========================================================
   HTML + CSS VISUALIZER
========================================================= */

async function visualizeWeb() {

    const html =
        htmlEditor.value;

    const css =
        cssEditor.value;


    visualizerSubtitle.textContent =
        "HTML and CSS browser rendering pipeline";


    setStageTitle(
        stageSource,
        "HTML + CSS Source"
    );

    setStageTitle(
        stageLexical,
        "HTML Tokenization"
    );

    setStageTitle(
        stageSyntax,
        "DOM Tree"
    );

    setStageTitle(
        stageSemantic,
        "CSS Parsing / CSSOM"
    );

    setStageTitle(
        stageIntermediate,
        "Render Tree"
    );

    setStageTitle(
        stageOptimization,
        "Style & Layout Calculation"
    );

    setStageTitle(
        stageTarget,
        "Paint Instructions"
    );

    setStageTitle(
        stageMachine,
        "Browser Rendering"
    );

    setStageTitle(
        stageFinalOutput,
        "Final Preview"
    );


    await completeStage(
        stageSource,
        sourceOutput,
`HTML:

${html}


CSS:

${css}`
    );


    const htmlTokens =
        html.match(
            /<\/?[^>]+>|[^<]+/g
        )
        ||
        [];


    await completeStage(
        stageLexical,
        lexicalOutput,
        htmlTokens
            .map(
                (
                    item,
                    index
                ) =>
                    `${index + 1}. ${item.trim()}`
            )
            .filter(
                item =>
                    item.trim()
            )
            .join("\n")
    );


    const parser =
        new DOMParser();


    const documentTree =
        parser.parseFromString(
            html,
            "text/html"
        );


    function printDOM(
        node,
        depth = 0
    ) {

        let text = "";


        const indent =
            "  ".repeat(
                depth
            );


        if (
            node.nodeType ===
            Node.ELEMENT_NODE
        ) {

            text +=
                indent
                +
                node.tagName;


            if (
                node.id
            ) {

                text +=
                    `#${node.id}`;
            }


            if (
                node.classList
                &&
                node.classList.length
            ) {

                text +=
                    "."
                    +
                    [
                        ...node.classList
                    ].join(".");
            }


            text += "\n";
        }


        if (
            node.nodeType ===
            Node.TEXT_NODE
            &&
            node.textContent.trim()
        ) {

            text +=
                indent
                +
                `  "${node.textContent.trim()}"`
                +
                "\n";
        }


        node.childNodes.forEach(
            child => {

                text +=
                    printDOM(
                        child,
                        depth + 1
                    );
            }
        );


        return text;
    }


    await completeStage(
        stageSyntax,
        syntaxOutput,
        printDOM(
            documentTree.body
        )
    );


    await completeStage(
        stageSemantic,
        semanticOutput,
`CSS rules are parsed into CSSOM.

CSS Source:

${css}`
    );


    await completeStage(
        stageIntermediate,
        intermediateOutput,
`DOM Tree
     +
CSSOM
     ↓
Render Tree

Only visible elements participate in the final render tree.`
    );


    await completeStage(
        stageOptimization,
        optimizationOutput,
`Browser calculates:

• Computed styles
• Element width and height
• Position
• Margin and padding
• Font metrics
• Layout relationships`
    );


    await completeStage(
        stageTarget,
        targetOutput,
`Paint instructions are generated for:

• Text
• Backgrounds
• Borders
• Shadows
• Images
• UI controls`
    );


    await completeStage(
        stageMachine,
        machineOutput,
`HTML + CSS
↓
DOM + CSSOM
↓
Render Tree
↓
Layout
↓
Paint
↓
Compositing
↓
Browser Display`
    );


    runWeb();


    await completeStage(
        stageFinalOutput,
        finalVisualizerOutput,
`✓ Rendering completed.

Open the Output tab to see the actual webpage preview.`
    );
}


/* =========================================================
   HTML / CSS RESIZER
========================================================= */

function initWebResizer() {

    let dragging = false;


    webResizer.addEventListener(
        "mousedown",
        event => {

            dragging = true;


            document.body.style.userSelect =
                "none";


            document.body.style.cursor =
                "row-resize";


            event.preventDefault();
        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (
                !dragging
            ) {

                return;
            }


            const rect =
                webEditors
                    .getBoundingClientRect();


            const usableHeight =
                rect.height
                -
                webResizer.offsetHeight;


            const minHeight = 100;


            let htmlHeight =
                event.clientY
                -
                rect.top;


            htmlHeight =
                Math.max(
                    minHeight,
                    htmlHeight
                );


            htmlHeight =
                Math.min(
                    usableHeight
                    -
                    minHeight,
                    htmlHeight
                );


            htmlBox.style.height =
                htmlHeight
                +
                "px";


            cssBox.style.height =
                (
                    usableHeight
                    -
                    htmlHeight
                )
                +
                "px";
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;


            document.body.style.userSelect =
                "";


            document.body.style.cursor =
                "";
        }
    );
}


/* =========================================================
   LEFT / RIGHT RESIZER
========================================================= */

function initMainResizer() {

    let dragging = false;


    mainResizer.addEventListener(
        "mousedown",
        event => {

            if (
                window.innerWidth
                <= 760
            ) {

                return;
            }


            dragging = true;


            document.body.style.userSelect =
                "none";


            document.body.style.cursor =
                "col-resize";


            event.preventDefault();
        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (
                !dragging
            ) {

                return;
            }


            const rect =
                workspace
                    .getBoundingClientRect();


            let leftWidth =
                event.clientX
                -
                rect.left;


            const minimum = 280;


            leftWidth =
                Math.max(
                    minimum,
                    leftWidth
                );


            leftWidth =
                Math.min(
                    rect.width
                    -
                    minimum,
                    leftWidth
                );


            editorPanel.style.width =
                leftWidth
                +
                "px";


            editorPanel.style.flex =
                "none";


            outputPanel.style.flex =
                "1";
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;


            document.body.style.userSelect =
                "";


            document.body.style.cursor =
                "";
        }
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

updateLineNumbers();

resetVisualizer();

changeLanguage(
    "python"
);

initWebResizer();

initMainResizer();

initializePython();