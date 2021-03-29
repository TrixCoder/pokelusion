const Discord = require("discord.js");
const mongoose = require("mongoose");
const server = require("./../../models/server");
const User = require("./../../models/user");
module.exports = {
  name: "wipe",
  category: "botowner",
  description: "Blacklist a server or a user",
  usage: "blacklist server <serverid> || blacklist user <userid>",
  run: async(client, message, args, prefix) => {
    let user = message.mentions.members.first() || client.users.cache.get(args[0])
    if(!user) return message.channel.send(`Please type userid or mention user to use. Correct Usage: **${prefix}wipe userid.**`)
      User.findOneAndDelete({id: user.id}, (err, res) => {
      if(err) message.channel.send(err)
        message.channel.send("Done")  
      })
    
    /*else if(user){
      use.findOneAndDelete({id: user.id}, (err, res) => {
      if(err) message.channel.send(err)
        message.channel.send("Done")  
      })
    }*/
  }
}
