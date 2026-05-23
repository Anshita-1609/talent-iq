import { spawn } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

const RUN_TIMEOUT_MS = 10000;

function runProcess(command, args, cwd, timeoutMs = RUN_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const proc = spawn(command, args, { cwd, shell: false });
    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill();
    }, timeoutMs);

    proc.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: err.message, exitCode: 1 });
    });

    proc.on("close", (exitCode) => {
      clearTimeout(timer);
      if (killed) {
        resolve({
          stdout,
          stderr: stderr || "Execution timed out (10s limit)",
          exitCode: 1,
        });
        return;
      }
      resolve({ stdout, stderr, exitCode: exitCode ?? 1 });
    });
  });
}

async function writeTempFile(dir, filename, content) {
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

async function runJavaScript(code) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "tiq-js-"));
  try {
    await writeTempFile(dir, "main.js", code);
    return await runProcess("node", ["main.js"], dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

async function runPython(code) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "tiq-py-"));
  try {
    await writeTempFile(dir, "main.py", code);
    const py = process.platform === "win32" ? "python" : "python3";
    return await runProcess(py, ["main.py"], dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

async function runJava(code) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "tiq-java-"));
  try {
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classMatch?.[1] || "Main";
    const fileName = `${className}.java`;
    await writeTempFile(dir, fileName, code);

    const compile = await runProcess("javac", [fileName], dir);
    if (compile.exitCode !== 0) {
      return compile;
    }

    return await runProcess("java", [className], dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Run code locally on the server (no external Piston API).
 */
export async function runCodeLocally(language, code) {
  const runners = {
    javascript: runJavaScript,
    python: runPython,
    java: runJava,
  };

  const runner = runners[language];
  if (!runner) {
    return { success: false, error: `Unsupported language: ${language}` };
  }

  try {
    const result = await runner(code);
    const output = result.stdout || "";
    const error = result.stderr || "";

    if (result.exitCode !== 0) {
      const runtimeHint =
        /ReferenceError|SyntaxError|TypeError|is not defined/i.test(error)
          ? "Runtime error in your code (fix the code above, not the platform):\n\n"
          : "";
      return {
        success: false,
        output,
        error: runtimeHint + (error || `Process exited with code ${result.exitCode}`),
      };
    }

    return {
      success: true,
      output: output.trimEnd() || "No output",
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to run ${language}: ${err.message}. Ensure Node.js (and Python/Java if needed) are installed.`,
    };
  }
}
