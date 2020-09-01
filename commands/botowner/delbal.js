const User = require('../../models/user.js')
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "delbal",
  category: "botowner",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["db"],
  run: async(client, message, args) => {
var amount = parseInt(args[1]);
      var user = message.mentions.users.first()
      if(!user) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't mention a user`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
      if(!amount) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't specify amount.`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
    let mg = await User.findOne({id: user.id});
    if(!mg) return message.channel.send("User You Mentioned Didn't Picked Starter They Need To Pick First")
    if(mg.balance < amount) amount = mg.balance
        mg.balance = mg.balance - amount
        await mg.save();
        return message.channel.send(new MessageEmbed().setAuthor(` | Removed ${amount} pokecredits from ${user.tag}'s balance`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
}
}