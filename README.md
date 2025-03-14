# Discord Bot Template

A modern, TypeScript-based Discord bot template with a clean modular architecture using Discord.js. This template provides a robust foundation for building powerful Discord bots with advanced command and event handling systems, and database integration.

<div align="center">
  <img alt="Discord.js Logo" src="https://discord.js.org/static/logo.svg" width="546" />
  <br>
  <p>Built with <a href="https://discord.js.org">Discord.js</a></p>
</div>

## ✨ Features

- **🚀 TypeScript Support**: Fully typed codebase for superior developer experience
- **📁 Modular Architecture**: Clean separation of commands, events, and handlers
- **⚡ Slash Command System**: Easy-to-extend dynamic slash command structure
- **🔄 Event Handler**: Simplified event management system with automatic registration
- **🐛 Debug Mode**: Toggle detailed logging for development
- **🔧 Built-in Development Tools**: Watch mode for rapid iteration
- **📦 Production-Ready**: Build system for optimized deployment
- **🎨 Color-coded Logging**: Beautiful console output with categorized messages
- **💾 Database Integration**: Built-in Prisma support for data persistence
- **🔄 Auto-Restart**: Intelligent crash recovery system

## 🚀 Getting Started

### Prerequisites

- Node.js v16.9.0 or higher
- PostgreSQL database
- One of the following runtimes:
  - [Bun](https://bun.sh/) (v1.0.0 or higher, recommended)
  - [Node.js](https://nodejs.org/) with npm/yarn
  - [Deno](https://deno.land/)

### Installation

1. **Clone this repository**

```bash
git clone https://github.com/Pallepadehat/bot-template.git
cd bot-template
```

2. **Install dependencies**

With Bun (recommended):

```bash
bun install
```

With npm:

```bash
npm install
```

With yarn:

```bash
yarn install
```

3. **Set up your database**

```bash
# Initialize Prisma
bunx prisma init

# After configuring your database URL in .env
bunx prisma generate
bunx prisma db push
```

4. **Configure the bot**

Create a `.env` file:

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
DEBUG=false
MOD_CHANNEL_ID=your_mod_channel_id
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

### Development and Deployment

#### Development Mode

With Bun:

```bash
bun run dev
```

With npm:

```bash
npm run dev
```

With yarn:

```bash
yarn dev
```

#### Production Mode

Build and start:

```bash
# With Bun
bun run start:prod

# With npm
npm run start:prod

# With yarn
yarn start:prod
```

## 📁 Project Structure

```
src/
├── commands/             # Command files
│   └── note.ts          # Database-integrated notes system
├── events/              # Event handlers
├── handlers/            # Core logic
├── utils/               # Utilities
└── index.ts            # Entry point
```

## 🗃️ Available Commands

### 📝 Notes

- `/note add <content>` - Create a new note
- `/note edit <id> <content>` - Edit an existing note
- `/note delete <id>` - Delete a note
- `/note get` - View all your notes

## ⚙️ Environment Variables

| Variable       | Description                   | Required |
| -------------- | ----------------------------- | -------- |
| TOKEN          | Discord bot token             | Yes      |
| CLIENT_ID      | Discord application ID        | Yes      |
| DEBUG          | Enable debug logging          | No       |
| MOD_CHANNEL_ID | Channel for mod notifications | No       |
| DATABASE_URL   | PostgreSQL connection string  | Yes      |

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
