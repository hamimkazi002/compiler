/* ==================================
   ELEMENTS
================================== */

const codeEditor =
    document.getElementById("codeEditor");

const lineNumbers =
    document.getElementById("lineNumbers");

const runBtn =
    document.getElementById("runBtn");

const clearBtn =
    document.getElementById("clearBtn");

const outputConsole =
    document.getElementById("outputConsole");

const programInput =
    document.getElementById("programInput");


/* ==================================
   PYODIDE CONFIG
================================== */

const PYODIDE_URL =
    "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/";

let pyodide = null;

let pythonReady = false;


/* ==================================
   LOAD PYTHON
================================== */

async function initializePython() {

    runBtn.disabled = true;

    runBtn.textContent =
        "Loading Python...";

    outputConsole.textContent =
        "Loading Python...\n\nPlease wait.";


    try {

        if (typeof loadPyodide === "undefined") {

            throw new Error(
                "Pyodide library could not be loaded."
            );

        }


        pyodide = await loadPyodide({

            indexURL: PYODIDE_URL

        });


        pythonReady = true;


        outputConsole.textContent =
            "Python is ready.\n\nWrite Python code and click Run.";


        runBtn.disabled = false;

        runBtn.textContent =
            "▶ Run";

    }

    catch (error) {

        pythonReady = false;


        outputConsole.textContent =
            "Failed to load Python.\n\n" +
            error.message;


        runBtn.disabled = true;

        runBtn.textContent =
            "Python Failed";

    }

}


/* ==================================
   LINE NUMBERS
================================== */

function updateLineNumbers() {

    const totalLines =
        codeEditor.value.split("\n").length;


    lineNumbers.innerHTML = "";


    for (
        let i = 1;
        i <= totalLines;
        i++
    ) {

        const line =
            document.createElement("div");


        line.textContent = i;


        lineNumbers.appendChild(line);

    }

}


updateLineNumbers();


codeEditor.addEventListener(
    "input",
    updateLineNumbers
);


/* ==================================
   EDITOR SCROLL
================================== */

codeEditor.addEventListener(
    "scroll",
    () => {

        lineNumbers.scrollTop =
            codeEditor.scrollTop;

    }
);


/* ==================================
   TAB SUPPORT
================================== */

codeEditor.addEventListener(
    "keydown",
    function (event) {

        /* TAB */

        if (event.key === "Tab") {

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


            updateLineNumbers();

        }


        /* CTRL + ENTER = RUN */

        if (
            event.key === "Enter"
            &&
            (
                event.ctrlKey ||
                event.metaKey
            )
        ) {

            event.preventDefault();

            runPython();

        }

    }
);


/* ==================================
   RUN PYTHON
================================== */

async function runPython() {

    const code =
        codeEditor.value;

    const input =
        programInput.value;


    /* EMPTY CODE */

    if (!code.trim()) {

        outputConsole.textContent =
            "Please write Python code first.";

        return;

    }


    /* PYTHON NOT READY */

    if (
        !pythonReady ||
        !pyodide
    ) {

        outputConsole.textContent =
            "Python is still loading.\n\nPlease wait.";

        return;

    }


    runBtn.disabled = true;

    runBtn.textContent =
        "Running...";


    outputConsole.textContent =
        "Running Python code...";


    let stdout = "";

    let stderr = "";


    try {

        /* ==================================
           CAPTURE PRINT OUTPUT
        ================================== */

        pyodide.setStdout({

            batched: (text) => {

                stdout += text + "\n";

            }

        });


        /* ==================================
           CAPTURE ERRORS
        ================================== */

        pyodide.setStderr({

            batched: (text) => {

                stderr += text + "\n";

            }

        });


        /* ==================================
           PROGRAM INPUT
        ================================== */

        const inputLines =
            input
                .replace(/\r/g, "")
                .split("\n");


        let inputIndex = 0;


        pyodide.setStdin({

            stdin: () => {

                if (
                    inputIndex <
                    inputLines.length
                ) {

                    const value =
                        inputLines[
                            inputIndex
                        ];


                    inputIndex++;


                    return value;

                }


                return null;

            }

        });


        /* ==================================
           LOAD SUPPORTED PACKAGES
        ================================== */

        try {

            await pyodide
                .loadPackagesFromImports(
                    code
                );

        }

        catch (packageError) {

            console.warn(
                "Package load warning:",
                packageError
            );

        }


        /* ==================================
           EXECUTE PYTHON
        ================================== */

        await pyodide.runPythonAsync(
            code
        );


        /* ==================================
           BUILD OUTPUT
        ================================== */

        let result = "";


        if (stdout.trim()) {

            result +=
                stdout.trimEnd();

        }


        if (stderr.trim()) {

            if (result) {

                result += "\n\n";

            }


            result +=
                stderr.trimEnd();

        }


        if (!result) {

            result =
                "Program finished with no output.";

        }


        result +=
            "\n\n=== Code Execution Successful ===";


        outputConsole.textContent =
            result;

    }

    catch (error) {

        let result = "";


        if (stdout.trim()) {

            result +=
                stdout.trimEnd();

        }


        if (stderr.trim()) {

            if (result) {

                result += "\n\n";

            }


            result +=
                stderr.trimEnd();

        }


        if (result) {

            result += "\n\n";

        }


        result +=
            error.message ||
            String(error);


        outputConsole.textContent =
            result;

    }

    finally {

        runBtn.disabled = false;

        runBtn.textContent =
            "▶ Run";

    }

}


/* ==================================
   RUN BUTTON
================================== */

runBtn.addEventListener(
    "click",
    runPython
);


/* ==================================
   CLEAR OUTPUT
================================== */

clearBtn.addEventListener(
    "click",
    () => {

        outputConsole.textContent = "";

    }
);


/* ==================================
   START PYTHON
================================== */

initializePython();