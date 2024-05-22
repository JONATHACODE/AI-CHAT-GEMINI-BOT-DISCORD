const fs = require('fs');
const configFilePath = './serverConfigs.json';
const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: 'setup_bot',
  description: 'Setup bot to respond in a specific channel',
  execute(message, args, serverConfigs) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('Anda harus memiliki izin administrator untuk menggunakan perintah ini.');
      }

    if (args.length !== 1) {
      return message.reply('Format yang benar adalah: !setup_bot <channel id>');
    }

    const channelId = args[0];
    serverConfigs[message.guild.id] = { channelId };
    fs.writeFileSync(configFilePath, JSON.stringify(serverConfigs, null, 2));
    message.reply(`Bot telah diatur untuk merespons di saluran dengan ID: ${channelId}`);
  }
};