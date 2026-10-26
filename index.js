// White Tier all-in-one bot (discord.js v14)
// index.js only starts the bot and loads every file inside /features.

const { Client, GatewayIntentBits, REST, Routes, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('./config');

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // needed for welcome (enable "Server Members Intent" in Developer Portal)
  ],
});

// ---- Load features ----
const featuresDir = path.join(__dirname, 'features');
const features = fs
  .readdirSync(featuresDir)
  .filter(f => f.endsWith('.js'))
  .map(f => require(path.join(featuresDir, f)));

const commandMap = new Map();
for (const feature of features) {
  for (const cmd of feature.commands || []) {
    commandMap.set(cmd.data.name, cmd);
  }
  if (feature.init) feature.init(client);
}

// ---- Register slash commands ----
client.once(Events.ClientReady, async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
      body: [...commandMap.values()].map(c => c.data.toJSON()),
    });
    console.log(`Logged in as ${client.user.tag} - ${commandMap.size} command(s) registered`);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

// ---- Run slash commands ----
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = commandMap.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (error) {
    console.error('Command error:', error.code || error.message);
    // Interaction expired - there is nothing left to reply to
    if (error.code === 10062 || error.code === 40060) return;
    try {
      const msg = { content: 'Something went wrong.', flags: 64 };
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
      else await interaction.reply(msg);
    } catch (e) {
      console.error('Could not send error reply:', e.code || e.message);
    }
  }
});
  if (!interaction.isChatInputCommand()) return;
  const cmd = commandMap.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (error) {
    console.error(error);
    const msg = { content: 'Something went wrong.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

client.on('error', e => console.error('CLIENT ERROR:', e));
client.on('warn', w => console.warn('WARN:', w));
client.on('shardDisconnect', (e) => console.log('DISCONNECTED, code:', e.code));
client.on('shardReconnecting', () => console.log('Reconnecting...'));
client.login(TOKEN)
  .then(() => console.log('login() ok'))
  .catch(e => console.error('LOGIN FAILED:', e));
process.on('unhandledRejection', err => console.error('Unhandled:', err));

// HTTP server for Render port binding / uptime pings
http
  .createServer((req, res) => {
    res.write('Bot is running online!');
    res.end();
  })
  .listen(process.env.PORT || 3000);
