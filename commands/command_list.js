module.exports = {
    name: 'list_commands',
    description: 'Mengirim pesan berisi daftar command yang dimiliki bot',
    execute(message, args) {
      // Daftar command dalam format teks
      const commandListChat = [
        '`!setup_bot <CHANNEL ID>`: Setup bot chat AI untuk merespon pertanyaan di channel id yang di input',
      ];

      const commandList = [
        '`!lempar_dadu`: Lempar dadu dan dapatkan hasil acak dari 1 hingga 6',
        '`!list_commands`: Mengirim pesan berisi daftar command yang dimiliki bot'
      ];
  
      // Kata sambutan dan informasi pengembang
      const welcomeMessage = `Halo! Saya adalah bot yang dikembangkan oleh JONATHA.\n\n` +
                             `PASANG AI CHAT :.\n` +
                             `${commandListChat.join('\n')}\n\n` +
                             `daftar command lain yang bisa Anda gunakan:\n` +
                             `${commandList.join('\n')}\n\n` +
                             `Bergabunglah dengan server Discord pengembang di: https://discord.gg/2gwRR6PF`;
  
      // Mengirim pesan dengan kata sambutan, daftar command, dan informasi pengembang
      message.reply(welcomeMessage);
    }
  };
  