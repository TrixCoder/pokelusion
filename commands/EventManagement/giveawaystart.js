const ms = require("ms");
const { MessageEmbed, MessageCollector } = require("discord.js");
const GiveawaySchema = require("./../../models/Giveaway");
//const cooldown = new Map();
const {classToPlain} = require("class-transformer");
const { stripIndentTransformer } = require("common-tags");
const moment = require("moment");
const Guild = require('../../models/guild.js')

async function fetchReactedUsers(reaction, after) {
    const opts = { limit: 100, after };
    const reactions = await reaction.users.fetch(opts);
    if (!reactions.size) return [];
  
    const last = reactions.last().id;
    const next = await fetchReactedUsers(reaction, last);
    return reactions.array().concat(next);
  }

module.exports = {
  name: `giveawaystart`,
  category: 'EventManagement',
  description: `Create  or end or reroll a giveaway.`,
  aliases: ["gstart"],
  usage: 'agiveawaystart <duration> <winnerCount> <prize>',
  run: async (client, message, args) => {
    let msg = message;
    if(!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.some(r => r.name === "Giveaways")) return message.channel.send('You need manage server permission or Giveaways role to use this command')
    
        let emojiID = client.config.emojis;
            let loading, success, fail;
                loading = "👷"
                success = "🎉"
                fail = "🛑"
            

        let nguild = await Guild.findOne({ id: message.guild.id });

        if(!args[0]) {
            return client.embed(message.channel, {
                name: `Giveaway Help Menu`,
                av: message.guild.iconURL({format: "png", dynamic: true})
            }, undefined, `Hey ${message.author}! How to use giveaway cmd? Here's the help for you! \n CMD: ${["create", "end", "reroll"].map(r => `\`${r}\``).join(" ")} \n How to use?: \`${nguild.prefix}giveaway <cmd>\` \n For example: \`${nguild.prefix}giveaway reroll 723906744295751681\`..`, "#F6260C", undefined, {
                name: client.config.footer(),
                av: client.user.avatarURL({format: "png", dynamic: true})
            }).then(c => c.delete({timeout: 30000}));
        }

          let giveawayChannel = message.channel;
          
          const giveawayDuration = ms(args[0]);
          if(!giveawayDuration) return client.embed(message.channel, {
                name: `Please use the correct format: ${nguild.prefix}gstart 10m 1w Coins`,
                av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          if(giveawayDuration < ms("15s") || giveawayDuration > ms("5d")) return message.channel.send({embed: {
                title: 'The giveaway duration must be greater than 30s and less than 5days'
          }}).then(c => c.delete({timeout: 30000}));
          if(!args[0].toLowerCase().match(/[1-60][s,m,h,d]/g)) return client.embed(message.channel, {
                name: `Please use the correct format: ${nguild.prefix}gstart 10m 1w Coins`,
                av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          
          var wfilter = args[1].replace("w", "");
          if(isNaN(wfilter)) return client.embed(message.channel, {
               name: `Please provide correct winners count, correct format: ${nguild.prefix}gstart 10m 3w Pokemons`,
               av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          
          var giveawayNumberWinners = wfilter;
          
          var giveawayPrize = args.join(" ").slice(args[0].length+args[1].length+1);
          if(!giveawayPrize) return client.embed(message.channel, {
               name: `Please provide the giveaway prize, correct format: ${nguild.prefix}gstart 10m 3w Pokemons`,
               av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          
          let secondndCheck = await GiveawaySchema.findOne({id: message.guild.id, channel: giveawayChannel.id, enabled: true});
                    if(secondndCheck) return message.reply(`${fail} There is already a giveaway running in that channel. Please wait for it to finish to run one more there ${fail}.`)
                let embed = new MessageEmbed()
                .setColor("#3F33FF")
                .setTitle(giveawayPrize)
                .setDescription(`Winners: ${giveawayNumberWinners}\nReact with :tada: to enter!\n Hosted By: ${message.author}.`)
                .setFooter(`Ends at`)
                .setTimestamp(Date.now() + giveawayDuration)
                let m = await giveawayChannel.send(embed);
                await m.react("🎉");
                let check = await GiveawaySchema.find({id: message.guild.id, enabled: true});
                if(check.length > 15 && !check(msg.author.id)) {
                    return message.reply(`${fail} You have over 15 giveaways running. Please upgrade to premium to run more or stop a giveaway. ${fail}`)
                }
                const newDOc = new GiveawaySchema({
                  name: 'Giveaway',
                  id: msg.guild.id,
                  channel: giveawayChannel.id,
                  embed: classToPlain(embed),
                  winnerCount: giveawayNumberWinners,
                  time: giveawayDuration + Date.now(),
                  msgId: m.id,
                  enabled: true,
                  host: msg.author.id,
                  prize: giveawayPrize,
                  role: null,
                  type: 'normal'
                });
    
                await newDOc.save().catch(e => console.log(e));    
  },
};
