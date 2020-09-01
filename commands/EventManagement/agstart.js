const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const Guild = require('../../models/guild.js')
const User = require('../../models/user.js')

module.exports = {
  name: `advancedgiveawaystart`,
  category: 'EventManagement',
  description: `Create  or end or reroll a giveaway.`,
  aliases: ["agstart"],
  usage: 'agiveaway create <#channel> <duration> <winnerCount> | giveaway end <messageId>',
  run: async (bot, message, args) => {
    if(!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.some(r => r.name === "Giveaways")) return message.channel.send('You need manage server permission or Giveaways role to use this command')
    
    let nguild = await Guild.findOne({ id: message.guild.id });
    const user = await User.findOne({id: message.author.id});
    if(!user) return message.channel.send(`You must pick a starter to use this command.`);
    if (!args[0]) return message.channel.send(`You did not specify your time! Use this command like: ${nguild.prefix}agstart 15s <prize>`);
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m") &&
      !args[0].endsWith("s")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time! Use this command like: ${nguild.prefix}agstart 15s <prize>`
      );
    if (isNaN(args[0][0])) return message.channel.send(`That is not a number!`);
    let prize = args.slice(1).join(" ");
    if (!prize) return message.channel.send(`No prize specified! Use this command like: ${nguild.prefix}agstart 15s <prize>`);
    if(prize.includes(`-`)){
      return message.reply("You can't giveaway negative stuff")
    }
    if(prize.endsWith("c")){
        var amount = prize.replace("c","").replace("k", "000")
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
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        if (mg.redeems < ra) return message.reply('You have fewer redeem(s) than the amount you want to giveaway!')
        else{
          const newbal = mg.redeems - ra
          mg.redeems =newbal
          await mg.save();
        }
    }
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
    setTimeout(async() => {
      if (m.reactions.cache.get("🎉").count <= 1) {
        let Embed = new MessageEmbed()
        .setTitle(`${prize}`)
        .setDescription(
          `Could not determine a winner!\nHosted by: ${message.author}`
        )
        .setFooter(`Ended at`)
        .setTimestamp(Date.now())
        .setColor(`#05f5fc`);
        m1.edit(`**🎁Giveaway Ended🎁**`)
        m.edit(Embed);
        if(prize.endsWith("c")){
          var amount = prize.replace("c","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("credits")){
          var amount = prize.replace("credits","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("coins")){
          var amount = prize.replace("coins","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("pokecoins")){
          var amount = prize.replace("pokecoins","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("coin")){
          var amount = prize.replace("coin","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("pokecoin")){
          var amount = prize.replace("pokecoin","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        return message.channel.send(
          `Not enough people reacted, so I was unable to find a winner!`
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
      await m1.edit(`**🎁Giveaway Ended🎁**`)
      await m.edit(Embed);
      let newWinner = await message.channel.send(
        `Congratulations ${winner}! You won the **${prize}**!`
      );
      const usr = await User.findOne({id: winner.id});
      if(!usr || usr == null){
        message.channel.send(`${winner} didn't pick a starter.`);
        await newWinner.edit(`Finding new winner...`)
        let nwinner = m.reactions.cache
        .get("🎉")
        .users.cache.filter((u) => !u.bot && !u.id === winner.id)
        .random();
        if (m.reactions.cache.get("🎉").count <= 1) {
        let Embed = new MessageEmbed()
        .setTitle(`${prize}`)
        .setDescription(
          `Could not determine a winner!\nHosted by: ${message.author}`
        )
        .setFooter(`Ended at`)
        .setTimestamp(Date.now())
        .setColor(`#05f5fc`);
        await m1.edit(`**🎁Giveaway Ended🎁**`)
        await m.edit(Embed);
        if(prize.endsWith("c")){
          var amount = prize.replace("c","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("credits")){
          var amount = prize.replace("credits","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("coins")){
          var amount = prize.replace("coins","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("pokecoins")){
          var amount = prize.replace("pokecoins","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("coin")){
          var amount = prize.replace("coin","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("pokecoin")){
          var amount = prize.replace("pokecoin","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        } 
        if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        return message.channel.send(
          `Not enough people reacted, so I was unable to find a winner!`
        );
      }
      let Embed = new MessageEmbed()
      .setTitle(`${prize}`)
      .setDescription(
        `Winner: ${nwinner}\nHosted by: ${message.author}`
      )
      .setFooter(`Ended at`)
      .setTimestamp(Date.now())
      .setColor(`#05f5fc`);
      await m1.edit(`**🎁Giveaway Ended🎁**`)
      await m.edit(Embed);
      await newWinner.edit(
        `Congratulations ${nwinner}! You won the **${prize}**!`
      );
      if(!nwinner == undefined){
      if(prize.endsWith("c")){
        var amount = prize.replace("c","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("credits")){
        var amount = prize.replace("credits","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("coins")){
        var amount = prize.replace("coins","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("pokecoins")){
        var amount = prize.replace("pokecoins","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("coin")){
        var amount = prize.replace("coin","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("pokecoin")){
        var amount = prize.replace("pokecoin","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
      if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
      if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: nwinner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
        return
      }
      else{
        let Embed = new MessageEmbed()
        .setTitle(`${prize}`)
        .setDescription(
          `Could not determine a winner!\nHosted by: ${message.author}`
        )
        .setFooter(`Ended at`)
        .setTimestamp(Date.now())
        .setColor(`#05f5fc`);
        await m1.edit(`**🎁Giveaway Ended🎁**`)
        await m.edit(Embed);
        if(prize.endsWith("c")){
          var amount = prize.replace("c","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("credits")){
          var amount = prize.replace("credits","").replace("k", "000")
          var ra = parseInt(amount)
          let mg = await User.findOne({id: message.author.id});
          const newbal = mg.balance + ra
          mg.balance =newbal
          await mg.save();
        }
        if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: message.author.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
        }
        return await newWinner.edit(
        `Could not determine a winner!`
      );
      }
      }
      if(prize.endsWith("c")){
        var amount = prize.replace("c","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: winner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("credits")){
        var amount = prize.replace("credits","").replace("k", "000")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: winner.id});
        const newbal = mg.balance + ra
        mg.balance =newbal
        await mg.save();
      }
      if(prize.endsWith("redeems")){
        var amount = prize.replace("redeems","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: winner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
      if(prize.endsWith("redeem")){
        var amount = prize.replace("redeem","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: winner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
      if(prize.endsWith("r")){
        var amount = prize.replace("r","")
        var ra = parseInt(amount)
        let mg = await User.findOne({id: winner.id});
        const newbal = mg.redeems + ra
        mg.redeems =newbal
        await mg.save();
      }
      return
    }, ms(args[0]));
  },
};
