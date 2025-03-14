import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { logger } from "./utils/logger";

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

// Handle process events for better error handling and logging
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});

// Initialize the bot
initBot();
