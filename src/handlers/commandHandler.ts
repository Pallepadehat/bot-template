import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger";

export async function loadCommands(client: Client) {
  // Initialize commands collection if it doesn't exist
  if (!client.commands) {
    (client as any).commands = new Collection();
  }

  // Get directory paths
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const commandsPath = path.join(__dirname, "..", "commands");

  const isDebugMode = process.env.DEBUG === "true";

  try {
    // Check if directory exists
    if (!fs.existsSync(commandsPath)) {
      logger.error(`Commands directory not found: ${commandsPath}`);
      return;
    }

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    if (isDebugMode) {
      logger.debug(`Found ${commandFiles.length} command files to load`);
    }

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      if (isDebugMode) {
        logger.debug(`Loading command from file: ${file}`);
      }

      try {
        const command = await import(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          if (isDebugMode) {
            logger.debug(`Successfully loaded command: ${command.data.name}`);
          }
        } else {
          logger.warn(
            `The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        logger.error(`Error loading command ${file}:`, error);
      }
    }

    if (isDebugMode) {
      logger.debug(`Total commands loaded: ${client.commands.size}`);
    }
  } catch (error) {
    logger.error("Error in command handler:", error);
  }
}
