/* =========================================
   ELEMENTS
========================================= */

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


/* =========================================
   STARTER CODE
========================================= */

const pythonStarter =
`print("Hello World")

name = "Hamim"

print("Welcome,", name)`;


const javascriptStarter =
`const name = "Hamim";

const numbers = [10, 20, 30];

const total = numbers.reduce(
    (sum, number) => sum + number,
    0
);

console.log("Hello", name);
console.log("Total:", total);`;


let savedPython =
    pythonStarter;


let savedJavaScript =
    javascriptStarter;


let currentLanguage =
    "python";


/* =========================================
   THEME
========================================= */

function setTheme(theme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    if (theme === "dark") {

        themeBtn.textContent =
            "☀";

        themeBtn.title =
            "Switch to light theme";

    }

    else {

        themeBtn.textContent =
            "☾";

        themeBtn.title =
            "Switch to dark theme";

    }


    localStorage.setItem(
        "compiler-theme",
        theme
    );

}


const storedTheme =
    localStorage.getItem(
        "compiler-theme"
    );


setTheme(
    storedTheme || "dark"
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


/* =========================================
   PYTHON ENGINE
========================================= */

let pyodide =
    null;


let pythonReady =
    false;


let pythonFailed =
    false;


/* =========================================
   STATUS
========================================= */

function setStatus(
    text,
    ready = false
) {

    statusText.textContent =
        text;


    if (ready) {

        engineStatus
            .classList
            .add(
                "ready"
            );

    }

    else {

        engineStatus
            .classList
            .remove(
                "ready"
            );

    }

}


/* =========================================
   LOAD PYTHON
========================================= */

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
                "Pyodide library could not be loaded."
            );

        }


        pyodide =
            await loadPyodide();


        pythonReady =
            true;


        pythonFailed =
            false;


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

    }

    catch (error) {

        pythonReady =
            false;


        pythonFailed =
            true;


        setStatus(
            "Python Failed"
        );


        if (
            currentLanguage ===
            "python"
        ) {

            outputConsole.textContent =
                "Failed to load Python.\n\n"
                +
                error.message;

        }


        updateRunButton();

    }

}


/* =========================================
   RUN BUTTON STATE
========================================= */

function updateRunButton() {

    if (
        currentLanguage ===
        "python"
    ) {

        if (
            pythonReady
        ) {

            runBtn.disabled =
                false;


            runText.textContent =
                "Run";

        }

        else if (
            pythonFailed
        ) {

            runBtn.disabled =
                true;


            runText.textContent =
                "Failed";

        }

        else {

            runBtn.disabled =
                true;


            runText.textContent =
                "Loading";

        }

    }

    else {

        runBtn.disabled =
            false;


        runText.textContent =
            "Run";

    }

}


/* =========================================
   LANGUAGE CHANGE
========================================= */

function changeLanguage(
    language
) {

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


    /* =====================================
       PYTHON
    ===================================== */

    if (
        language ===
        "python"
    ) {

        normalEditor
            .classList
            .remove(
                "hidden"
            );


        webEditors
            .classList
            .add(
                "hidden"
            );


        inputSection
            .classList
            .remove(
                "hidden"
            );


        outputConsole.hidden =
            false;


        previewFrame.hidden =
            true;


        languageLogo.textContent =
            "Py";


        fileName.textContent =
            "main.py";


        editorTitle.textContent =
            "Python Code";


        outputTitle.textContent =
            "Output";


        outputType.textContent =
            "Console";


        codeEditor.value =
            savedPython;


        if (
            pythonReady
        ) {

            outputConsole.textContent =
                "Python is ready.\n\nWrite code and click Run.";

        }

        else if (
            pythonFailed
        ) {

            outputConsole.textContent =
                "Python engine failed to load.";

        }

        else {

            outputConsole.textContent =
                "Loading Python engine...";

        }

    }


    /* =====================================
       JAVASCRIPT
    ===================================== */

    if (
        language ===
        "javascript"
    ) {

        normalEditor
            .classList
            .remove(
                "hidden"
            );


        webEditors
            .classList
            .add(
                "hidden"
            );


        inputSection
            .classList
            .add(
                "hidden"
            );


        outputConsole.hidden =
            false;


        previewFrame.hidden =
            true;


        languageLogo.textContent =
            "JS";


        fileName.textContent =
            "main.js";


        editorTitle.textContent =
            "JavaScript Code";


        outputTitle.textContent =
            "Output";


        outputType.textContent =
            "Console";


        codeEditor.value =
            savedJavaScript;


        outputConsole.textContent =
            "JavaScript is ready.\n\nWrite code and click Run.";

    }


    /* =====================================
       HTML + CSS
    ===================================== */

    if (
        language ===
        "web"
    ) {

        normalEditor
            .classList
            .add(
                "hidden"
            );


        webEditors
            .classList
            .remove(
                "hidden"
            );


        inputSection
            .classList
            .add(
                "hidden"
            );


        outputConsole.hidden =
            true;


        previewFrame.hidden =
            false;


        languageLogo.textContent =
            "Web";


        fileName.textContent =
            "index.html + style.css";


        outputTitle.textContent =
            "Live Preview";


        outputType.textContent =
            "Browser";


        runWeb();

    }


    updateLineNumbers();


    updateRunButton();

}


/* =========================================
   LANGUAGE EVENT
========================================= */

languageSelect.addEventListener(
    "change",
    () => {

        changeLanguage(
            languageSelect.value
        );

    }
);


/* =========================================
   LINE NUMBERS
========================================= */

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


        lineNumbers
            .appendChild(
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


/* =========================================
   TAB SUPPORT
========================================= */

function addTabSupport(
    editor
) {

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
                event.key ===
                    "Enter"
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


/* =========================================
   RUN SELECTED
========================================= */

async function runSelected() {

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


/* =========================================
   PYTHON RUNNER
========================================= */

async function runPython() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        outputConsole.textContent =
            "Please write Python code first.";

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


    runBtn.disabled =
        true;


    runText.textContent =
        "Running";


    outputConsole.textContent =
        "Running Python...";


    let stdout =
        "";


    let stderr =
        "";


    try {

        pyodide.setStdout({

            batched:
                (text) => {

                    stdout +=
                        text
                        +
                        "\n";

                }

        });


        pyodide.setStderr({

            batched:
                (text) => {

                    stderr +=
                        text
                        +
                        "\n";

                }

        });


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

            stdin:
                () => {

                    if (
                        inputIndex
                        <
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

        }

        catch (
            packageError
        ) {

            console.warn(
                packageError
            );

        }


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

            if (
                result
            ) {

                result +=
                    "\n\n";

            }


            result +=
                stderr.trimEnd();

        }


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
                    "Execution completed.";

            }

        }


        if (
            returnValue
            &&
            typeof returnValue.destroy
            === "function"
        ) {

            returnValue.destroy();

        }


        if (
            !result
        ) {

            result =
                "Program finished with no output.";

        }


        result +=
            "\n\n✓ Code Execution Successful";


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

            if (
                result
            ) {

                result +=
                    "\n\n";

            }


            result +=
                stderr.trimEnd();

        }


        if (
            result
        ) {

            result +=
                "\n\n";

        }


        result +=
            error.message
            ||
            String(error);


        outputConsole.textContent =
            result;

    }

    finally {

        runBtn.disabled =
            false;


        runText.textContent =
            "Run";

    }

}


/* =========================================
   JAVASCRIPT RUNNER
========================================= */

async function runJavaScript() {

    const code =
        codeEditor.value;


    if (
        !code.trim()
    ) {

        outputConsole.textContent =
            "Please write JavaScript code first.";

        return;

    }


    runBtn.disabled =
        true;


    runText.textContent =
        "Running";


    outputConsole.textContent =
        "Running JavaScript...";


    const runId =
        Date.now().toString()
        +
        Math.random()
            .toString(36);


    const safeCode =
        JSON.stringify(
            code
        )
        .replace(
            /</g,
            "\\u003c"
        );


    const safeRunId =
        JSON.stringify(
            runId
        );


    const runnerDocument =
`
<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
</head>

<body>

<script>

const runId =
    ${safeRunId};

const userCode =
    ${safeCode};

const logs = [];


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


        const execute =
            new AsyncFunction(
                userCode
            );


        const returnValue =
            await execute();


        if (
            returnValue !==
            undefined
        ) {

            logs.push(
                formatValue(
                    returnValue
                )
            );

        }


        parent.postMessage(
            {

                source:
                    "hamim-compiler",

                type:
                    "javascript-result",

                runId:
                    runId,

                success:
                    true,

                output:
                    logs.join("\\n")

            },
            "*"
        );

    }

    catch (error) {

        parent.postMessage(
            {

                source:
                    "hamim-compiler",

                type:
                    "javascript-result",

                runId:
                    runId,

                success:
                    false,

                output:
                    logs.join("\\n"),

                error:
                    error.stack
                    ||
                    error.message
                    ||
                    String(error)

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


                        window
                            .removeEventListener(
                                "message",
                                handler
                            );


                        outputConsole.textContent =
                            "JavaScript execution timed out.";


                        resolve();

                    },
                    10000
                );


            function handler(
                event
            ) {

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
                        "javascript-result"
                    ||
                    data.runId !==
                        runId
                ) {

                    return;

                }


                finished =
                    true;


                clearTimeout(
                    timeout
                );


                window
                    .removeEventListener(
                        "message",
                        handler
                    );


                let result =
                    data.output
                    ||
                    "";


                if (
                    data.error
                ) {

                    if (
                        result
                    ) {

                        result +=
                            "\n\n";

                    }


                    result +=
                        data.error;

                }


                if (
                    data.success
                ) {

                    if (
                        !result
                    ) {

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


            window
                .addEventListener(
                    "message",
                    handler
                );


            jsRunnerFrame.srcdoc =
                runnerDocument;

        }
    );


    runBtn.disabled =
        false;


    runText.textContent =
        "Run";

}


/* =========================================
   HTML + CSS PREVIEW
========================================= */

function runWeb() {

    const html =
        htmlEditor.value;


    const css =
        cssEditor.value;


    const documentCode =
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


    previewFrame.srcdoc =
        documentCode;

}


/* =========================================
   RUN BUTTON
========================================= */

runBtn.addEventListener(
    "click",
    runSelected
);


/* =========================================
   CLEAR BUTTON
========================================= */

clearBtn.addEventListener(
    "click",
    () => {

        if (
            currentLanguage ===
            "web"
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


/* =========================================
   HTML / CSS RESIZER
========================================= */

function initWebResizer() {

    if (
        !webResizer
        ||
        !htmlBox
        ||
        !cssBox
        ||
        !webEditors
    ) {

        return;

    }


    let dragging =
        false;


    const minimumHeight =
        100;


    webResizer.addEventListener(
        "mousedown",
        (event) => {

            dragging =
                true;


            document.body.style
                .userSelect =
                "none";


            document.body.style
                .cursor =
                "row-resize";


            event.preventDefault();

        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            if (
                !dragging
            ) {

                return;

            }


            const rect =
                webEditors
                    .getBoundingClientRect();


            const resizerHeight =
                webResizer
                    .offsetHeight;


            const usableHeight =
                rect.height
                -
                resizerHeight;


            let htmlHeight =
                event.clientY
                -
                rect.top;


            htmlHeight =
                Math.max(
                    minimumHeight,
                    htmlHeight
                );


            htmlHeight =
                Math.min(
                    usableHeight
                    -
                    minimumHeight,
                    htmlHeight
                );


            const cssHeight =
                usableHeight
                -
                htmlHeight;


            htmlBox.style.height =
                htmlHeight
                +
                "px";


            cssBox.style.height =
                cssHeight
                +
                "px";

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (
                !dragging
            ) {

                return;

            }


            dragging =
                false;


            document.body.style
                .userSelect =
                "";


            document.body.style
                .cursor =
                "";

        }
    );

}


/* =========================================
   LEFT / RIGHT RESIZER
========================================= */

function initMainResizer() {

    if (
        !mainResizer
        ||
        !workspace
        ||
        !editorPanel
        ||
        !outputPanel
    ) {

        return;

    }


    let dragging =
        false;


    mainResizer.addEventListener(
        "mousedown",
        (event) => {

            if (
                window.innerWidth
                <=
                760
            ) {

                return;

            }


            dragging =
                true;


            document.body.style
                .userSelect =
                "none";


            document.body.style
                .cursor =
                "col-resize";


            event.preventDefault();

        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            if (
                !dragging
            ) {

                return;

            }


            const rect =
                workspace
                    .getBoundingClientRect();


            const total =
                rect.width;


            let leftWidth =
                event.clientX
                -
                rect.left;


            const minimum =
                280;


            leftWidth =
                Math.max(
                    minimum,
                    leftWidth
                );


            leftWidth =
                Math.min(
                    total
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

            if (
                !dragging
            ) {

                return;

            }


            dragging =
                false;


            document.body.style
                .userSelect =
                "";


            document.body.style
                .cursor =
                "";

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

updateLineNumbers();


changeLanguage(
    "python"
);


initWebResizer();


initMainResizer();


initializePython();