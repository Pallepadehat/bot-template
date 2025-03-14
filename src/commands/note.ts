import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

export const data = new SlashCommandBuilder()
  .setName("note")
  .setDescription("Manage your notes")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Add a new note")
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("The content of your note")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("edit")
      .setDescription("Edit an existing note")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the note to edit")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("The new content of your note")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("delete")
      .setDescription("Delete a note")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the note to delete")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("get").setDescription("Get your notes")
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    switch (subcommand) {
      case "add": {
        const content = interaction.options.getString("content", true);
        const note = await prisma.note.create({
          data: { userId, content },
        });

        await interaction.reply({
          content: `Note created with ID: ${note.id}`,
          flags: MessageFlags.Ephemeral,
        });
        break;
      }

      case "edit": {
        const id = interaction.options.getString("id", true);
        const content = interaction.options.getString("content", true);

        const note = await prisma.note.updateMany({
          where: { id, userId },
          data: { content },
        });

        if (note.count === 0) {
          await interaction.reply({
            content: "Note not found or you don't have permission to edit it.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await interaction.reply({
          content: "Note updated successfully!",
          flags: MessageFlags.Ephemeral,
        });
        break;
      }

      case "delete": {
        const id = interaction.options.getString("id", true);

        const note = await prisma.note.deleteMany({
          where: { id, userId },
        });

        if (note.count === 0) {
          await interaction.reply({
            content:
              "Note not found or you don't have permission to delete it.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await interaction.reply({
          content: "Note deleted successfully!",
          flags: MessageFlags.Ephemeral,
        });
        break;
      }

      case "get": {
        const notes = await prisma.note.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });

        if (notes.length === 0) {
          await interaction.reply({
            content: "You don't have any notes yet!",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle("Your Notes")
          .setColor(0x0099ff)
          .setDescription(
            notes
              .map(
                (note) =>
                  `**ID:** ${note.id}\n**Created:** <t:${Math.floor(
                    note.createdAt.getTime() / 1000
                  )}:R>\n${note.content}\n`
              )
              .join("\n")
          );

        await interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
        break;
      }
    }

    logger.cmd(
      `Note command (${subcommand}) executed by ${interaction.user.tag}`
    );
  } catch (error) {
    logger.error("Error in note command:", error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
