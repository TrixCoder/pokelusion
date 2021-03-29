const ms = require("ms");
const { MessageEmbed, MessageCollector } = require("discord.js");
const GiveawaySchema = require("./../../models/Giveaway");
//const cooldown = new Map();
const {classToPlain} = require("class-transformer");
const { stripIndentTransformer } = require("common-tags");
const moment = require("moment");
const Guild = require('../../models/guild.js');
const User = require('../../models/user.js')


async function fetchReactedUsers(reaction, after) {
    const opts = { limit: 100, after };
    const reactions = await reaction.users.fetch(opts);
    if (!reactions.size) return [];
  
    const last = reactions.last().id;
    const next = await fetchReactedUsers(reaction, last);
    return reactions.array().concat(next);
  }

module.exports = {
  name: `agstart`,
  category: 'EventManagement',
  description: `Create  or end or reroll a giveaway.`,
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
            }, undefined, `Hey ${message.author}! How to use giveaway cmd? Here's the help for you! \n Command: ${nguild.prefix}agstart <time> <winners> <prize>`, "#F6260C", undefined, {
                name: client.config.footer(),
                av: client.user.avatarURL({format: "png", dynamic: true})
            }).then(c => c.delete({timeout: 30000}));
        }

          let giveawayChannel = message.channel;
          
          const giveawayDuration = ms(args[0]);
          if(!giveawayDuration) return client.embed(message.channel, {
                name: `Please use the correct format: ${nguild.prefix}agstart 10m 1w 100pokecoins`,
                av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          if(giveawayDuration < ms("15s") || giveawayDuration > ms("5d")) return message.channel.send({embed: {
                title: 'The giveaway duration must be greater than 30s and less than 5days'
          }}).then(c => c.delete({timeout: 30000}));
          if(!args[0].toLowerCase().match(/[1-60][s,m,h,d]/g)) return client.embed(message.channel, {
                name: `Please use the correct format: ${nguild.prefix}agstart 10m 1w 100pokecoins`,
                av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          
          var wfilter = args[1].replace("w", "");
          if(isNaN(wfilter)) return client.embed(message.channel, {
               name: `Please provide correct winners count, correct format: ${nguild.prefix}agstart 10m 3w Pokemons`,
               av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
          
          var giveawayNumberWinners = wfilter;
          
          var giveawayPrize = args.join(" ").slice(args[0].length+args[1].length+1);
          if(!giveawayPrize) return client.embed(message.channel, {
               name: `Please provide the giveaway prize, correct format: ${nguild.prefix}gstart 10m 3w Pokemons`,
               av: message.guild.iconURL({format: "png", dynamic: true})
          }).then(c => c.delete({timeout: 30000}));
        let prize = giveawayPrize;

    
    
      let secondndCheck = await GiveawaySchema.findOne({id: message.guild.id, channel: giveawayChannel.id, enabled: true});
      if(secondndCheck) return message.reply(`${fail} There is already a giveaway running in that channel. Please wait for it to finish to run one more there ${fail}.`)
              
    
             if(prize.includes(`-`)){
      return message.reply("You can't giveaway negative stuff")
    }
    if(prize.endsWith("c")){
        var amount = prize.replace("c","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("credits")){
        var amount = prize.replace("credits","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("coin")){
        var amount = prize.replace("coins","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("pokecoin")){
        var amount = prize.replace("pokecoins","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("coins")){
        var amount = prize.replace("coins","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("pokecoins")){
        var amount = prize.replace("pokecoins","").replace("k", "000")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.balance < ra) return message.reply('You have fewer credits than the amount you want to giveaway!')
        else{
          const newbal = mg.balance - ra //ok you code
          mg.balance =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.redeems < ra) return message.reply('You have fewer redeem(s) than the amount you want to giveaway!')
        else{
          const newbal = mg.redeems - ra
          mg.redeems =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.redeems < ra) return message.reply('You have fewer redeem(s) than the amount you want to giveaway!')
        else{
          const newbal = mg.redeems - ra
          mg.redeems =newbal
          await mg.save();
        }
    }
    if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        amount = wfilter * amount
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.redeems < ra) return message.reply('You have fewer redeem(s) than the amount you want to giveaway!')
        else{
          const newbal = mg.redeems - ra
          mg.redeems =newbal
          await mg.save();
        }
    }
    
      let embed = new MessageEmbed()
                .setColor("#05f5fc")
                .setTitle(giveawayPrize)
                .setDescription(`Winner(s): ${giveawayNumberWinners}\nReact with :tada: to enter!\n Hosted By: ${message.author}.`)
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
                  type: 'automatic'
                });
    
                await newDOc.save().catch(e => console.log(e));   
  },
};
