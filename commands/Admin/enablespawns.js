const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "enablespawns",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "spawn [args]",
  aliases: ["es"],
  run: async(client, message, args) => {
    const guild = await Guild.findOne({ id: message.guild.id });
    if(!guild) {
      const server = new Guild({id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null});
      await server.save();
    }
 
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user){
      return message.reply(`Please pick a starter pokemons using ${nguild.prefix}start`)
    }
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
    if(!args[0]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}enablespawns <true/false>** or **${nguild.prefix || client.config.prefix}es <true/false>**`);
    if(!args[0].toLowerCase().match(/true|false|enable|disable/)) return message.channel.send(`Correct usage: ${nguild.prefix || client.config.prefix}enablespawns <true/false>`)
    nguild.spawnbtn = (args[0].toLowerCase() === "true" || (args[0].toLowerCase() === "enable")) ? true : false;
    await nguild.save();
    return message.channel.send( {embed: {title: `Spawn configuration`, color: 0x00f9ff, description: `Spawn for ${message.guild.name} has been set to \`${nguild.spawnbtn}\``}} );
    
  }
}