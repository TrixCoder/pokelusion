const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "prefix",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "spawn [args]",
  aliases: ["px"],
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
    if(!args[0]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}prefix <value>** or **${nguild.prefix || client.config.prefix}px <value>**`)
    let prefix = args.slice(0).join(" ");
    if(prefix.length > 5) return message.channel.send(`Max prefix length is 5 characters`);
    nguild.prefix = prefix;
    await nguild.save();
    return message.channel.send( {embed: {title: `Prefix configuration`,color: 0x00f9ff, description: `Prefix for ${message.guild.name} has been set to \`${nguild.prefix}\``}} );
  }
}