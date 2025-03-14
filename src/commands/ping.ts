import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../utils/logger";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: ChatInputCommandInteraction) {
  logger.cmd(`Ping command started by ${interaction.user.tag}`);

  await interaction.reply({
    content: `🏓 Pong!\n🌐 WebSocket Latency: ${interaction.client.ws.ping}ms`,
    flags: MessageFlags.Ephemeral,
  });
}
