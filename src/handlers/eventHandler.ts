import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger";

export async function loadEvents(client: Client) {
  const isDebugMode = process.env.DEBUG === "true";

  try {
    // Get directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const eventsPath = path.join(__dirname, "..", "events");

    // Check if directory exists
    if (!fs.existsSync(eventsPath)) {
      logger.error(`Events directory not found: ${eventsPath}`);
      return;
    }

    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    if (isDebugMode) {
      logger.debug(`Found ${eventFiles.length} event files to load`);
    }

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);

      if (isDebugMode) {
        logger.debug(`Loading event from file: ${file}`);
      }

      try {
        const event = await import(filePath);

        if (event.name && typeof event.execute === "function") {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
            if (isDebugMode) {
              logger.debug(`Registered one-time event: ${event.name}`);
            }
          } else {
            client.on(event.name, (...args) => event.execute(...args));
            if (isDebugMode) {
              logger.debug(`Registered event: ${event.name}`);
            }
          }
        } else {
          logger.warn(
            `The event at ${filePath} is missing a required "name" or "execute" property.`
          );
        }
      } catch (error) {
        logger.error(`Error loading event ${file}:`, error);
      }
    }

    if (isDebugMode) {
      logger.debug("All events loaded successfully");
    }
  } catch (error) {
    logger.error("Error in event handler:", error);
  }
}
