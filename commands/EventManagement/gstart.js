const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const Guild = require('../../models/guild.js')

module.exports = {
  name: `giveawaystart`,
  category: 'EventManagement',
  description: `Create  or end or reroll a giveaway.`,
  aliases: ["gstart"],
  usage: 'giveaway create <#channel> <duration> <winnerCount> | giveaway end <messageId>',
  run: async (bot, message, args) => {
    if(!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.some(r => r.name === "Giveaways")) return message.channel.send('You need manage server permission or Giveaways role to use this command')
    
    let nguild = await Guild.findOne({ id: message.guild.id });
    
    if (!args[0]) return message.channel.send(`You did not specify your time! Use this command like: ${nguild.prefix}gstart 15s <prize>`);
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m") &&
      !args[0].endsWith("s")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time! Use this command like: ${nguild.prefix}gstart 15s <prize>`
      );
    if (isNaN(args[0][0])) return message.channel.send(`That is not a number!`);
    let prize = args.slice(1).join(" ");
    if (!prize) return message.channel.send(`No prize specified! Use this command like: ${nguild.prefix}gstart 15s <prize>`);
    let Embed = new MessageEmbed()
      .setTitle(`${prize}`)
      .setDescription(
        `React with :tada: to enter!\nHosted by: ${message.author}`
      )
      .setFooter(`Ends at`)
      .setTimestamp(Date.now() + ms(args[0]))
      .setColor(`#05f5fc`);
    let m1 = await message.channel.send(`**🎁Giveaway Started🎁**`);
    let m = await message.channel.send(Embed);
    m.react("🎉");
    setTimeout(() => {
      if (m.reactions.cache.get("🎉").count <= 1) {
        message.channel.send(`Reactions: ${m.reactions.cache.get("🎉").count}`);
        return message.channel.send(
          `Not enough people reacted for me to start draw a winner!`
        );
      }

      let winner = m.reactions.cache
        .get("🎉")
        .users.cache.filter((u) => !u.bot)
        .random();
      let Embed = new MessageEmbed()
      .setTitle(`${prize}`)
      .setDescription(
        `Winner: ${winner}\nHosted by: ${message.author}`
      )
      .setFooter(`Ended at`)
      .setTimestamp(Date.now())
      .setColor(`#05f5fc`);
      m1.edit(`**🎁Giveaway Ended🎁**`)
      m.edit(Embed);
      message.channel.send(
        `Congratulations ${winner}! You won the **${prize}**!`
      );
    }, ms(args[0]));
  },
};
