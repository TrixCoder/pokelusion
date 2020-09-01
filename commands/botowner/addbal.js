const User = require('../../models/user.js')
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "addbal",
  category: "botowner",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["ab"],
  run: async(client, message, args) => {
      var amount = parseInt(args[1]);
      var user = message.mentions.users.first()
      if(!user) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't mention a user`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
      if(!amount) return message.channel.send(new MessageEmbed().setAuthor(` | You didn't specify amount.`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
    let mg = await User.findOne({id: user.id});
    if(!mg) return message.channel.send("User You Mentioned Did not Pick a Starter They Need To Pick First")
        mg.balance = mg.balance + amount
        await mg.save();
        message.channel.send(new MessageEmbed().setAuthor(` | Add ${amount} pokecredits in ${user.tag}'s balance`, message.author.avatarURL({format: "png", dynamic: true})).setColor("#05f5fc"))
}
}