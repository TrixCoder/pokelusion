module.exports = {
  name: "restart",
  category: "special",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["rt"],
  run: async(client, message, args) => {
     await message.channel.send("Restarted bot")
     await console.log(`${message.author.tag} used the restart command`)
     return process.exit(1);
  }
}