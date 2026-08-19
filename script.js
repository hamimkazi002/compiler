const editor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");

const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");

const outputConsole = document.getElementById("outputConsole");

const divider = document.getElementById("divider");
const editorSection = document.querySelector(".editor-section");
const workspace = document.querySelector(".workspace");


/* =====================================
   LINE NUMBERS
===================================== */

function updateLineNumbers() {

    const lines = editor.value.split("\n").length;

    lineNumbers.innerHTML = "";

    for (let i = 1; i <= lines; i++) {

        const line = document.createElement("span");

        line.textContent = i;

        lineNumbers.appendChild(line);
    }
}


editor.addEventListener("input", updateLineNumbers);


editor.addEventListener("scroll", () => {

    lineNumbers.scrollTop = editor.scrollTop;

});


updateLineNumbers();


/* =====================================
   TAB SUPPORT
===================================== */

editor.addEventListener("keydown", function (event) {

    if (event.key === "Tab") {

        event.preventDefault();

        const start = this.selectionStart;
        const end = this.selectionEnd;

        this.value =
            this.value.substring(0, start) +
            "    " +
            this.value.substring(end);

        this.selectionStart =
            this.selectionEnd =
                start + 4;

        updateLineNumbers();
    }


    /* CTRL + ENTER RUN */

    if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey)
    ) {

        event.preventDefault();

        runCode();
    }

});


/* =====================================
   DEMO PYTHON RUNNER
===================================== */

function runCode() {

    const code = editor.value;

    outputConsole.innerHTML =
        `<div class="running">Running code...</div>`;

    runBtn.classList.add("running-button");

    runBtn.innerHTML = "Running...";


    setTimeout(() => {

        try {

            let output = "";

            const lines = code.split("\n");


            lines.forEach(line => {

                const trimmed = line.trim();


                /*
                    Basic print("something")
                    support for UI demo
                */

                if (trimmed.startsWith("print(")) {

                    const match =
                        trimmed.match(
                            /^print\((["'`])(.*?)\1\)$/
                        );


                    if (match) {

                        output += match[2] + "\n";

                    } else {

                        output +=
                            "Demo mode only supports simple print statements.\n";
                    }

                }

            });


            if (!output) {

                output =
                    "No output.\n\n" +
                    "Try:\n" +
                    'print("Hello World")';
            }


            outputConsole.innerHTML = `

                <div class="output-text"></div>

                <div class="success-message">
                    === Code Execution Successful ===
                </div>

            `;


            outputConsole
                .querySelector(".output-text")
                .textContent = output.trim();


        }

        catch (error) {

            outputConsole.innerHTML = `

                <div class="error-message">
                    ${error.message}
                </div>

            `;

        }


        runBtn.classList.remove("running-button");

        runBtn.innerHTML =
            `<span class="play-icon">▶</span> Run`;


    }, 500);

}


runBtn.addEventListener("click", runCode);


/* =====================================
   CLEAR OUTPUT
===================================== */

clearBtn.addEventListener("click", () => {

    outputConsole.innerHTML = "";

});


/* =====================================
   DRAGGABLE DIVIDER
===================================== */

let isDragging = false;


divider.addEventListener("mousedown", () => {

    isDragging = true;

    document.body.style.cursor = "col-resize";

    document.body.style.userSelect = "none";

});


document.addEventListener("mousemove", event => {

    if (!isDragging) return;


    if (window.innerWidth <= 800) return;


    const workspaceRect =
        workspace.getBoundingClientRect();


    let newWidth =
        event.clientX -
        workspaceRect.left;


    const percentage =
        (newWidth / workspaceRect.width) * 100;


    if (
        percentage > 20 &&
        percentage < 80
    ) {

        editorSection.style.width =
            percentage + "%";

    }

});


document.addEventListener("mouseup", () => {

    isDragging = false;

    document.body.style.cursor = "";

    document.body.style.userSelect = "";

});
