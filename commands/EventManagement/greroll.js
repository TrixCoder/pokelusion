const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const GiveawaySchema = require("./../../models/Giveaway");
const cooldown = new Map();
const {classToPlain} = require("class-transformer");
module.exports = {
    name: `giveawayreroll`,
    category: 'EventManagement',
    description: `Create  or end or reroll a giveaway.`,
    aliases: ["greroll"],
    usage: 'giveaway create <#channel> <duration> <winnerCount> | giveaway end <messageId>',
    run: async(client, msg, args, prefix) => {
      const message = msg;
        let emojiID = client.config.emojis;
            let loading, success, fail;
                loading = "👷"
                success = "🎉"
                fail = "🛑"
        if(!args[0] || !message.channel.messages.fetch(args[0])) {
                return message.channel.send(`${fail} Invalid Message Id Given. Either not provided or doesn't exist in the channel.`);
            }
            let result = await GiveawaySchema.findOne({id: message.guild.id, channel: message.channel.id, msgId: msg.id, enabled: false});

            if(!result) return message.channel.send(`${fail} No Giveaway ended with that message id.`);

            let embed = new MessageEmbed(result.embed)

            
   const users = await msg.reactions.cache.get("🎉").users.fetch();
   const list = await users.array().filter(u =>  u.bot !== true);

   if (!list.length) {
    /*try {
        clearInterval(client.collector.get(result.msgId));
      }catch(e)
       {} */
    embed.description = `Winner: No one.`;
    embed.footer.text = `Giveaway Finished`;

    await GiveawaySchema.deleteOne({id: result.id, enabled: true, channel: result.channel, msgId: result.msgId})
    return msg.edit(embed);
}

            let winners = [];
for (let i = 0; i < result.winnerCount; i++) {
  const x = client.draw(list);

  if (!winners.includes(x)) winners.push(x);
}

embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;


await msg.edit(embed);
result.enabled = false
/*try {
  clearInterval(client.collector.get(result.msgId));
}catch(e)
 {} */
 await result.save().catch(e => console.log(e))
if (winners.length) msg.channel.send(`Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${result.prize}**!`);

    }
}