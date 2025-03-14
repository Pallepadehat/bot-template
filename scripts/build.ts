#!/usr/bin/env bun
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  info: (message: string) =>
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message: string) =>
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  error: (message: string) =>
    console.log(`${colors.red}[ERROR]${colors.reset} ${message}`),
  step: (step: number, total: number, message: string) =>
    console.log(
      `${colors.cyan}[${step}/${total}]${colors.reset} ${colors.bright}${message}${colors.reset}`
    ),
};

const BUILD_DIR = ".syntax";
const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, BUILD_DIR);

async function build() {
  console.log(
    `\n${colors.bright}${colors.blue}📦 STARTING BUILD PROCESS${colors.reset}\n`
  );

  const steps = 4;
  let currentStep = 0;

  try {
    // Step 1: Clean previous build
    currentStep++;
    log.step(currentStep, steps, "Cleaning previous build");
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    log.success("Build directory cleaned");

    // Step 2: Build TypeScript files
    currentStep++;
    log.step(currentStep, steps, "Building TypeScript files");
    const buildResult = spawnSync(
      "bun",
      ["build", "./src/index.ts", "--outdir", BUILD_DIR, "--target", "bun"],
      { stdio: "inherit" }
    );

    if (buildResult.status !== 0) {
      throw new Error("TypeScript compilation failed");
    }
    log.success("TypeScript compilation completed");

    // Step 3: Copy directory structure
    currentStep++;
    log.step(currentStep, steps, "Creating directory structure");
    ["commands", "events", "utils", "handlers"].forEach((dir) => {
      fs.mkdirSync(path.join(distDir, dir), { recursive: true });
    });
    log.success("Directory structure created");

    // Step 4: Build individual components
    currentStep++;
    log.step(currentStep, steps, "Building components");
    for (const dir of ["commands", "events"]) {
      const srcPath = path.join(srcDir, dir);
      if (fs.existsSync(srcPath)) {
        const files = fs
          .readdirSync(srcPath)
          .filter((file) => file.endsWith(".ts"));
        for (const file of files) {
          const result = spawnSync(
            "bun",
            [
              "build",
              path.join(`./src/${dir}`, file),
              "--outdir",
              path.join(BUILD_DIR, dir),
              "--target",
              "bun",
            ],
            { stdio: "inherit" }
          );

          if (result.status !== 0) {
            throw new Error(`Failed to build ${dir}/${file}`);
          }
          log.success(`Built ${dir}/${file}`);
        }
      }
    }

    console.log(
      `\n${colors.bright}${colors.green}✨ BUILD COMPLETED SUCCESSFULLY${colors.reset}\n`
    );
  } catch (error) {
    log.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

build();
