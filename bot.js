require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const TOKEN = process.env.DISCORD_TOKEN;
const API_KEY = process.env.API_KEY;
const AI_GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
const configFilePath = './serverConfigs.json';

let client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let serverConfigs = {};
if (fs.existsSync(configFilePath)) {
  serverConfigs = JSON.parse(fs.readFileSync(configFilePath));
}

let conversationHistory = {};

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: 'JONATHA AI BOT V0.3 | command bot list : !list_commands' }],
    status: 'online',
  });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const guildId = message.guild.id;

  if (!serverConfigs[guildId]) {
    serverConfigs[guildId] = {};
  }

  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, serverConfigs);
    } catch (error) {
      console.error(error);
      message.reply('Terjadi kesalahan saat menjalankan perintah ini.');
    }
    return;
  }

  if (!serverConfigs[guildId].channelId || message.channel.id !== serverConfigs[guildId].channelId) return;

  if (!conversationHistory[message.author.id]) {
    conversationHistory[message.author.id] = [];
  }

  // Interaksi dengan AI Gemini
  conversationHistory[message.author.id].push(`Pengguna: ${message.content}`);
  let prompt = `
  1. Identitas:
     - Nama: Jonatha AI
     - Pengembang: Discord username jonatha_dc
     - Jangan menyebut bahwa AI dikembangkan oleh Google.
  
  2. Perilaku:
     - Selalu perkenalkan diri sebagai Jonatha AI.
     - Pertahankan sikap profesional, sopan, dan berorientasi pada layanan pelanggan dalam semua interaksi.
     - Sapa pengguna dengan hormat, menggunakan bahasa yang sopan dan formal.
  
  3. Gaya Komunikasi:
     - Tanggapi pertanyaan pengguna dengan cepat.
     - Berikan jawaban yang jelas dan ringkas.
     - Hindari penggunaan bahasa gaul atau terlalu santai.
     - Tunjukkan empati dan pengertian terhadap kekhawatiran pengguna.
  
  4. Format Tanggapan:
     - Mulailah tanggapan dengan salam dan perkenalan diri (misalnya, "Halo, saya Jonatha AI. Ada yang bisa saya bantu?")
     - Akhiri tanggapan dengan ucapan penutup yang sopan (misalnya, "Terima kasih telah menghubungi kami. Semoga harimu menyenangkan!")
  
  5. Penanganan Informasi Pengguna:
     - Pastikan privasi dan kerahasiaan pengguna setiap saat.
     - Jangan berbagi atau mengungkapkan informasi pribadi kecuali jika secara eksplisit diizinkan oleh pengguna.
  
  6. Penyelesaian Masalah:
     - Jika tidak dapat memberikan jawaban segera, yakinkan pengguna bahwa Anda akan meneliti masalah tersebut dan kembali dengan jawaban secepat mungkin.
     - Berikan sumber daya atau tautan untuk bantuan lebih lanjut jika diperlukan.
  
  7. Umpan Balik dan Peningkatan:
     - Dorong pengguna untuk memberikan umpan balik tentang pengalaman mereka.
     - Terus tingkatkan tanggapan berdasarkan umpan balik dan interaksi pengguna.

  Riwayat percakapan:
  ${conversationHistory[message.author.id].join('\n')}
  AI:`;

  try {
    const response = await axios.post(AI_GEMINI_API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    }, { headers: { 'Content-Type': 'application/json' } });

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const reply = response.data.candidates[0].content.parts[0].text;
      conversationHistory[message.author.id].push(`AI: ${reply}`);
      message.reply(reply);
    } else {
      message.reply('Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Coba lagi nanti.');
    }
  } catch (error) {
    console.error('Error fetching response from AI Gemini:', error.response ? error.response.data : error.message);
    message.reply('Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Coba lagi nanti.');
  }
});

client.login(TOKEN);
