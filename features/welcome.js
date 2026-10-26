// Welcome message when someone joins
const { EmbedBuilder, Events } = require('discord.js');
const config = require('../config');

module.exports = {
  init(client) {
    client.on(Events.GuildMemberAdd, async member => {
      const channel = member.guild.channels.cache.get(config.WELCOME_CHANNEL_ID);
      if (!channel) {
        console.log('Welcome channel not found - check WELCOME_CHANNEL_ID in config.js');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Welcome to White Tier!')
        .setDescription(
          `Hey <@${member.id}>, glad to have you here!\n\n` +
          `You are member #${member.guild.memberCount}.\n` +
          `Check the rules and get ready for your tier test.`
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(0x5865f2);

      await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    });
  },
};
