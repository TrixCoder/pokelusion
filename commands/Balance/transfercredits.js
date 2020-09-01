//var eco = require("discord-economy");
const User = require('../../models/user.js')
const Guild = require('../../models/guild.js')

module.exports = {
  name: "transfercredits",
  category: "Balance",
  description: "Transfers balance",
  usage: ".transfer @user amount",
  aliases: ["tc"],
  run: async(client, message, args) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    var user = message.mentions.users.first()
    var amount = parseInt(args[1].replace("k", "000"))

    if (!user) return message.reply('Please mention a user! Use this command like ``.tc @user amount``.')
    if (!amount) return message.reply('Specify the amount you want to pay! Use this command like ``.tc @user amount``.')
    if (user.id == message.author.id) return message.reply('You cannot trade yourself! Use this command like ``.tc @user amount``.')
    if(message.content.includes(`-`)){
      return message.reply("You can't transfer negative balance")
    }
    let mg = await User.findOne({id: message.author.id});
    let mg1 = await User.findOne({id: message.mentions.users.first().id});
    if(!mg) {
    /*const usr = new User({
      id: user.id,
      balance: 0,
      xp: 0,
      level: 0,
      pokemons: [],
      redeems: 0,
      badges: []
    });
    await usr.save().catch(e => e); */
      return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with .start before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
    }
    if(!mg1) {
    /*const usr1 = new User({
      id: message.mentions.users.first().id,
      balance: 0,
      xp: 0,
      level: 0,
      pokemons: [],
      redeems: 0,
      badges: []
    });
    await usr1.save().catch(e => e); */
      client.embed(message.channel, {
        name: ` | The person you mentioned did not pick a starter`,
        av: message.author.avatarURL({format: "png", dynamic: true})
      })
    } 
      
      if (mg.balance < amount) return message.reply('You have fewer credits than the amount you want to transfer!')
      else{
        const newbal = mg.balance - amount //ok you code
        const newbal1 = mg1.balance + amount
        mg.balance =newbal
        mg1.balance =newbal1
        await mg1.save();
        await mg.save();
        return client.embed(message.channel, undefined, undefined, `<@${message.author.id}> successfully transferred ${amount} pokecoin(s) to <@${user.id}>!`);
        }
      }
    }
