const { Client, MessageEmbed, version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require("os");
let cpuStat = require("cpu-stat");
const ms = require("ms");
const v = require("./../../package.json");

module.exports = {
  name: "ping",
  category: "Information",
  description: "Know about the bot and bot developers",
  aliases: ["pg", "png"],
  run: async(client, message, args) => {
    let embed = new MessageEmbed()
      .setTitle("Ping!")
      .setDescription(`Pinging...`)
      .setThumbnail(message.author.avatarURL({dynamic: true}))
      .setColor("#00ff27")
      .setTimestamp()
      const m = await message.channel.send(embed)
      embed.setDescription(`Bot ping: ${m.createdTimestamp - message.createdTimestamp}ms\nDiscord API Latency: ${Math.round(client.ws.ping)}ms`)
      if(m.createdTimestamp - message.createdTimestamp > 800){
        embed.setColor("#F4150A")
      }
      else if(m.createdTimestamp - message.createdTimestamp > 120){
        embed.setColor("#FFFF00")
      }
      else{
        embed.setColor("#00ff27")
      }
      return m.edit(embed);
  }}