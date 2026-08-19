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
                this.value.substring(0, start)
                +
                "    "
                +
                this.value.substring(end);


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


    runBtn.disabled = true;

    runBtn.textContent =
        "Running...";


    outputConsole.textContent =
        "Running Python code...";


    try {

        const response =
            await fetch(
                "/run",
                {

                    method: "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify({

                            code: code,

                            input: input

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned error "
                +
                response.status
            );

        }


        const data =
            await response.json();


        let result = "";


        if (data.output) {

            result +=
                data.output;

        }


        if (data.error) {

            if (result) {

                result += "\n";

            }


            result +=
                data.error;

        }


        if (data.success) {

            if (result) {

                result += "\n";

            }


            result +=
                "=== Code Execution Successful ===";

        }


        if (
            data.success
            &&
            !data.output
        ) {

            result =
                "Program finished with no output.\n\n"
                +
                "=== Code Execution Successful ===";

        }


        outputConsole.textContent =
            result;

    }


    catch (error) {

        outputConsole.textContent =

            "Cannot connect to Python server.\n\n"
            +
            "Make sure app.py is running.\n\n"
            +
            error.message;

    }


    finally {

        runBtn.disabled = false;

        runBtn.textContent =
            "▶ Run";

    }

}



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

        outputConsole.textContent =
            "";

    }
);