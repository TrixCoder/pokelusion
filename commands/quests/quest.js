const quests = require("./../../db/quest");
const {MessageEmbed} = require("discord.js");
const quest = require("./../../models/quest");

module.exports = {
  name: `quest`,
  category: "quests",
  description: "Check quest or start a quest",
  usage: "quest [start] [questNumber]",
  run: async(client, message, args, prefix) => {
    let embed = new MessageEmbed()
    .setAuthor(` Quests Available | NOTE THESE CAN ONLY WORK ON SUPPORT SERVER`, client.user.avatarURL({format: "png", dynamic: true})) 
    .setDescription(quests.map((r, i) => `${i + 1}. name: \`${r.name}\` requirement: \`${r.req}\` Reward: \`${r.reward.map(r => r).join(", ")}\`. \n`))
    .setFooter(` Use ${prefix}quest <quest number>`, message.author.avatarURL({format: "png", dynamic: true}))
    .setColor("#05f5fc")
    let res;
    let index;
    let value = parseInt(args[0]) - 1;
    if(!isNaN(args[0]) && quests.some((r, i) => {
      if(i == value) {
        res = r;
        index = i;
        return true
      }
    })){
      let fetch = await quest.findOne({user: message.author.id, doing: res.name});
      
      if(fetch && fetch.status) {
        return message.channel.send(`You completed that quest.`)
      }
      
      if(fetch && !fetch.status) return message.channel.send(`You are already doing the quest: \`${fetch.doing}\`.`);
      /*if((fetch ? fetch.done[0] : undefined) == 'completed') {
        return message.channel.send(`You completed that quest.`)
      }*/
      let newDoc = new quest({
        name: "quest",
        user: message.author.id,
        doing: res.name,
        done: [],
        status: false
      });
      
      await newDoc.save().catch(e => console.log(e));
      
      message.channel.send(new MessageEmbed().setAuthor(` | ${res.start.name}`, res.start.av).setDescription(res.start.text));
  }else{
    return message.channel.send(embed);
      
    }
    
  }
}