import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

export async function loadCommands(client: Client) {
  client.commands = new Collection();

  try {
    const commandsPath = path.join(process.cwd(), "src", "commands");

    if (!fs.existsSync(commandsPath)) {
      logger.error(`Commands directory not found: ${commandsPath}`);
      return;
    }

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        const command = await import(`file://${filePath}`);

        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          logger.debug(`Loaded command: ${command.data.name}`);
        } else {
          logger.warn(
            `The command at ${filePath} is missing required properties.`
          );
        }
      } catch (error) {
        logger.error(`Error loading command ${file}:`, error);
      }
    }

    logger.info(`Successfully loaded ${client.commands.size} commands`);
  } catch (error) {
    logger.error("Error in command handler:", error);
  }
}
