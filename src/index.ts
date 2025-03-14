import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { logger } from "./utils/logger";
import { RestartHandler } from "./utils/restartHandler";

// Load environment variables
config();

const isDebugMode = process.env.DEBUG === "true";

if (isDebugMode) {
  logger.debug("Debug mode is enabled");
}

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Extend the Client type to include commands collection
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
  }
}

// Initialize commands collection
client.commands = new Collection();

// Start the bot initialization process
async function initBot() {
  try {
    if (isDebugMode) {
      logger.debug("Loading commands...");
    }

    // Load commands
    await loadCommands(client);

    if (isDebugMode) {
      logger.debug("Loading events...");
    }

    // Load events
    await loadEvents(client);

    // Login to Discord
    await client.login(process.env.TOKEN);

    logger.info("Bot is now online!");
  } catch (error) {
    logger.error("Failed to initialize the bot:", error);
    process.exit(1);
  }
}

// After client is created and before event handlers
client.once("ready", () => {
  RestartHandler.initialize(client);
});

// Handle process events for better error handling and logging
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection:", error);
  RestartHandler.restartBot(`Unhandled Promise Rejection: ${error}`);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  RestartHandler.restartBot(`Uncaught Exception: ${error}`);
});

// Add additional crash handlers
process.on("SIGINT", () => {
  logger.info("Received SIGINT. Bot is shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM. Bot is shutting down...");
  process.exit(0);
});

// Initialize the bot
initBot();
