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
   PYODIDE
================================== */

const PYODIDE_URL =
    "https://cdn.jsdelivr.net/pyodide/v314.0.5/full/";

let pyodide = null;


/* ==================================
   LOAD PYTHON
================================== */

async function initializePython() {

    runBtn.disabled = true;

    outputConsole.textContent =
        "Loading Python... Please wait.";


    try {

        pyodide = await loadPyodide({
            indexURL: PYODIDE_URL
        });


        outputConsole.textContent =
            "Python is ready.\n\nWrite code and click Run.";

        runBtn.disabled = false;

    }

    catch (error) {

        outputConsole.textContent =
            "Failed to load Python.\n\n" +
            error.message;

    }
}


initializePython();


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


        /* CTRL + ENTER */

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


    if (!code.trim()) {

        outputConsole.textContent =
            "Please write Python code first.";

        return;

    }


    if (!pyodide) {

        outputConsole.textContent =
            "Python is still loading. Please wait...";

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

        /* ==========================
           STDOUT
        ========================== */

        pyodide.setStdout({

            batched: (text) => {

                stdout += text;

            }

        });


        /* ==========================
           STDERR
        ========================== */

        pyodide.setStderr({

            batched: (text) => {

                stderr += text;

            }

        });


        /* ==========================
           INPUT()
        ========================== */

        const inputLines =
            input === ""
                ? []
                : input
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


        /* ==========================
           AUTO LOAD PACKAGES
        ========================== */

        try {

            await pyodide
                .loadPackagesFromImports(
                    code
                );

        }

        catch (packageError) {

            console.log(
                "Package loading:",
                packageError
            );

        }


        /* ==========================
           EXECUTE PYTHON
        ========================== */

        await pyodide.runPythonAsync(
            code
        );


        let result = "";


        if (stdout) {

            result += stdout;

        }


        if (stderr) {

            if (result) {
                result += "\n";
            }

            result += stderr;

        }


        if (!result.trim()) {

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


        if (stdout) {

            result += stdout;

        }


        if (stderr) {

            if (result) {
                result += "\n";
            }

            result += stderr;

        }


        if (result) {

            result += "\n";

        }


        result +=
            error.message;


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
   CLEAR
================================== */

clearBtn.addEventListener(
    "click",
    () => {

        outputConsole.textContent =
            "";

    }
);