const Discord = require("discord.js")
const User = require('../../models/user.js');

module.exports = {
  name: "bal",
  category: "Balance",
  description: "Shows balance of command user in pokecredits",
  usage: ".bal",
  aliases: ["b"],
  run: async(client, message, args) => {
    let user = await User.findOne({id: message.author.id});
    if(!user) {
    /*const usr = new User({
      id: message.author.id,
      balance: 0,
      xp: 0,
      level: 0,
      pokemons: [],
      redeems: 0,
      badges: []
    });
    await usr.save().catch(e => e); */
    return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with .start before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
  };
  //  console.log(user)
    const Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`${message.author.tag}'s balance`)
      .setDescription(`Balance: ${user.balance} Pokecoin(s) <:pokecoin:793021308983050280>`)
	    .setThumbnail(message.author.avatarURL({dynamic: true}))
      message.channel.send(Embed);    
    
  }
}