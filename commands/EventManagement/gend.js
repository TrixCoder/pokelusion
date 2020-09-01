/*const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const GiveawaySchema = require("./../../models/Giveaway");
const cooldown = new Map();
const {classToPlain} = require("class-transformer");
const Guild = require('../../models/guild.js')
module.exports = {
    name: `giveawayend`,
    category: 'EventManagement',
    description: `Create  or end or reroll a giveaway.`,
    aliases: ["gend"],
    usage: 'giveaway create <#channel> <duration> <winnerCount> | giveaway end <messageId>',
    run: async(client, message, args, prefix) => {
      if(!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.some(r => r.name === "Giveaways")) return message.channel.send('You need manage server permission or Giveaways role to use this command')
    
      let nguild = await Guild.findOne({ id: message.guild.id });
    
      if (!args[0]) return message.channel.send(`Invalid syntax! Use this command like: ${nguild.prefix}gend id`);
      
    }
}*/