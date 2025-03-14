import { REST, Routes } from "discord.js";
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger";

config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const isDebugMode = process.env.DEBUG === "true";

if (!TOKEN || !CLIENT_ID) {
  throw new Error("Missing required environment variables TOKEN or CLIENT_ID");
}

export async function registerCommands() {
  try {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    // Get directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Detect if we're running from source or built code
    const isBuiltCode = __dirname.includes(".syntax");

    // Set up paths based on where we're running from
    let commandsPath;

    if (isBuiltCode) {
      // If running from built code (.syntax), use the .syntax/commands directory
      commandsPath = path.join(process.cwd(), ".syntax", "commands");
    } else {
      // If running from source code, use the src/commands directory
      commandsPath = path.join(process.cwd(), "src", "commands");
    }

    if (isDebugMode) {
      logger.debug(`Looking for commands to register in: ${commandsPath}`);
    }

    // Check if directory exists
    if (!fs.existsSync(commandsPath)) {
      logger.error(
        `Commands directory not found for registration: ${commandsPath}`
      );
      return;
    }

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        if (isDebugMode) {
          logger.debug(`Registering command: ${command.data.name}`);
        }
      } else {
        logger.warn(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }

    const rest = new REST().setToken(TOKEN!);

    try {
      logger.info(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(Routes.applicationCommands(CLIENT_ID!), {
        body: commands,
      });

      logger.info(
        `Successfully reloaded ${
          Array.isArray(data) ? data.length : 0
        } application (/) commands.`
      );
    } catch (error) {
      logger.error("Error registering commands:", error);
    }
  } catch (error) {
    logger.error("Error in command registration process:", error);
  }
}
