import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { logger } from "../utils/logger";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong and latency info!");

export async function execute(interaction: CommandInteraction) {
  const isDebugMode = process.env.DEBUG === "true";

  if (isDebugMode) {
    logger.debug(`Ping command executed by ${interaction.user.tag}`);
  }

  const startTime = Date.now();

  // Send the initial reply
  await interaction.reply({ content: "Pinging..." });

  // Get the reply as a message object after it's been sent
  const response = await interaction.fetchReply();

  const latency = Date.now() - startTime;
  const apiLatency = Math.round(interaction.client.ws.ping);

  logger.cmd(`Ping command: Latency ${latency}ms, API Latency ${apiLatency}ms`);

  await interaction.editReply(
    `Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`
  );
}
