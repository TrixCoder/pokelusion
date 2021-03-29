const { Client, MessageEmbed, version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require("os");
let cpuStat = require("cpu-stat");
const ms = require("ms");
const v = require("./../../package.json");

module.exports = {
  name: "botinfo",
  category: "Information",
  description: "Know about the bot and bot developers",
  aliases: ["faq", "help", "stats", "bi"],
  run: async(client, message, args) => {
      var ping = Date.now() - message.createdTimestamp + " ms";
      if(Date.now() - message.createdTimestamp > 1000){
        ping += "\n(Because of discord api issues ping is being high)"
      }
      let members = client.guilds.cache.map(g => g).reduce((prev, val) => val.memberCount + prev, 0);
      let channels = client.guilds.cache.map(g => g).reduce((prev, val) => val.channels.cache.size + prev, 0);
      const embedStats = new MessageEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor("#05f5fc")
.addField("🛰 Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() /1024 /1024).toFixed(2)} MB`, true)
      .addField("👤 Users", `${members.toLocaleString()}`, true)
      .addField("🏠 Servers", `${client.guilds.cache.size.toLocaleString()}`, true)
      .addField("#️⃣ Channels ", `${channels.toLocaleString()}`, true)
      .addField("📚 Library", `Discord.js v${version}`, true)
      .addField("🗒 Node", `${process.version}`, true)
      .addField("🤖 API Latency", `${ping}`) // discord.js is v11 ws.ping wont work
      .addField(
        "🔥 Official Server Link",
    `[Join our offcial server!](https://discord.gg/aNqdfpp)`)
      .addField( 
        "🔥 Bot Invite Link",
        `[Invite our bot!](https://discord.com/api/oauth2/authorize?client_id=552367827370377218&permissions=362560&scope=bot)`
      )
      .addField(
        "🛠 Developers",
        client.config.owners.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .addField(
        "🛠 Official Server Developer",
        client.config.osdev.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .addField(
        "🛠 Database Developer",
        client.config.dbdevs.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .addField(
        "🎨 Helper",
        client.config.helpers.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .addField(
        "First Donator",
        client.config.fd.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .addField(
        "Top Donator",
        client.config.td.map(r => client.users.cache.get(r).tag).join("\n"), true
      )
      .setThumbnail(message.author.avatarURL({dynamic: true}))
    message.channel.send(embedStats)
    
  }}