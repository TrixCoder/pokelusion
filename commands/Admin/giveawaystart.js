const {MessageEmbed} = require("discord.js");
const ms = require("ms")    

module.exports = {
  name: "giveawaystart",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "config <prefix/spawnchannel/spawnenable> <newvalue>",
  aliases: ["gstart"],
  run: async(client, message, args) => {
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
    
    
    
  }
}