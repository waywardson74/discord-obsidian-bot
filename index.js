const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);
const VAULT_PATH = "C:\\Users\\dariu\\OneDrive\\Documents\\Mind Palace\\The Mind Palace\\Inbox\\Discord";
// ==================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  console.log("Message received:", message.content);

  if (message.author.bot) return;
  if (message.channel.id !== CHANNEL_ID) return;

  const fs = require('fs');

  // --- DATE ---
  const date = new Date().toISOString().split('T')[0];

  // --- READ EXISTING FILES ---
  const files = fs.readdirSync(VAULT_PATH);

  // --- FILTER TODAY'S ENTRIES ---
  const todayFiles = files.filter(file =>
    file.startsWith("Journal Entry") &&
    file.includes(date) &&
    file.endsWith(".md")
  );

  // --- INCREMENT ---
  const entryNumber = todayFiles.length + 1;

  // --- FILENAME ---
  const filename = `Journal Entry ${entryNumber} - ${date}.md`;

  const filePath = VAULT_PATH + "\\" + filename;

  const content = `---
source: discord
author: ${message.author.username}
channel: ${message.channel.name}
date: ${new Date().toISOString()}
---

# ${message.content.substring(0, 50)}

## Message
${message.content}

## Link
https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}
`;

  console.log("FINAL FILE PATH:", filePath);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`Saved: ${filename}`);
    }
  });
});

client.login(TOKEN);
