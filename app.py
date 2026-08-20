import json
import os
import sys
import tempfile
import subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


HOST = "0.0.0.0"
PORT = 8000
TIMEOUT = 10


class PythonCompilerServer(SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
        )
        super().end_headers()


    def send_json(self, data, status=200):

        response = json.dumps(
            data,
            ensure_ascii=False
        ).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Content-Length",
            str(len(response))
        )

        self.end_headers()

        self.wfile.write(response)


    def do_POST(self):

        if self.path != "/run":

            self.send_json(
                {
                    "success": False,
                    "output": "",
                    "error": "Route not found."
                },
                404
            )

            return


        try:

            content_length = int(
                self.headers.get(
                    "Content-Length",
                    0
                )
            )

            body = self.rfile.read(
                content_length
            )

            data = json.loads(
                body.decode("utf-8")
            )

            code = data.get(
                "code",
                ""
            )

            program_input = data.get(
                "input",
                ""
            )


            if not code.strip():

                self.send_json({
                    "success": False,
                    "output": "",
                    "error": "No Python code provided."
                })

                return


            with tempfile.TemporaryDirectory() as temp_folder:

                python_file = os.path.join(
                    temp_folder,
                    "main.py"
                )


                with open(
                    python_file,
                    "w",
                    encoding="utf-8"
                ) as file:

                    file.write(code)


                environment = os.environ.copy()

                environment[
                    "PYTHONIOENCODING"
                ] = "utf-8"

                environment[
                    "PYTHONUNBUFFERED"
                ] = "1"


                try:

                    process = subprocess.run(

                        [
                            sys.executable,
                            "-u",
                            python_file
                        ],

                        input=program_input,

                        stdout=subprocess.PIPE,

                        stderr=subprocess.PIPE,

                        text=True,

                        encoding="utf-8",

                        errors="replace",

                        timeout=TIMEOUT,

                        cwd=temp_folder,

                        env=environment
                    )


                    stdout = process.stdout

                    stderr = process.stderr


                    if process.returncode == 0:

                        self.send_json({

                            "success": True,

                            "output": stdout,

                            "error": ""

                        })


                    else:

                        self.send_json({

                            "success": False,

                            "output": stdout,

                            "error": stderr

                        })


                except subprocess.TimeoutExpired as error:

                    output = error.stdout or ""


                    if isinstance(
                        output,
                        bytes
                    ):

                        output = output.decode(
                            "utf-8",
                            errors="replace"
                        )


                    self.send_json({

                        "success": False,

                        "output": output,

                        "error":
                            f"\nExecution stopped. Maximum runtime is {TIMEOUT} seconds."

                    })


        except json.JSONDecodeError:

            self.send_json(
                {
                    "success": False,
                    "output": "",
                    "error": "Invalid request."
                },
                400
            )


        except Exception as error:

            self.send_json(
                {
                    "success": False,
                    "output": "",
                    "error": str(error)
                },
                500
            )


if __name__ == "__main__":

    server = ThreadingHTTPServer(
        (HOST, PORT),
        PythonCompilerServer
    )


    print("")
    print("==============================")
    print(" Python Compiler Running")
    print("==============================")
    print("")
    print(f"Port: {PORT}")
    print("")
    print("Codespaces:")
    print("Open PORTS tab")
    print("Then open port 8000")
    print("")
    print("CTRL + C to stop")
    print("")


    try:

        server.serve_forever()


    except KeyboardInterrupt:

        print("")
        print("Server stopped.")

        server.server_close()