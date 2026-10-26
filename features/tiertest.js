// /tiertest - generates the tier test result card
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
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
    `Tester: ${v.tester}`,
    `Server: ${v.server}`,
    `Gamemode: ${v.gamemode}`,
    '————————————',
    `Match: ${v.tester} ${v.score} ${v.player}`,
    '',
    `${v.gamemode} rank: ${v.tier}`,
    `Player: ${v.tester}`,
    `Overall Match Winner: ${v.tester}`,
    `${v.player} New tier achievement in ${v.gamemode}: ${v.tier}`,
    '',
    `${v.player} Thanks for tier testing in White Tier hope you enjoyed`,
  ].join('\n');
}

async function execute(interaction) {
  const v = {};
  for (const key of ['player', 'tester', 'server', 'gamemode', 'score', 'tier']) {
    v[key] = interaction.options.getString(key);
  }

  const embed = new EmbedBuilder()
    .setDescription(buildTemplate(v))
    .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(v.player)}/100`)
    .setColor(0x5865f2);

  await interaction.reply({ content: '@everyone @here', embeds: [embed] });
}

module.exports = { commands: [{ data, execute }] };
