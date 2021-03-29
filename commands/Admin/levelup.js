const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "levelup",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "spawn [args]",
  aliases: ["lu"],
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
    let levelup = ''
    if(user.levelupbtn == false){ levelup = "`Disabled`" }else{ levelup = "`Enabled`"}
    if(!args[0]){
      return message.channel.send( {embed: {title: `Levelup`, color: 0x00f9ff,
        description: `\`${levelup}\``
      }} );
    } 
    if(!args[0].toLowerCase().match(/true|false|enable|disable/)) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}levelup <true/false>** or **${nguild.prefix || client.config.prefix}lu <true/false>**`);
    user.levelupbtn = (args[0].toLowerCase() === "true" || (args[0].toLowerCase() === "enable")) ? true : false;
    await user.save()
    return message.channel.send( {embed: {title: `Levelup configuration`, color: 0x00f9ff, description: `Levelup messages for <@${message.author.id}> has been set to \`${user.levelupbtn ? true : false}\``}} );
  }
}