const Discord = require("discord.js")
const Guild = require('../../models/guild.js')

module.exports = {
  name: "start",
  category: "Start",
  description: "Use ``.start`` and then pick any pokemon that you want",
  usage: ".start",
  aliases: ["begin"],
  run: async(client, message, args) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    let color = (((1 << 24) * Math.random()) | 0).toString(16); //Generates random hex value.
    const Embed = new Discord.MessageEmbed()
	  .setColor('#05f5fc')
	  .setTitle("Start a new journey")
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setImage("https://i.imgur.com/oSHo1IZ.png")
    .setDescription(`**Welcome to the world of Pokémons!**\nTo begin play, choose one of these pokémon with the \`${nguild.prefix}pick <pokemon>\` command, like this: \`${nguild.prefix}pick charmander\``)
    .addField(`Generation I`,`Bulbasaur | Charmander | Squirtle`)
    .addField(`Generation II`,`Chikorita | Cyndaquil | Totodile`)
    .addField(`Generation III`,`Treecko | Torchic | Mudkip`)
    .addField(`Generation IV`,`Turtwig | Chimchar | Piplup`)
    .addField(`Generation V`,`Snivy | Tepig | Oshawott`)
    .addField(`Generation VI`,`Chespin | Fennekin | Froakie`)
    .addField(`Generation VII`,`Rowlet | Litten | Popplio`)
    .addField(`Generation VIII`,`Grookey | Scorbunny | Sobble`)
    return message.channel.send(Embed);
  }
}