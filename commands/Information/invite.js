const {Client, MessageEmbed} = require("discord.js");

module.exports = {
  name: "invite",
  category: "Which category this command is in",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["inv"],
  run: async(client, message, args) => {
    const EMBED = new MessageEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#05f5fc")
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .addField(
        "🔥 Official Server Link",
    `[Join our offcial server!](https://discord.gg/afF6ut7Vte)`)
      .addField( 
        "🔥 Bot Invite Link",
        `[Invite our bot!](https://discord.com/api/oauth2/authorize?client_id=718445589175599154&permissions=362560&scope=bot)`
      )
    message.channel.send(EMBED)
  }
}