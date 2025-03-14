import { logger } from "./logger";
import { spawn } from "child_process";
import { Client, TextChannel, EmbedBuilder } from "discord.js";
import os from "os";

export class RestartHandler {
  private static maxRestarts = 5;
  private static restartCount = 0;
  private static restartDelay = 5000; // 5 seconds
  private static lastRestartTime = Date.now();
  private static client: Client;

  static initialize(client: Client) {
    this.client = client;
  }

  private static async notifyModerators(reason: string) {
    if (!this.client) return;

    const modChannelId = process.env.MOD_CHANNEL_ID;
    if (!modChannelId) {
      logger.warn("MOD_CHANNEL_ID not set in .env file");
      return;
    }

    try {
      const channel = await this.client.channels.fetch(modChannelId);
      if (channel && channel instanceof TextChannel) {
        const embed = new EmbedBuilder()
          .setColor(this.restartCount >= this.maxRestarts ? 0xff0000 : 0xffa500)
          .setTitle("🔄 Bot Restart Notification")
          .setDescription(`The bot is restarting due to an error...`)
          .addFields(
            {
              name: "❌ Error Details",
              value: `\`\`\`\n${reason}\n\`\`\``,
              inline: false,
            },
            {
              name: "📊 Status",
              value: [
                `**Attempt:** ${this.restartCount}/${this.maxRestarts}`,
                `**Memory Usage:** ${this.formatBytes(
                  process.memoryUsage().heapUsed
                )}`,
                `**Uptime:** ${this.formatUptime(process.uptime())}`,
                `**Node Version:** ${process.version}`,
              ].join("\n"),
              inline: false,
            }
          )
          .setTimestamp();

        if (this.restartCount >= this.maxRestarts) {
          embed.addFields({
            name: "⚠️ Warning",
            value:
              "Maximum restart attempts reached! Manual intervention required.",
            inline: false,
          });
        }

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      logger.error("Failed to send restart notification:", error);
    }
  }

  private static formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  private static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  private static getStatusEmoji(): string {
    if (this.restartCount >= this.maxRestarts) return "🔴";
    if (this.restartCount > 3) return "🟡";
    return "🟢";
  }

  static async restartBot(reason = "Unknown error") {
    const now = Date.now();
    const timeSinceLastRestart = now - this.lastRestartTime;

    // Reset restart count if last restart was more than 1 minute ago
    if (timeSinceLastRestart > 60000) {
      this.restartCount = 0;
    }

    // Check if we've hit the maximum restart attempts
    if (this.restartCount >= this.maxRestarts) {
      await this.notifyModerators(
        `Bot has crashed ${this.maxRestarts} times in quick succession. Stopping automatic restarts.`
      );
      process.exit(1);
    }

    this.restartCount++;
    this.lastRestartTime = now;

    logger.warn(
      `Bot crashed. Attempting restart ${this.restartCount}/${
        this.maxRestarts
      } in ${this.restartDelay / 1000} seconds...`
    );

    await this.notifyModerators(reason);

    // Wait for the delay
    await new Promise((resolve) => setTimeout(resolve, this.restartDelay));

    // Spawn a new process
    const child = spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: "inherit",
    });

    // Exit the current process once the new one is spawned
    child.unref();
    process.exit();
  }
}
