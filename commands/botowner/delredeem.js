const User = require('../../models/user.js')
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "delredeem",
  category: "botowner",
  description: "Delete redeem",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["dr"],
  run: async(client, message, args) => {
    let amount = parseInt(args[1])
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(a=>a.displayName.includes(args[0]))
    if(!member) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't mention a user`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
    if(!amount) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't specify amount.`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
   let user = await User.findOne({id: member.user.id})
   if(!user || !user.pokemons[0]) return message.channel.send("User You Mentioned Did not Pick a Starter They Need To Pick First")
    user.redeems = user.redeems-amount
    await user.save().catch(er=>console.log(er))
    return message.channel.send(new MessageEmbed().setAuthor(` | Removed ${amount} redeem(s) from ${member.user.tag}'s inventory.`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
}
}