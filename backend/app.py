from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from pathlib import Path

import ast
import builtins
import dis
import io
import token
import tokenize


# =========================================================
# APP SETUP
# =========================================================

app = Flask(__name__)

CORS(app)


# Project root:
# compiler/
# ├── index.html
# ├── style.css
# ├── script.js
# └── backend/
#     └── app.py

PROJECT_ROOT = Path(__file__).resolve().parent.parent


# =========================================================
# FRONTEND ROUTES
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return send_from_directory(
        PROJECT_ROOT,
        "index.html"
    )


@app.route("/style.css", methods=["GET"])
def serve_css():

    return send_from_directory(
        PROJECT_ROOT,
        "style.css"
    )


@app.route("/script.js", methods=["GET"])
def serve_js():

    return send_from_directory(
        PROJECT_ROOT,
        "script.js"
    )


# =========================================================
# BACKEND STATUS
# =========================================================

@app.route("/api/status", methods=["GET"])
def api_status():

    return jsonify({
        "status": "success",
        "message": "Hamim Compiler Backend is running"
    })


# =========================================================
# VALUE TYPE HELPER
# =========================================================

def get_value_type(node):

    if isinstance(node, ast.Constant):

        return (
            type(node.value).__name__,
            node.value
        )


    if isinstance(node, ast.List):

        return (
            "list",
            "computed at runtime"
        )


    if isinstance(node, ast.Dict):

        return (
            "dict",
            "computed at runtime"
        )


    if isinstance(node, ast.Tuple):

        return (
            "tuple",
            "computed at runtime"
        )


    if isinstance(node, ast.Set):

        return (
            "set",
            "computed at runtime"
        )


    if isinstance(node, ast.BinOp):

        return (
            "expression",
            "computed at runtime"
        )


    if isinstance(node, ast.Call):

        return (
            "function_result",
            "computed at runtime"
        )


    return (
        "unknown",
        "computed at runtime"
    )


# =========================================================
# 1. LEXICAL ANALYSIS
# =========================================================

def lexical_analysis(code):

    tokens = []

    reader = io.StringIO(
        code
    ).readline


    for tok in tokenize.generate_tokens(
        reader
    ):

        token_name = token.tok_name.get(
            tok.type,
            str(tok.type)
        )


        if token_name in [
            "ENCODING",
            "ENDMARKER",
            "NL"
        ]:

            continue


        value = tok.string


        if value == "\n":

            value = "\\n"


        tokens.append({

            "type":
                token_name,

            "value":
                value,

            "line":
                tok.start[0],

            "column":
                tok.start[1]

        })


    return tokens


# =========================================================
# 2. SEMANTIC ANALYSIS + SYMBOL TABLE
# =========================================================

def semantic_analysis(tree):

    defined_variables = set()

    used_variables = set()

    undefined_variables = set()

    symbol_table = {}

    messages = []

    builtin_names = set(
        dir(builtins)
    )


    class SemanticAnalyzer(ast.NodeVisitor):


        # -------------------------------------------------
        # VARIABLE USE
        # -------------------------------------------------

        def visit_Name(
            self,
            node
        ):

            if isinstance(
                node.ctx,
                ast.Load
            ):

                used_variables.add(
                    node.id
                )


                if (
                    node.id not in defined_variables
                    and
                    node.id not in builtin_names
                ):

                    undefined_variables.add(
                        node.id
                    )


        # -------------------------------------------------
        # NORMAL ASSIGNMENT
        # -------------------------------------------------

        def visit_Assign(
            self,
            node
        ):

            # Analyse right side first
            self.visit(
                node.value
            )


            value_type, value = get_value_type(
                node.value
            )


            for target in node.targets:

                if isinstance(
                    target,
                    ast.Name
                ):

                    name = target.id


                    defined_variables.add(
                        name
                    )


                    symbol_table[name] = {

                        "name":
                            name,

                        "type":
                            value_type,

                        "value":
                            value,

                        "scope":
                            "global"

                    }


                    messages.append(
                        f"{name} -> defined as {value_type}"
                    )


        # -------------------------------------------------
        # ANNOTATED ASSIGNMENT
        # -------------------------------------------------

        def visit_AnnAssign(
            self,
            node
        ):

            if node.value:

                self.visit(
                    node.value
                )


            if isinstance(
                node.target,
                ast.Name
            ):

                name = node.target.id


                defined_variables.add(
                    name
                )


                try:

                    annotation = ast.unparse(
                        node.annotation
                    )

                except Exception:

                    annotation = "unknown"


                symbol_table[name] = {

                    "name":
                        name,

                    "type":
                        annotation,

                    "value":
                        "computed at runtime",

                    "scope":
                        "global"

                }


        # -------------------------------------------------
        # FUNCTION
        # -------------------------------------------------

        def visit_FunctionDef(
            self,
            node
        ):

            defined_variables.add(
                node.name
            )


            symbol_table[node.name] = {

                "name":
                    node.name,

                "type":
                    "function",

                "value":
                    "function definition",

                "scope":
                    "global"

            }


            old_defined = set(
                defined_variables
            )


            for argument in node.args.args:

                defined_variables.add(
                    argument.arg
                )


            for statement in node.body:

                self.visit(
                    statement
                )


            defined_variables.clear()

            defined_variables.update(
                old_defined
            )


        # -------------------------------------------------
        # FOR LOOP
        # -------------------------------------------------

        def visit_For(
            self,
            node
        ):

            self.visit(
                node.iter
            )


            if isinstance(
                node.target,
                ast.Name
            ):

                name = node.target.id


                defined_variables.add(
                    name
                )


                symbol_table[name] = {

                    "name":
                        name,

                    "type":
                        "loop_variable",

                    "value":
                        "computed at runtime",

                    "scope":
                        "global"

                }


            for statement in node.body:

                self.visit(
                    statement
                )


            for statement in node.orelse:

                self.visit(
                    statement
                )


    analyzer = SemanticAnalyzer()

    analyzer.visit(
        tree
    )


    undefined_list = sorted(
        undefined_variables
    )


    if undefined_list:

        for name in undefined_list:

            messages.append(
                f"WARNING: {name} may be undefined before use"
            )


        valid = False

    else:

        messages.append(
            "Basic semantic checks passed"
        )


        valid = True


    semantic_result = {

        "valid":
            valid,

        "defined_variables":
            sorted(
                defined_variables
            ),

        "used_variables":
            sorted(
                used_variables
            ),

        "undefined_variables":
            undefined_list,

        "messages":
            messages

    }


    return (
        semantic_result,
        list(
            symbol_table.values()
        )
    )


# =========================================================
# 3. INTERMEDIATE CODE GENERATOR
# =========================================================

class IRGenerator:

    def __init__(self):

        self.instructions = []

        self.temp_counter = 0

        self.label_counter = 0


    # -----------------------------------------------------
    # TEMP VARIABLE
    # -----------------------------------------------------

    def new_temp(self):

        self.temp_counter += 1

        return f"t{self.temp_counter}"


    # -----------------------------------------------------
    # LABEL
    # -----------------------------------------------------

    def new_label(self):

        self.label_counter += 1

        return f"L{self.label_counter}"


    # -----------------------------------------------------
    # OPERATOR
    # -----------------------------------------------------

    def operator_name(
        self,
        operator
    ):

        operators = {

            ast.Add:
                "+",

            ast.Sub:
                "-",

            ast.Mult:
                "*",

            ast.Div:
                "/",

            ast.FloorDiv:
                "//",

            ast.Mod:
                "%",

            ast.Pow:
                "**",

            ast.Eq:
                "==",

            ast.NotEq:
                "!=",

            ast.Lt:
                "<",

            ast.LtE:
                "<=",

            ast.Gt:
                ">",

            ast.GtE:
                ">=",

            ast.And:
                "AND",

            ast.Or:
                "OR"

        }


        return operators.get(
            type(operator),
            type(operator).__name__
        )


    # =====================================================
    # EXPRESSION
    # =====================================================

    def expression(
        self,
        node
    ):

        # -------------------------------------------------
        # CONSTANT
        # -------------------------------------------------

        if isinstance(
            node,
            ast.Constant
        ):

            temp = self.new_temp()


            self.instructions.append(
                f"{temp} = {repr(node.value)}"
            )


            return temp


        # -------------------------------------------------
        # VARIABLE
        # -------------------------------------------------

        if isinstance(
            node,
            ast.Name
        ):

            return node.id


        # -------------------------------------------------
        # BINARY OPERATION
        # -------------------------------------------------

        if isinstance(
            node,
            ast.BinOp
        ):

            left = self.expression(
                node.left
            )


            right = self.expression(
                node.right
            )


            temp = self.new_temp()


            operator = self.operator_name(
                node.op
            )


            self.instructions.append(
                f"{temp} = {left} {operator} {right}"
            )


            return temp


        # -------------------------------------------------
        # UNARY OPERATION
        # -------------------------------------------------

        if isinstance(
            node,
            ast.UnaryOp
        ):

            operand = self.expression(
                node.operand
            )


            temp = self.new_temp()


            if isinstance(
                node.op,
                ast.USub
            ):

                operator = "-"


            elif isinstance(
                node.op,
                ast.UAdd
            ):

                operator = "+"


            elif isinstance(
                node.op,
                ast.Not
            ):

                operator = "NOT "


            else:

                operator = (
                    type(
                        node.op
                    ).__name__
                    +
                    " "
                )


            self.instructions.append(
                f"{temp} = {operator}{operand}"
            )


            return temp


        # -------------------------------------------------
        # COMPARISON
        # -------------------------------------------------

        if isinstance(
            node,
            ast.Compare
        ):

            left = self.expression(
                node.left
            )


            if (
                len(node.ops) == 1
                and
                len(node.comparators) == 1
            ):

                right = self.expression(
                    node.comparators[0]
                )


                temp = self.new_temp()


                operator = self.operator_name(
                    node.ops[0]
                )


                self.instructions.append(
                    f"{temp} = {left} {operator} {right}"
                )


                return temp


        # -------------------------------------------------
        # FUNCTION CALL
        # -------------------------------------------------

        if isinstance(
            node,
            ast.Call
        ):

            try:

                function_name = ast.unparse(
                    node.func
                )

            except Exception:

                function_name = "FUNCTION"


            arguments = []


            for argument in node.args:

                arguments.append(
                    self.expression(
                        argument
                    )
                )


            for argument in arguments:

                self.instructions.append(
                    f"PARAM {argument}"
                )


            temp = self.new_temp()


            self.instructions.append(
                f"{temp} = CALL {function_name}, {len(arguments)}"
            )


            return temp


        # -------------------------------------------------
        # FALLBACK
        # -------------------------------------------------

        try:

            return ast.unparse(
                node
            )

        except Exception:

            return type(
                node
            ).__name__


    # =====================================================
    # STATEMENT
    # =====================================================

    def statement(
        self,
        statement
    ):

        # -------------------------------------------------
        # ASSIGNMENT
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.Assign
        ):

            value = self.expression(
                statement.value
            )


            for target in statement.targets:

                try:

                    target_name = ast.unparse(
                        target
                    )

                except Exception:

                    target_name = "target"


                self.instructions.append(
                    f"{target_name} = {value}"
                )


            return


        # -------------------------------------------------
        # EXPRESSION
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.Expr
        ):

            self.expression(
                statement.value
            )


            return


        # -------------------------------------------------
        # IF
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.If
        ):

            condition = self.expression(
                statement.test
            )


            else_label = self.new_label()

            end_label = self.new_label()


            self.instructions.append(
                f"IF_FALSE {condition} GOTO {else_label}"
            )


            for child in statement.body:

                self.statement(
                    child
                )


            self.instructions.append(
                f"GOTO {end_label}"
            )


            self.instructions.append(
                f"{else_label}:"
            )


            for child in statement.orelse:

                self.statement(
                    child
                )


            self.instructions.append(
                f"{end_label}:"
            )


            return


        # -------------------------------------------------
        # WHILE
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.While
        ):

            start_label = self.new_label()

            end_label = self.new_label()


            self.instructions.append(
                f"{start_label}:"
            )


            condition = self.expression(
                statement.test
            )


            self.instructions.append(
                f"IF_FALSE {condition} GOTO {end_label}"
            )


            for child in statement.body:

                self.statement(
                    child
                )


            self.instructions.append(
                f"GOTO {start_label}"
            )


            self.instructions.append(
                f"{end_label}:"
            )


            return


        # -------------------------------------------------
        # RETURN
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.Return
        ):

            if statement.value:

                value = self.expression(
                    statement.value
                )


                self.instructions.append(
                    f"RETURN {value}"
                )

            else:

                self.instructions.append(
                    "RETURN"
                )


            return


        # -------------------------------------------------
        # FUNCTION
        # -------------------------------------------------

        if isinstance(
            statement,
            ast.FunctionDef
        ):

            self.instructions.append(
                f"FUNCTION {statement.name}:"
            )


            for child in statement.body:

                self.statement(
                    child
                )


            self.instructions.append(
                f"END FUNCTION {statement.name}"
            )


            return


        # -------------------------------------------------
        # FALLBACK
        # -------------------------------------------------

        try:

            self.instructions.append(
                ast.unparse(
                    statement
                )
            )

        except Exception:

            self.instructions.append(
                type(
                    statement
                ).__name__
            )


    # =====================================================
    # GENERATE
    # =====================================================

    def generate(
        self,
        tree
    ):

        for statement in tree.body:

            self.statement(
                statement
            )


        return self.instructions


# =========================================================
# 4. CODE OPTIMIZATION
# =========================================================

def optimize_code(code):

    optimization_steps = []


    # -----------------------------------------------------
    # SAFE CONSTANT CALCULATION
    # -----------------------------------------------------

    def calculate_constant_operation(
        node
    ):

        if not (
            isinstance(
                node.left,
                ast.Constant
            )
            and
            isinstance(
                node.right,
                ast.Constant
            )
        ):

            return False, None


        left = node.left.value

        right = node.right.value


        try:

            if isinstance(
                node.op,
                ast.Add
            ):

                return True, left + right


            if isinstance(
                node.op,
                ast.Sub
            ):

                return True, left - right


            if isinstance(
                node.op,
                ast.Mult
            ):

                return True, left * right


            if isinstance(
                node.op,
                ast.Div
            ):

                return True, left / right


            if isinstance(
                node.op,
                ast.FloorDiv
            ):

                return True, left // right


            if isinstance(
                node.op,
                ast.Mod
            ):

                return True, left % right


            if isinstance(
                node.op,
                ast.Pow
            ):

                return True, left ** right


        except Exception:

            return False, None


        return False, None


    # =====================================================
    # OPTIMIZER
    # =====================================================

    class ConstantOptimizer(
        ast.NodeTransformer
    ):

        def __init__(self):

            self.constants = {}


        # -------------------------------------------------
        # CONSTANT PROPAGATION
        # -------------------------------------------------

        def visit_Name(
            self,
            node
        ):

            if (
                isinstance(
                    node.ctx,
                    ast.Load
                )
                and
                node.id in self.constants
            ):

                value = self.constants[
                    node.id
                ]


                optimization_steps.append(
                    f"Constant Propagation: {node.id} -> {repr(value)}"
                )


                return ast.copy_location(
                    ast.Constant(
                        value=value
                    ),
                    node
                )


            return node


        # -------------------------------------------------
        # CONSTANT FOLDING
        # -------------------------------------------------

        def visit_BinOp(
            self,
            node
        ):

            node.left = self.visit(
                node.left
            )


            node.right = self.visit(
                node.right
            )


            success, value = calculate_constant_operation(
                node
            )


            if success:

                try:

                    original_expression = ast.unparse(
                        node
                    )

                except Exception:

                    original_expression = (
                        "constant expression"
                    )


                optimization_steps.append(
                    f"Constant Folding: {original_expression} -> {repr(value)}"
                )


                return ast.copy_location(
                    ast.Constant(
                        value=value
                    ),
                    node
                )


            return node


        # -------------------------------------------------
        # ASSIGNMENT
        # -------------------------------------------------

        def visit_Assign(
            self,
            node
        ):

            node.value = self.visit(
                node.value
            )


            for target in node.targets:

                if isinstance(
                    target,
                    ast.Name
                ):

                    if isinstance(
                        node.value,
                        ast.Constant
                    ):

                        self.constants[
                            target.id
                        ] = node.value.value

                    else:

                        self.constants.pop(
                            target.id,
                            None
                        )


            return node


    optimization_tree = ast.parse(
        code
    )


    optimizer = ConstantOptimizer()


    optimized_tree = optimizer.visit(
        optimization_tree
    )


    ast.fix_missing_locations(
        optimized_tree
    )


    optimized_source = ast.unparse(
        optimized_tree
    )


    if not optimization_steps:

        optimization_steps.append(
            "No basic constant optimization was required."
        )


    result = {

        "status":
            "success",

        "type":
            "Educational Basic Optimization",

        "techniques": [
            "Constant Propagation",
            "Constant Folding"
        ],

        "applied_steps":
            optimization_steps,

        "original_code":
            code,

        "optimized_code":
            optimized_source

    }


    return (
        result,
        optimized_source
    )


# =========================================================
# 5. TARGET CODE
# =========================================================

def generate_target_code(
    code
):

    compiled_code = compile(
        code,
        "<hamim-compiler>",
        "exec"
    )


    instructions = []


    for instruction in dis.get_instructions(
        compiled_code
    ):

        instructions.append({

            "offset":
                instruction.offset,

            "opcode":
                instruction.opcode,

            "opname":
                instruction.opname,

            "arg":
                instruction.arg,

            "argrepr":
                instruction.argrepr

        })


    output = io.StringIO()


    dis.dis(
        compiled_code,
        file=output
    )


    target_code = {

        "status":
            "success",

        "type":
            "CPython Bytecode",

        "instructions":
            instructions,

        "disassembly":
            output.getvalue(),

        "note":
            (
                "This stage shows real CPython bytecode "
                "generated from the optimized Python source."
            )

    }


    return (
        compiled_code,
        target_code
    )


# =========================================================
# 6. BINARY REPRESENTATION
# =========================================================

def generate_binary_code(
    compiled_code
):

    byte_data = compiled_code.co_code


    binary_lines = []


    for index in range(
        0,
        len(byte_data),
        8
    ):

        chunk = byte_data[
            index:index + 8
        ]


        binary_lines.append(
            " ".join(
                f"{byte:08b}"
                for byte in chunk
            )
        )


    hex_lines = []


    for index in range(
        0,
        len(byte_data),
        16
    ):

        chunk = byte_data[
            index:index + 16
        ]


        hex_lines.append(
            " ".join(
                f"{byte:02X}"
                for byte in chunk
            )
        )


    return {

        "status":
            "success",

        "type":
            "CPython Bytecode Binary Representation",

        "byte_count":
            len(byte_data),

        "raw_bytes":
            list(byte_data),

        "binary":
            "\n".join(
                binary_lines
            ),

        "hex":
            "\n".join(
                hex_lines
            ),

        "execution_path": [

            "Python Source Code",

            "Lexical Analysis",

            "Syntax Tree",

            "Optimized Source",

            "CPython Bytecode",

            "Python Virtual Machine",

            "Native Interpreter",

            "CPU"

        ],

        "note":
            (
                "These 0/1 values are the real binary "
                "representation of CPython bytecode. "
                "They are not direct x86/ARM native machine code."
            )

    }


# =========================================================
# 7. COMPILE API
# =========================================================

@app.route(
    "/api/compile",
    methods=["POST"]
)
def compile_code():

    data = request.get_json(
        silent=True
    )


    if not data:

        return jsonify({

            "status":
                "error",

            "message":
                "No data received"

        }), 400


    code = data.get(
        "code",
        ""
    )


    language = data.get(
        "language",
        "python"
    )


    if not code.strip():

        return jsonify({

            "status":
                "error",

            "message":
                "Source code is empty"

        }), 400


    if language != "python":

        return jsonify({

            "status":
                "error",

            "message":
                (
                    "Currently backend compiler "
                    "visualization supports Python only."
                )

        }), 400


    # =====================================================
    # RESULT
    # =====================================================

    result = {

        "status":
            "success",

        "language":
            language,

        "pipeline": [

            "Source Code",

            "Lexical Analysis",

            "Syntax Analysis",

            "Abstract Syntax Tree",

            "Semantic Analysis",

            "Symbol Table",

            "Intermediate Code",

            "Code Optimization",

            "Target Code",

            "Binary Representation",

            "Execution & Final Output"

        ],

        "source_code":
            code,

        "lexical_analysis":
            [],

        "syntax_analysis":
            {},

        "ast_tree":
            "",

        "semantic_analysis":
            {},

        "symbol_table":
            [],

        "intermediate_code":
            [],

        "intermediate_code_text":
            "",

        "code_optimization":
            {},

        "optimized_code":
            "",

        "target_code":
            {},

        "binary_code":
            {},

        # Execution is intentionally handled
        # in the browser using Pyodide.
        "execution":
            {},

        "final_output":
            ""

    }


    # =====================================================
    # STAGE 1 - LEXICAL ANALYSIS
    # =====================================================

    try:

        result[
            "lexical_analysis"
        ] = lexical_analysis(
            code
        )


    except Exception as error:

        result[
            "status"
        ] = "lexical_error"


        return jsonify({

            **result,

            "message":
                str(error)

        }), 400


    # =====================================================
    # STAGE 2 - SYNTAX + AST
    # =====================================================

    try:

        tree = ast.parse(
            code
        )


        result[
            "syntax_analysis"
        ] = {

            "valid":
                True,

            "message":
                "Syntax is valid"

        }


        result[
            "ast_tree"
        ] = ast.dump(
            tree,
            indent=2
        )


    except SyntaxError as error:

        result[
            "status"
        ] = "syntax_error"


        result[
            "syntax_analysis"
        ] = {

            "valid":
                False,

            "message":
                error.msg,

            "line":
                error.lineno,

            "column":
                error.offset

        }


        return jsonify(
            result
        ), 400


    # =====================================================
    # STAGE 3 - SEMANTIC + SYMBOL TABLE
    # =====================================================

    try:

        (
            semantic_result,
            symbol_table
        ) = semantic_analysis(
            tree
        )


        result[
            "semantic_analysis"
        ] = semantic_result


        result[
            "symbol_table"
        ] = symbol_table


    except Exception as error:

        result[
            "semantic_analysis"
        ] = {

            "valid":
                False,

            "messages": [
                str(error)
            ]

        }


    # =====================================================
    # STAGE 4 - INTERMEDIATE CODE
    # =====================================================

    try:

        ir_generator = IRGenerator()


        intermediate_code = ir_generator.generate(
            tree
        )


        result[
            "intermediate_code"
        ] = intermediate_code


        result[
            "intermediate_code_text"
        ] = "\n".join(
            intermediate_code
        )


    except Exception as error:

        result[
            "intermediate_code"
        ] = [
            f"IR generation error: {error}"
        ]


        result[
            "intermediate_code_text"
        ] = (
            f"IR generation error: {error}"
        )


    # =====================================================
    # STAGE 5 - OPTIMIZATION
    # =====================================================

    try:

        (
            optimization_result,
            optimized_code
        ) = optimize_code(
            code
        )


        result[
            "code_optimization"
        ] = optimization_result


        result[
            "optimized_code"
        ] = optimized_code


    except Exception as error:

        result[
            "code_optimization"
        ] = {

            "status":
                "error",

            "message":
                str(error)

        }


        result[
            "optimized_code"
        ] = code


    # =====================================================
    # STAGE 6 - TARGET CODE
    # =====================================================

    compiled_code = None


    try:

        (
            compiled_code,
            target_code
        ) = generate_target_code(

            result[
                "optimized_code"
            ]

        )


        result[
            "target_code"
        ] = target_code


    except Exception as error:

        result[
            "target_code"
        ] = {

            "status":
                "error",

            "message":
                str(error)

        }


    # =====================================================
    # STAGE 7 - BINARY REPRESENTATION
    # =====================================================

    if compiled_code is not None:

        try:

            result[
                "binary_code"
            ] = generate_binary_code(
                compiled_code
            )


        except Exception as error:

            result[
                "binary_code"
            ] = {

                "status":
                    "error",

                "message":
                    str(error)

            }


    else:

        result[
            "binary_code"
        ] = {

            "status":
                "error",

            "message":
                (
                    "Binary representation unavailable "
                    "because target code generation failed."
                )

        }


    # =====================================================
    # STAGE 8 - EXECUTION
    # =====================================================

    # We DO NOT execute arbitrary Python code here.
    #
    # The frontend script.js runs the code using Pyodide
    # inside the browser instead.
    #
    # This makes the backend safer for a public demo.

    result[
        "execution"
    ] = {}


    result[
        "final_output"
    ] = ""


    # =====================================================
    # RETURN
    # =====================================================

    return jsonify(
        result
    )


# =========================================================
# SERVER START
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )