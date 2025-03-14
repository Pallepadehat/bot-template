import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { logger } from "../utils/logger";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Get information about the server or a user")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("server")
      .setDescription("Get information about the server")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("user")
      .setDescription("Get information about a user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to get information about")
          .setRequired(false)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const isDebugMode = process.env.DEBUG === "true";
  const subcommand = interaction.options.getSubcommand();

  if (isDebugMode) {
    logger.debug(
      `Info command executed by ${interaction.user.tag}, subcommand: ${subcommand}`
    );
  }

  if (subcommand === "server") {
    const guild = interaction.guild;
    if (!guild) {
      logger.warn(
        `Server info command used outside of a guild by ${interaction.user.tag}`
      );
      return interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
    }

    if (isDebugMode) {
      logger.debug(
        `Generating server info for guild: ${guild.name} (${guild.id})`
      );
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL() || "")
      .addFields(
        {
          name: "Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        {
          name: "Channels",
          value: guild.channels.cache.size.toString(),
          inline: true,
        },
        {
          name: "Roles",
          value: guild.roles.cache.size.toString(),
          inline: true,
        },
        {
          name: "Emojis",
          value: guild.emojis.cache.size.toString(),
          inline: true,
        }
      )
      .setFooter({ text: `ID: ${guild.id}` });

    logger.cmd(
      `Server info command used by ${interaction.user.tag} in ${guild.name}`
    );
    await interaction.reply({ embeds: [embed] });
  } else if (subcommand === "user") {
    const targetUser =
      interaction.options.getUser("target") || interaction.user;
    const member = interaction.guild?.members.cache.get(targetUser.id);

    if (isDebugMode) {
      logger.debug(
        `Generating user info for user: ${targetUser.tag} (${targetUser.id})`
      );
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(targetUser.tag)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields({
        name: "Account Created",
        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
        inline: true,
      })
      .setFooter({ text: `ID: ${targetUser.id}` });

    if (member) {
      embed.addFields(
        {
          name: "Joined Server",
          value: member.joinedTimestamp
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            : "Unknown",
          inline: true,
        },
        { name: "Nickname", value: member.nickname || "None", inline: true },
        {
          name: "Roles",
          value:
            member.roles.cache.size > 1
              ? `${member.roles.cache.size - 1} roles`
              : "No roles",
          inline: true,
        }
      );
    }

    logger.cmd(
      `User info command used by ${interaction.user.tag} for target: ${targetUser.tag}`
    );
    await interaction.reply({ embeds: [embed] });
  }
}
