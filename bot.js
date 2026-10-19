// Tier Test Result Bot (discord.js v14)
// Setup:
//   1) npm init -y
//   2) npm install discord.js
//   3) Fill in TOKEN, CLIENT_ID, GUILD_ID below
//   4) node bot.js

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes,
} = require('discord.js');

const TOKEN = 'MTU2MTc2NjYzNzY5MzA0Mjc5OA.G7kbTs.tvU5a5IQ1dGxr0CEfqPMcRVK43QJ1f9C-zFsEA';
const CLIENT_ID = '1561766637693042798';
const GUILD_ID = '1546430975628542013'; // guild commands appear instantly

// Optional: maps tier_color text to the embed's side-bar color
const COLOR_MAP = {
  red: 0xe74c3c,
  orange: 0xe67e22,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  blue: 0x3498db,
  purple: 0x9b59b6,
  pink: 0xff69b4,
  gold: 0xffd700,
  silver: 0xc0c0c0,
  bronze: 0xcd7f32,
  white: 0xffffff,
  black: 0x111111,
};

const command = new SlashCommandBuilder()
  .setName('tiertest')
  .setDescription('Generate a tier test result card')
  .addStringOption(o => o.setName('player').setDescription('Player name').setRequired(true))
  .addStringOption(o => o.setName('tester').setDescription('Tester name').setRequired(true))
  .addStringOption(o => o.setName('server').setDescription('Server name').setRequired(true))
  .addStringOption(o => o.setName('gamemode').setDescription('Gamemode').setRequired(true))
  .addStringOption(o => o.setName('score').setDescription('Score, e.g. 3-1').setRequired(true))
  .addStringOption(o => o.setName('sword_rank').setDescription('Sword rank').setRequired(true))
  .addStringOption(o => o.setName('new_tier').setDescription('New tier, e.g. HT3').setRequired(true))
  .addStringOption(o => o.setName('tier_color').setDescription('Tier color, e.g. gold').setRequired(true));

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
    `Sword rank:: ${v.sword_rank}`,
    `Player: ${v.tester}`,
    `Overall Match Winner: ${v.tester}`,
    `${v.player} New tier achievement in ${v.gamemode}: ${v.new_tier}`,
    '',
    `${v.player} Thanks for tier testing in ${v.tier_color} tier hope you enjoyed`,
  ].join('\n');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
    body: [command.toJSON()],
  });
  console.log(`Logged in as ${client.user.tag} - /tiertest registered`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'tiertest') return;

  const v = {};
  for (const key of [
    'player', 'tester', 'server', 'gamemode',
    'score', 'sword_rank', 'new_tier', 'tier_color',
  ]) {
    v[key] = interaction.options.getString(key);
  }

  const embed = new EmbedBuilder()
    .setDescription(buildTemplate(v))
    .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(v.player)}/100`)
    .setColor(COLOR_MAP[v.tier_color.toLowerCase()] ?? 0x5865f2);

  await interaction.reply({ embeds: [embed] });
});

client.login(TOKEN);
