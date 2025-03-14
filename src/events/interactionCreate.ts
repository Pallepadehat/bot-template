import { Events } from "discord.js";
import type { Interaction } from "discord.js";
import { logger } from "../utils/logger";

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error: any) {
    // Only log errors that aren't Unknown interaction
    if (error?.code !== 10062) {
      logger.error(`Error executing ${interaction.commandName}:`, error);
    }
  }
}
