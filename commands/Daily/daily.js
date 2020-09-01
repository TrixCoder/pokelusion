const Daily = require("./../../models/daily");
const User = require("./../../models/user");
const ms = require('parse-ms');
const Discord = require('discord.js');
const DBL = require("dblapi.js");
const { get } = require('request-promise-native')

module.exports = {
  name: 'daily',
  category: 'Daily',
  run: async(client, message, args) => {
    let timeout = 43200000;
    let user = await User.findOne({id: message.author.id});
    
    if(!user) return message.channel.send(`Pick a starter before using .start command.`);
    let amount = randomInt(250, 500);
    let daily = await Daily.findOne({id: message.author.id})
    let chance = Math.random() * 100;
    const options = {
      url: `https://top.gg/api/bots/552367827370377218/check?userId=${message.author.id}`,
      json: true,
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MjM2NzgyNzM3MDM3NzIxOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk4MTc2NTU4fQ.xkvA3XL1hXbP3eMdn2cS2YybM0DQ0-yu47twbZ0a6Hk'
      }
    };
    if (daily !== null && timeout - (Date.now() - daily.time) > 0) {
      let time = ms(timeout - (Date.now() - daily.time));
      const embed = new Discord.MessageEmbed()
      .setAuthor("Daily Rewards", message.author.displayAvatarURL({dynamic: true}))
      .setDescription(`You already collected your daily reward, you can come back and collect it in ${time.hours}h ${time.minutes}m ${time.seconds}s!`)
      .addField("How it works?", `You can get daily rewards once in every 12hours`)
      .addField("Rewards", `Common: 250-500 pokecoins <:pokecoin:720059437468876843>\nUncommon: 1 redeem`)
      .addField("Our Official Server", `**[Click Here to Join!](https://discord.gg/YvKnXaA)**`)
      .setColor("#05f5fc")
      return message.channel.send(embed)
    }
    get(options).then(async body => { 
      if(body.voted == 1){
        if(chance < 1/client.guilds.cache.size) {
          user.redeems = user.redeems + 1;
          await user.save()
          message.reply(`You got a redeem by using daily command`);
        }else{
          user.balance = user.balance + amount
          await user.save()
          message.reply(`You got ${amount} pokecoin(s)<:pokecoin:720059437468876843> from daily command. Come back in 12 hours to get more.`);
        }
    
        let newDoc = new Daily({
          id: user.id,
          time: Date.now()
        });
    
        if(daily) await Daily.deleteOne({id: message.author.id});
    
        await newDoc.save().catch(console.error);
        return
      }
      else{
        return message.reply("You didn't vote our bot yet please vote it on https://top.gg/bot/552367827370377218/vote then try again.")
      }
    });
  }
}
  
    function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
  
