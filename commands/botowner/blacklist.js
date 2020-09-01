const Discord = require("discord.js");
const mongoose = require("mongoose");
const server = require("./../../models/server");
const use = require("./../../models/User");
module.exports = {
  name: "blacklist",
  category: "botowner",
  description: "Blacklist a server or a user",
  aliases: ["blk"],
  usage: "blacklist server <serverid> || blacklist user <userid>",
  run: async(client, message, args, prefix) => {

    if(!args[0]) return message.channel.send(`Please type server or user to use. Correct Usage: **${prefix}blacklist <server/user/global> <server id/userid/userid>.**`)
    if(args[0] == "server") {
      let serverid = args[1]
      let guild = client.guilds.get(serverid)
      if(!guild) return message.channel.send(`The id is invalid or i already left it!`);
      server.findOne({name: "server", serverid: serverid}).then(res => {
        if(!res || res == []) {
          let newDoc = new server({
            _id: new mongoose.Types.ObjectId(),
            name: "server",
            server: guild.id,
            blacklist: true
          })
          newDoc.save().catch(console.error)
          message.channel.send(`Blacklisted server!`).then(c => c.react("✅"))
          client.channels.cache.get(client.config.channels.blacklist).send(`[GUILD] Blacklisted ${guild.name}. id: ${guild.id}`)
        }else{
          message.channel.send(`That server is already blacklisted.`)
        }
      })
    }
   else if(args[0] == "user") {
      let userid = args[1]
      let user = client.users.cache.get(userid)
      if(!user) return message.channel.send(`The id is invalid or you may not have sent a id.`);
      if(client.config.owners.includes(userid)) return message.channel.send(`You can't blacklist devs!`);
      use.findOne({name: "user", userid: user.id}).then(c => {
        if(!c || c == []) {
          let newDoc = new use({
            _id: new mongoose.Types.ObjectId(),
            name: "user",
            userid: user.id,
            blacklist: true
          })
          newDoc.save().catch(console.error)
          message.channel.send(`Blacklisted user!`).then(c => c.react("✅"))
          client.channels.cache.get(client.config.channels.blacklist).send(`[USER] Blacklisted ${user.tag}. ID: ${user.id}`)
        }else{
          message.channel.send(`User is already blacklisted`)
        }
      })
      
    }
}
}
