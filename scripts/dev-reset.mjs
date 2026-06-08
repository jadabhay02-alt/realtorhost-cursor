import { execSync, spawn } from "node:child_process";

function run(command, { ignoreFailure = false } = {}) {
  try {
    execSync(command, { stdio: "inherit", shell: true });
  } catch (error) {
    if (!ignoreFailure) {
      throw error;
    }
  }
}

console.log("Realtor Host — restarting dev server on port 3000...\n");

run("npx --yes kill-port 3000", { ignoreFailure: true });
run("npx prisma generate");

const child = spawn("npx next dev -p 3000", {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
