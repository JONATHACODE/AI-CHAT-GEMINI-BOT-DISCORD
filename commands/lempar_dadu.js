module.exports = {
  name: 'lempar_dadu',
  description: 'Lempar dadu dan dapatkan hasil acak dari 1 hingga 6',
  execute(message, args) {
    // Menghasilkan angka acak dari 1 hingga 6
    const hasilDadu = Math.floor(Math.random() * 6) + 1;

    // Mengirim pesan dengan hasil lemparan dadu
    message.reply(`Anda melempar dadu dan mendapatkan angka: ${hasilDadu}`);
  }
};
