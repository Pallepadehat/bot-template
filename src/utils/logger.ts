import { config } from "dotenv";

// Load environment variables
config();

// Check if debug mode is enabled
const isDebugMode = process.env.DEBUG === "true";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Format the current timestamp
const timestamp = () => {
  const now = new Date();
  return now.toISOString();
};

// Add this interface before the logger object
interface DiscordAPIError {
  code?: number;
  rawError?: {
    message: string;
    code: number;
  };
  message?: string;
  stack?: string;
}

// Logger functions
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(
      `${colors.green}[INFO]${colors.reset} ${colors.dim}${timestamp()}${
        colors.reset
      } ${message}`,
      ...args
    );
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${colors.dim}${timestamp()}${
        colors.reset
      } ${message}`,
      ...args
    );
  },

  error: (message: string, ...args: any[]) => {
    // Check if this is a Discord API Error
    const error = args[0];
    if (error && typeof error === "object") {
      // Check both direct code and nested rawError code
      const errorCode = error.code || error.rawError?.code;
      const errorMessage = error.message || error.rawError?.message;

      // Filter out Unknown Interaction errors (10062)
      if (
        errorCode === 10062 &&
        errorMessage?.includes("Unknown interaction")
      ) {
        return; // Skip logging this error completely
      }
    }

    console.error(
      `${colors.red}[ERROR]${colors.reset} ${colors.dim}${timestamp()}${
        colors.reset
      } ${message}`,
      ...args
    );
  },

  debug: (message: string, ...args: any[]) => {
    if (isDebugMode) {
      console.debug(
        `${colors.cyan}[DEBUG]${colors.reset} ${colors.dim}${timestamp()}${
          colors.reset
        } ${message}`,
        ...args
      );
    }
  },

  cmd: (message: string, ...args: any[]) => {
    console.log(
      `${colors.magenta}[COMMAND]${colors.reset} ${colors.dim}${timestamp()}${
        colors.reset
      } ${message}`,
      ...args
    );
  },
};
