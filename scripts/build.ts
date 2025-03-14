#!/usr/bin/env bun
/**
 * Discord Bot Build Script
 *
 * This script handles the build process for the Discord bot,
 * providing user-friendly feedback throughout the process.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

// Helper functions for logging
const log = {
  info: (message: string) =>
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message: string) =>
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  warning: (message: string) =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
  error: (message: string) =>
    console.log(`${colors.red}[ERROR]${colors.reset} ${message}`),
  step: (step: number, total: number, message: string) => {
    console.log(
      `${colors.cyan}[${step}/${total}]${colors.reset} ${colors.bright}${message}${colors.reset}`
    );
  },
};

// Project directories
const rootDir = path.resolve(process.cwd());
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, ".syntax");

/**
 * Ensures a directory exists, creating it if necessary
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    log.info(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Runs a command and returns the result
 */
function runCommand(command: string, args: string[], cwd = rootDir): boolean {
  log.info(`Running: ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    log.error(`Command failed with exit code ${result.status}`);
    return false;
  }

  return true;
}

/**
 * Main build process
 */
async function build() {
  console.log(
    `\n${colors.bgBlue}${colors.white}${colors.bright} DISCORD BOT BUILD PROCESS ${colors.reset}\n`
  );

  const buildSteps = 4;
  let currentStep = 0;

  // Step 1: Clean up previous build
  currentStep++;
  log.step(currentStep, buildSteps, "Cleaning previous build");

  if (fs.existsSync(distDir)) {
    log.info("Removing existing .syntax directory");
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  ensureDir(distDir);
  ensureDir(path.join(distDir, "commands"));
  ensureDir(path.join(distDir, "events"));
  log.success("Build directory structure created");

  // Step 2: Build main code
  currentStep++;
  log.step(currentStep, buildSteps, "Building main application");

  if (
    !runCommand("bun", [
      "build",
      "./src/index.ts",
      "--outdir",
      ".syntax",
      "--target",
      "node",
    ])
  ) {
    return;
  }
  log.success("Main application built");

  // Step 3: Build commands
  currentStep++;
  log.step(currentStep, buildSteps, "Building commands");

  const commandsDir = path.join(srcDir, "commands");
  const commandFiles = fs
    .readdirSync(commandsDir)
    .filter((file) => file.endsWith(".ts"));

  log.info(`Found ${commandFiles.length} commands to build`);

  if (commandFiles.length > 0) {
    for (const file of commandFiles) {
      const commandName = path.basename(file, ".ts");
      log.info(`Building command: ${commandName}`);

      if (
        !runCommand("bun", [
          "build",
          path.join("./src/commands", file),
          "--outdir",
          ".syntax/commands",
          "--target",
          "node",
        ])
      ) {
        return;
      }
    }
    log.success(`Built ${commandFiles.length} commands`);
  } else {
    log.warning("No commands found to build");
  }

  // Step 4: Build events
  currentStep++;
  log.step(currentStep, buildSteps, "Building events");

  const eventsDir = path.join(srcDir, "events");
  const eventFiles = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".ts"));

  log.info(`Found ${eventFiles.length} events to build`);

  if (eventFiles.length > 0) {
    for (const file of eventFiles) {
      const eventName = path.basename(file, ".ts");
      log.info(`Building event: ${eventName}`);

      if (
        !runCommand("bun", [
          "build",
          path.join("./src/events", file),
          "--outdir",
          ".syntax/events",
          "--target",
          "node",
        ])
      ) {
        return;
      }
    }
    log.success(`Built ${eventFiles.length} events`);
  } else {
    log.warning("No events found to build");
  }

  // Completion message
  console.log(
    `\n${colors.bgGreen}${colors.black}${colors.bright} BUILD COMPLETED SUCCESSFULLY ${colors.reset}\n`
  );
  log.info("You can now start your bot with: bun run start");
}

// Run the build process
build().catch((err) => {
  log.error(`Build failed: ${err.message}`);
  process.exit(1);
});
