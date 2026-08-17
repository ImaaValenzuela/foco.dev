import { spawn } from "node:child_process";

export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: options.capture ? ["inherit", "pipe", "inherit"] : "inherit",
      shell: process.platform === "win32"
    });

    if (options.capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      const result = { code, stdout };
      if (code === 0 || options.allowFailure) resolve(result);
      else reject(new Error(`${command} termino con codigo ${code}`));
    });
  });
}
