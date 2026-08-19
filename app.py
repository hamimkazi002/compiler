import json
import os
import sys
import tempfile
import subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HOST = "0.0.0.0"
PORT = 8000
TIMEOUT_SECONDS = 10


class CompilerServer(SimpleHTTPRequestHandler):

    def send_json(self, data, status=200):
        response = json.dumps(data).encode("utf-8")

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
                    "error": "Route not found"
                },
                404
            )
            return


        try:

            content_length = int(
                self.headers.get("Content-Length", 0)
            )

            body = self.rfile.read(content_length)

            data = json.loads(
                body.decode("utf-8")
            )

            code = data.get("code", "")
            stdin_data = data.get("input", "")


            if not code.strip():

                self.send_json({
                    "success": False,
                    "output": "",
                    "error": "No Python code provided."
                })

                return


            with tempfile.TemporaryDirectory() as temp_dir:

                file_path = os.path.join(
                    temp_dir,
                    "main.py"
                )


                with open(
                    file_path,
                    "w",
                    encoding="utf-8"
                ) as file:

                    file.write(code)


                env = os.environ.copy()

                env["PYTHONIOENCODING"] = "utf-8"
                env["PYTHONUNBUFFERED"] = "1"


                try:

                    process = subprocess.run(

                        [
                            sys.executable,
                            "-u",
                            file_path
                        ],

                        input=stdin_data,

                        capture_output=True,

                        text=True,

                        encoding="utf-8",

                        errors="replace",

                        timeout=TIMEOUT_SECONDS,

                        cwd=temp_dir,

                        env=env
                    )


                    stdout = process.stdout
                    stderr = process.stderr


                    if process.returncode == 0:

                        self.send_json({

                            "success": True,

                            "output": stdout,

                            "error": "",

                            "returnCode":
                                process.returncode

                        })


                    else:

                        self.send_json({

                            "success": False,

                            "output": stdout,

                            "error": stderr,

                            "returnCode":
                                process.returncode

                        })


                except subprocess.TimeoutExpired as error:

                    stdout = error.stdout or ""
                    stderr = error.stderr or ""


                    if isinstance(stdout, bytes):

                        stdout = stdout.decode(
                            "utf-8",
                            errors="replace"
                        )


                    if isinstance(stderr, bytes):

                        stderr = stderr.decode(
                            "utf-8",
                            errors="replace"
                        )


                    self.send_json({

                        "success": False,

                        "output": stdout,

                        "error":
                            stderr +
                            f"\nExecution stopped: program exceeded {TIMEOUT_SECONDS} seconds.",

                        "returnCode": -1

                    })


        except json.JSONDecodeError:

            self.send_json(
                {
                    "success": False,
                    "output": "",
                    "error": "Invalid request data."
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
        CompilerServer
    )

    print("")
    print("===================================")
    print(" Python Compiler Server Running")
    print("===================================")
    print("")
    print(f"Host: {HOST}")
    print(f"Port: {PORT}")
    print("")
    print("Open the forwarded port in Codespaces.")
    print("")
    print("Press CTRL + C to stop server.")
    print("")

    try:

        server.serve_forever()

    except KeyboardInterrupt:

        print("")
        print("Server stopped.")

        server.server_close()