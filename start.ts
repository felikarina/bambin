import { spawn, ChildProcess } from "child_process";

// Types for better type safety
interface CommandResult {
  success: boolean;
  error?: string;
}

let vercelProcess: ChildProcess | null = null;

// Function to execute a command
function runCommand(command: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child: ChildProcess = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    // Store vercel process reference
    if (command === "vercel") {
      vercelProcess = child;
    }

    child.on("close", (code: number | null) => {
      if (code === 0 || code === null) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on("error", (error: Error) => {
      reject(error);
    });
  });
}

// Function to properly stop everything
async function cleanup(): Promise<void> {
  console.log("\n🛑 Stopping...");

  // Kill vercel process if it's running
  if (vercelProcess && !vercelProcess.killed) {
    try {
      vercelProcess.kill("SIGTERM");
    } catch (error) {
      // Ignore errors when killing process
    }
  }

  try {
    await runCommand("docker-compose", ["down"]);
    console.log("✅ Docker containers stopped");
  } catch (error) {
    console.error("❌ Error stopping containers:", (error as Error).message);
  }
  process.exit(0);
}

// Handle interruption signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Main function
async function main(): Promise<void> {
  try {
    console.log("🐳 Starting Docker containers...");
    await runCommand("docker-compose", ["up", "-d"]);
    console.log("✅ Docker containers started");

    console.log("🚀 Starting Vercel dev...");
    await runCommand("vercel", ["dev"]);
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    await cleanup();
  }
}

main();
