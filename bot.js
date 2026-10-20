// Tier Test Result Bot (discord.js v14)

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes,
} = require('discord.js');
const http = require('http');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1561766637693042798';
const GUILD_ID = '1546430975628542013'; // guild commands appear instantly

const command = new SlashCommandBuilder()
  .setName('tiertest')
  .setDescription('Generate a tier test result card')
  .addStringOption(o => o.setName('player').setDescription('Player name').setRequired(true))
  .addStringOption(o => o.setName('tester').setDescription('Tester name').setRequired(true))
  .addStringOption(o => o.setName('server').setDescription('Server name').setRequired(true))
  .addStringOption(o => o.setName('gamemode').setDescription('Gamemode').setRequired(true))
  .addStringOption(o => o.setName('score').setDescription('Score, e.g. 3-1').setRequired(true))
  .addStringOption(o => o.setName('tier').setDescription('Tier / Rank, e.g. HT3').setRequired(true));

function buildTemplate(v) {
  return [
    '===============',
    `Player: ${v.player}`,
    `Tier tested: ${v.tester}`,
    `Server: ${v.server}`,
    `Gamemode: ${v.gamemode}`,
    '————————————',
    `Match: ${v.tester} ${v.score} ${v.player}`,
    '',
    `Sword rank:: ${v.tier}`,
    `Player: ${v.tester}`,
    `Overall Match Winner: ${v.tester}`,
    `${v.player} New tier achievement in ${v.gamemode}: ${v.tier}`,
    '',
    `${v.player} Thanks for tier testing in White Tier hope you enjoyed`,
  ].join('\n');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: [command.toJSON()],
    });
    console.log(`Logged in as ${client.user.tag} - /tiertest registered`);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'tiertest') return;

  const v = {};
  for (const key of ['player', 'tester', 'server', 'gamemode', 'score', 'tier']) {
    v[key] = interaction.options.getString(key);
  }

  const embed = new EmbedBuilder()
    .setDescription(buildTemplate(v))
    .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(v.player)}/100`)
    .setColor(0x5865f2);

  await interaction.reply({ embeds: [embed] });
});

client.login(TOKEN);

// HTTP Server for Render Port Binding
http.createServer((req, res) => {
  res.write("Bot is running online!");
  res.end();
}).listen(process.env.PORT || 3000);
