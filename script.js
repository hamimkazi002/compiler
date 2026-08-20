/* =====================================
   ELEMENTS
===================================== */

const languageSelect =
    document.getElementById("languageSelect");

const languageLogo =
    document.getElementById("languageLogo");

const fileName =
    document.getElementById("fileName");

const editorTitle =
    document.getElementById("editorTitle");

const outputTitle =
    document.getElementById("outputTitle");

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

const previewFrame =
    document.getElementById("previewFrame");

const inputSection =
    document.getElementById("inputSection");

const programInput =
    document.getElementById("programInput");


/* =====================================
   LANGUAGE CONFIG
===================================== */

const languages = {

    python: {

        name: "Python",

        logo: "Py",

        file: "main.py",

        title: "Python Code",

        starter:
`print("Hello World")`

    },


    javascript: {

        name: "JavaScript",

        logo: "JS",

        file: "main.js",

        title: "JavaScript Code",

        starter:
`const a = 10;
const b = 20;

console.log("Result:", a + b);`

    },


    html: {

        name: "HTML",

        logo: "HTML",

        file: "index.html",

        title: "HTML Code",

        starter:
`<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>

<body>

    <h1>Hello World</h1>

    <p>
        This HTML is running inside the preview.
    </p>

    <button>
        Click Me
    </button>

</body>
</html>`

    },


    css: {

        name: "CSS",

        logo: "CSS",

        file: "style.css",

        title: "CSS Code",

        starter:
`body {
    background: #f5f5f5;
    font-family: Arial, sans-serif;
    padding: 40px;
}

.card {
    background: white;
    padding: 30px;
    border-radius: 12px;
}

h1 {
    color: #2563eb;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}`

    }

};


/* Store code while switching languages */

const savedCode = {

    python:
        languages.python.starter,

    javascript:
        languages.javascript.starter,

    html:
        languages.html.starter,

    css:
        languages.css.starter

};


let currentLanguage = "python";


/* =====================================
   PYTHON
===================================== */

let pyodide = null;

let pythonReady = false;

let pythonLoadError = false;


/* =====================================
   INITIALIZE PYTHON
===================================== */

async function initializePython() {

    try {

        if (
            typeof loadPyodide ===
            "undefined"
        ) {

            throw new Error(
                "Pyodide could not be loaded."
            );

        }


        /*
            IMPORTANT:

            We DO NOT manually set indexURL.

            This prevents version mismatch.
        */

        pyodide =
            await loadPyodide();


        pythonReady = true;

        pythonLoadError = false;


        if (
            currentLanguage ===
            "python"
        ) {

            outputConsole.textContent =
                "Python is ready.\n\nWrite code and click Run.";

        }


        updateRunButton();

    }

    catch (error) {

        pythonLoadError = true;

        pythonReady = false;


        if (
            currentLanguage ===
            "python"
        ) {

            outputConsole.textContent =
                "Failed to load Python.\n\n" +
                error.message;

        }


        updateRunButton();

    }

}


/* =====================================
   RUN BUTTON STATE
===================================== */

function updateRunButton() {

    if (
        currentLanguage ===
        "python"
    ) {

        if (pythonReady) {

            runBtn.disabled = false;

            runBtn.textContent =
                "▶ Run";

        }

        else if (pythonLoadError) {

            runBtn.disabled = true;

            runBtn.textContent =
                "Python Failed";

        }

        else {

            runBtn.disabled = true;

            runBtn.textContent =
                "Loading Python...";

        }

    }

    else {

        runBtn.disabled = false;

        runBtn.textContent =
            "▶ Run";

    }

}


/* =====================================
   LANGUAGE CHANGE
===================================== */

function changeLanguage(
    newLanguage
) {

    /*
        Save current code
    */

    savedCode[
        currentLanguage
    ] =
        codeEditor.value;


    currentLanguage =
        newLanguage;


    const config =
        languages[
            currentLanguage
        ];


    codeEditor.value =
        savedCode[
            currentLanguage
        ];


    languageLogo.textContent =
        config.logo;


    fileName.textContent =
        config.file;


    editorTitle.textContent =
        config.title;


    /*
        Python Input only
    */

    if (
        currentLanguage ===
        "python"
    ) {

        inputSection.classList.remove(
            "hidden"
        );

    }

    else {

        inputSection.classList.add(
            "hidden"
        );

    }


    /*
        Preview / Output
    */

    if (
        currentLanguage === "html" ||
        currentLanguage === "css"
    ) {

        outputTitle.textContent =
            "Preview";


        outputConsole.hidden =
            true;


        previewFrame.hidden =
            false;

    }

    else {

        outputTitle.textContent =
            "Output";


        previewFrame.hidden =
            true;


        outputConsole.hidden =
            false;

    }


    /*
        Initial messages
    */

    if (
        currentLanguage ===
        "python"
    ) {

        if (pythonReady) {

            outputConsole.textContent =
                "Python is ready.\n\nWrite code and click Run.";

        }

        else {

            outputConsole.textContent =
                "Loading Python...";

        }

    }


    if (
        currentLanguage ===
        "javascript"
    ) {

        outputConsole.textContent =
            "JavaScript ready.\n\nClick Run.";

    }


    updateLineNumbers();

    updateRunButton();

}


/* =====================================
   LANGUAGE SELECT EVENT
===================================== */

languageSelect.addEventListener(
    "change",
    () => {

        changeLanguage(
            languageSelect.value
        );

    }
);


/* =====================================
   LINE NUMBERS
===================================== */

function updateLineNumbers() {

    const total =
        codeEditor.value
            .split("\n")
            .length;


    lineNumbers.innerHTML =
        "";


    for (
        let i = 1;
        i <= total;
        i++
    ) {

        const line =
            document.createElement(
                "div"
            );


        line.textContent =
            i;


        lineNumbers.appendChild(
            line
        );

    }

}


updateLineNumbers();


codeEditor.addEventListener(
    "input",
    updateLineNumbers
);


/* =====================================
   SCROLL LINE NUMBERS
===================================== */

codeEditor.addEventListener(
    "scroll",
    () => {

        lineNumbers.scrollTop =
            codeEditor.scrollTop;

    }
);


/* =====================================
   TAB SUPPORT
===================================== */

codeEditor.addEventListener(
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


            updateLineNumbers();

        }


        /*
            CTRL + ENTER
        */

        if (
            event.key === "Enter"
            &&
            (
                event.ctrlKey ||
                event.metaKey
            )
        ) {

            event.preventDefault();

            runSelectedLanguage();

        }

    }
);


/* =====================================
   MAIN RUN
===================================== */

async function runSelectedLanguage() {

    savedCode[
        currentLanguage
    ] =
        codeEditor.value;


    switch (
        currentLanguage
    ) {

        case "python":

            await runPython();

            break;


        case "javascript":

            await runJavaScript();

            break;


        case "html":

            runHTML();

            break;


        case "css":

            runCSS();

            break;

    }

}


/* =====================================
   PYTHON RUNNER
===================================== */

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
        !pythonReady ||
        !pyodide
    ) {

        outputConsole.textContent =
            "Python is still loading...";

        return;

    }


    runBtn.disabled =
        true;


    runBtn.textContent =
        "Running...";


    outputConsole.textContent =
        "Running Python...";


    let stdout = "";

    let stderr = "";


    try {

        /*
            PRINT OUTPUT
        */

        pyodide.setStdout({

            batched: (text) => {

                stdout +=
                    text +
                    "\n";

            }

        });


        /*
            ERRORS
        */

        pyodide.setStderr({

            batched: (text) => {

                stderr +=
                    text +
                    "\n";

            }

        });


        /*
            input()
        */

        const rawInput =
            programInput.value
                .replace(
                    /\r/g,
                    ""
                );


        const inputLines =
            rawInput === ""
                ? []
                : rawInput.split(
                    "\n"
                );


        let inputIndex =
            0;


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


        /*
            Load packages included
            with Pyodide
        */

        try {

            await pyodide
                .loadPackagesFromImports(
                    code
                );

        }

        catch (
            packageError
        ) {

            console.warn(
                packageError
            );

        }


        /*
            RUN
        */

        const returnValue =
            await pyodide
                .runPythonAsync(
                    code
                );


        let result =
            "";


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


        /*
            Show expression result
            if nothing printed
        */

        if (
            !result
            &&
            returnValue !==
                undefined
            &&
            returnValue !==
                null
        ) {

            try {

                result =
                    String(
                        returnValue
                    );

            }

            catch {

                result =
                    "Python execution completed.";

            }

        }


        /*
            Destroy PyProxy
        */

        if (
            returnValue
            &&
            typeof returnValue.destroy ===
                "function"
        ) {

            returnValue.destroy();

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

        let result =
            "";


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
            error.message ||
            String(error);


        outputConsole.textContent =
            result;

    }

    finally {

        runBtn.disabled =
            false;


        runBtn.textContent =
            "▶ Run";

    }

}


/* =====================================
   JAVASCRIPT RUNNER DOCUMENT
===================================== */

const javascriptRunnerDocument =
`
<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
</head>

<body>

<script>

function formatValue(value) {

    if (
        typeof value ===
        "string"
    ) {

        return value;

    }

    try {

        return JSON.stringify(
            value,
            null,
            2
        );

    }

    catch {

        return String(value);

    }

}


function send(
    type,
    runId,
    content
) {

    parent.postMessage(
        {
            source:
                "compiler-js-runner",

            type:
                type,

            runId:
                runId,

            content:
                content
        },
        "*"
    );

}


window.addEventListener(
    "message",
    async (event) => {

        const data =
            event.data;


        if (
            !data ||
            data.type !==
                "execute-javascript"
        ) {

            return;

        }


        const runId =
            data.runId;


        const originalLog =
            console.log;


        const originalError =
            console.error;


        const originalWarn =
            console.warn;


        console.log =
            (...args) => {

                send(
                    "console",
                    runId,
                    args
                        .map(
                            formatValue
                        )
                        .join(" ")
                );

            };


        console.error =
            (...args) => {

                send(
                    "error",
                    runId,
                    args
                        .map(
                            formatValue
                        )
                        .join(" ")
                );

            };


        console.warn =
            (...args) => {

                send(
                    "warn",
                    runId,
                    args
                        .map(
                            formatValue
                        )
                        .join(" ")
                );

            };


        try {

            const AsyncFunction =
                Object.getPrototypeOf(
                    async function(){}
                ).constructor;


            const fn =
                new AsyncFunction(
                    data.code
                );


            const value =
                await fn();


            if (
                value !==
                undefined
            ) {

                send(
                    "return",
                    runId,
                    formatValue(
                        value
                    )
                );

            }


            send(
                "done",
                runId,
                true
            );

        }

        catch (error) {

            send(
                "runtime-error",
                runId,
                error.stack ||
                error.message ||
                String(error)
            );


            send(
                "done",
                runId,
                false
            );

        }

        finally {

            console.log =
                originalLog;

            console.error =
                originalError;

            console.warn =
                originalWarn;

        }

    }
);

<\/script>

</body>

</html>
`;


/* =====================================
   JAVASCRIPT RUNNER
===================================== */

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


    runBtn.disabled =
        true;


    runBtn.textContent =
        "Running...";


    outputConsole.textContent =
        "Running JavaScript...";


    const runId =
        Date.now().toString()
        +
        Math.random()
            .toString(36);


    const outputLines =
        [];


    await new Promise(
        (resolve) => {

            let finished =
                false;


            const timeout =
                setTimeout(
                    () => {

                        if (
                            finished
                        ) {

                            return;

                        }


                        finished =
                            true;


                        window.removeEventListener(
                            "message",
                            messageHandler
                        );


                        outputLines.push(
                            "Execution timeout."
                        );


                        outputConsole.textContent =
                            outputLines.join(
                                "\n"
                            );


                        resolve();

                    },
                    10000
                );


            function messageHandler(
                event
            ) {

                if (
                    event.source !==
                    previewFrame.contentWindow
                ) {

                    return;

                }


                const data =
                    event.data;


                if (
                    !data
                    ||
                    data.source !==
                        "compiler-js-runner"
                    ||
                    data.runId !==
                        runId
                ) {

                    return;

                }


                if (
                    data.type ===
                    "console"
                ) {

                    outputLines.push(
                        data.content
                    );

                }


                if (
                    data.type ===
                    "warn"
                ) {

                    outputLines.push(
                        "Warning: " +
                        data.content
                    );

                }


                if (
                    data.type ===
                    "error"
                ) {

                    outputLines.push(
                        "Error: " +
                        data.content
                    );

                }


                if (
                    data.type ===
                    "return"
                ) {

                    outputLines.push(
                        data.content
                    );

                }


                if (
                    data.type ===
                    "runtime-error"
                ) {

                    outputLines.push(
                        data.content
                    );

                }


                if (
                    data.type !==
                    "done"
                ) {

                    outputConsole.textContent =
                        outputLines.join(
                            "\n"
                        );

                }


                if (
                    data.type ===
                    "done"
                ) {

                    finished =
                        true;


                    clearTimeout(
                        timeout
                    );


                    window.removeEventListener(
                        "message",
                        messageHandler
                    );


                    if (
                        outputLines.length ===
                        0
                    ) {

                        outputLines.push(
                            "Program finished with no output."
                        );

                    }


                    if (
                        data.content ===
                        true
                    ) {

                        outputLines.push(
                            "",
                            "=== Code Execution Successful ==="
                        );

                    }


                    outputConsole.textContent =
                        outputLines.join(
                            "\n"
                        );


                    resolve();

                }

            }


            window.addEventListener(
                "message",
                messageHandler
            );


            /*
                Load isolated runner
            */

            previewFrame.onload =
                () => {

                    previewFrame
                        .contentWindow
                        .postMessage(
                            {

                                type:
                                    "execute-javascript",

                                runId:
                                    runId,

                                code:
                                    code

                            },
                            "*"
                        );

                };


            previewFrame.srcdoc =
                javascriptRunnerDocument;

        }
    );


    runBtn.disabled =
        false;


    runBtn.textContent =
        "▶ Run";

}


/* =====================================
   HTML PREVIEW
===================================== */

function runHTML() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        previewFrame.srcdoc =
            "<p>Please write HTML code.</p>";

        return;

    }


    previewFrame.srcdoc =
        code;

}


/* =====================================
   CSS PREVIEW
===================================== */

function runCSS() {

    const css =
        codeEditor.value;


    /*
        CSS needs HTML to be visible.

        This demo HTML gives CSS
        elements to style.
    */

    const previewHTML =
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

<div class="card">

    <h1>
        CSS Preview
    </h1>


    <p>
        Your CSS is applied to this preview.
    </p>


    <p>
        Try styling body, .card, h1,
        p, button, input and links.
    </p>


    <input
        type="text"
        placeholder="Input field"
    >


    <br><br>


    <button>
        Sample Button
    </button>


    <br><br>


    <a href="#">
        Sample Link
    </a>

</div>

</body>

</html>
`;


    previewFrame.srcdoc =
        previewHTML;

}


/* =====================================
   RUN BUTTON
===================================== */

runBtn.addEventListener(
    "click",
    runSelectedLanguage
);


/* =====================================
   CLEAR
===================================== */

clearBtn.addEventListener(
    "click",
    () => {

        if (
            currentLanguage ===
                "html"
            ||
            currentLanguage ===
                "css"
        ) {

            previewFrame.srcdoc =
                "";

        }

        else {

            outputConsole.textContent =
                "";

        }

    }
);


/* =====================================
   INITIAL SETUP
===================================== */

changeLanguage(
    "python"
);


initializePython();