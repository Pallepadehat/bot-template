import { Client, Events } from "discord.js";
import { registerCommands } from "../utils/commandRegistration";

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: Client) {
  // Register slash commands when the bot starts
  await registerCommands();

  client.user?.setActivity({ name: "Syntax Dev", state: "WATCHING" });

  console.log(`Ready! Logged in as ${client.user?.tag}`);
}
