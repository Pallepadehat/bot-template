# Discord Bot Template

A modern, TypeScript-based Discord bot template with a clean modular architecture using Discord.js and Bun. This template provides a robust foundation for building powerful Discord bots with advanced command and event handling systems.

<div align="center">
  <img alt="Discord.js Logo" src="https://discord.js.org/static/logo.svg" width="546" />
  <br>
  <p>Built with <a href="https://discord.js.org">Discord.js</a> and <a href="https://bun.sh">Bun</a></p>
</div>

## ✨ Features

- **🚀 TypeScript Support**: Fully typed codebase for a superior developer experience and fewer bugs
- **📁 Modular Architecture**: Clean separation of commands, events, and handlers
- **⚡ Slash Command System**: Easy-to-extend dynamic slash command structure
- **🔄 Event Handler**: Simplified event management system with automatic registration
- **🐛 Debug Mode**: Toggle detailed logging for development with color-coded output
- **🔧 Built-in Development Tools**: Watch mode for rapid iteration during development
- **📦 Production-Ready**: Build system for optimized deployment
- **🎨 Color-coded Logging**: Beautiful console output with categorized messages

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Discord Developer Account](https://discord.com/developers/applications)
- Node.js v16.9.0 or higher (if not using Bun's Node.js compatibility)

### Installation

1. **Clone this repository**

```bash
git clone https://github.com/yourusername/discord-bot-template.git
cd discord-bot-template
```

2. **Install dependencies**

```bash
bun install
```

3. **Configure the bot**

Create a `.env` file in the root directory with the following content:

```
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
DEBUG=true
```

To get these values:

- Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
- Navigate to the "Bot" tab and click "Add Bot"
- Copy the TOKEN from there (click "Reset Token" if needed)
- Get your CLIENT_ID from the "General Information" tab

4. **Invite the bot to your server**

Replace `YOUR_CLIENT_ID` and paste this URL in your browser:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=applications.commands%20bot
```

### Development and Deployment

#### Development Mode

Run the bot with automatic reloading whenever files change:

```bash
bun run dev
```

#### Building for Production

Build the bot for production deployment:

```bash
bun run build
```

This generates optimized JavaScript files in the `.syntax` directory.

#### Running in Production

Start the bot using the built files:

```bash
bun run start
```

## 📁 Project Structure

```
src/
├── commands/             # Command files
│   ├── info.ts           # Example info command with subcommands
│   └── ping.ts           # Example ping command with latency info
│
├── events/               # Event handler files
│   ├── interactionCreate.ts   # Handles incoming command interactions
│   └── ready.ts          # Executes when the bot is ready
│
├── handlers/             # Core handler logic
│   ├── commandHandler.ts # Dynamically loads and registers commands
│   └── eventHandler.ts   # Dynamically loads and registers events
│
├── utils/                # Utility functions
│   ├── commandRegistration.ts  # Registers slash commands with Discord API
│   └── logger.ts         # Provides color-coded logging functionality
│
└── index.ts              # Entry point that bootstraps the bot
```

## 🧩 Creating Commands

To create a new command, add a new file in the `src/commands` directory:

```typescript
// src/commands/example.ts
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { logger } from "../utils/logger";

export const data = new SlashCommandBuilder()
  .setName("example")
  .setDescription("An example command")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("Some input for the command")
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const input = interaction.options.getString("input") || "No input provided";
  logger.cmd(`Example command executed by ${interaction.user.tag}`);

  await interaction.reply(`Example command executed! Input: ${input}`);
}
```

## 🎭 Creating Events

To handle a Discord event, create a new file in the `src/events` directory:

```typescript
// src/events/guildMemberAdd.ts
import { Events } from "discord.js";
import type { GuildMember } from "discord.js";
import { logger } from "../utils/logger";

export const name = Events.GuildMemberAdd;
export const once = false; // false for events that can occur multiple times

export async function execute(member: GuildMember) {
  logger.info(`New member joined: ${member.user.tag}`);

  // Send a welcome message to a designated channel
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`Welcome to the server, ${member}!`);
  }
}
```

## 🛠️ Debug Mode

Toggle debug mode by changing `DEBUG=true` to `DEBUG=false` in your `.env` file.

When debug mode is enabled, the bot will output detailed information about:

- Command and event loading
- Command execution
- File paths being used
- Registration of slash commands

Example output:

```
[DEBUG] 2023-03-14T19:46:33.760Z Loading command from file: ping.ts
[DEBUG] 2023-03-14T19:46:33.762Z Successfully loaded command: ping
[CMD] 2023-03-14T19:46:33.760Z Ping command: Latency 286ms, API Latency 124ms
```

## 📋 Command Line Scripts

- `bun run dev`: Start the bot in development mode with auto-reloading
- `bun run build`: Build the bot for production
- `bun run start`: Start the bot from built files

## 🧪 Custom Build Script

This template includes a custom build script that:

- Cleans previous builds
- Creates necessary directory structure
- Builds main application code
- Builds command and event files
- Provides user-friendly colored output with step tracking

You can modify the build script at `scripts/build.ts` to customize the build process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔗 Useful Links

- [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Bun Documentation](https://bun.sh/docs)

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) for the powerful API wrapper
- [Bun](https://bun.sh/) for the fast JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) for the type safety
