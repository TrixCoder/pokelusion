const Discord = require("discord.js");
const mongoose = require("mongoose");
const server = require("./../../models/server");
const use = require("./../../models/User");

module.exports = {
    name: "unblacklist",
  category: "botowner",
  description: "Unblacklist a server or a user",
  aliases: ["unblk"],
  usage: "unblacklist server <serverid> || unblacklist user <userid>",
    run: async(client, message, args, prefix) => {
    if(!args[0]) return message.channel.send(`Please type server or user to use. Correct Usage: **${prefix}unblacklist <server/user/global> <server id/userid/userid>.**`)
    if(args[0] == "server") {
      let serverid = args[1]
      let guild = client.guilds.cache.get(serverid)
      if(!guild) return message.channel.send(`The id is invalid or i already left it!`);
      server.findOne({name: "server", serverid: serverid}).then(res => {
        if(!res || res == []) {
          return message.channel.send(`Server is already unblacklisted.`);
        }else{
          server.deleteOne({name: "server", serverid: serverid}).catch(() => {});
          message.channel.send(`Unblacklisted server.`);
          client.channels.cache.get(client.config.channels.blacklist).send(`[GUILD] Unblacklisted ${guild.name}. id: ${guild.id}`)
        }
      })
    }
    else if(args[0] == "user") {
      let userid = args[1]
      let user = client.users.cache.get(userid)
      if(!user) return message.channel.send(`The id is invalid or you may not have sent a id.`);
      use.findOne({name: "user", userid: user.id}).then(c => {
        if(!c || c == []) {
          return message.channel.send(`User is already unblacklisted.`)
        }else{
          use.deleteOne({name: "user", userid: user.id}).catch(() => {});
          message.channel.send(`Unblacklisted user.`)
          client.channels.cache.get(client.config.channels.blacklist).send(`[USER] Unblacklisted ${user.tag}. ID: ${user.id}`)
        }
      })
      
    }
}
}
