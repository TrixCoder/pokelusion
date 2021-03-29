const spawnSchema = require("./../models/spawn");
const Discord = require('discord.js');
var pokemon = require("../db/pokemon.js");
const spawn = new Set();
var pokedex = require("./../pokedex/index");
const p = new pokedex();
const { get } = require('request-promise-native')
const User = require('../models/user.js');
const Guild = require('../models/guild.js');
const Client = require("./../Classes/Client");
const ms = require("ms");
const {MessageEmbed} = require('discord.js');
const GiveawaySchema = require("../models/Giveaway");

async function fetchReactedUsers(reaction, after) {
  const opts = { limit: 100, after };
  const reactions = await reaction.users.fetch(opts);
  if (!reactions.size) return [];

  const last = reactions.last().id;
  const next = await fetchReactedUsers(reaction, last);
  return reactions.array().concat(next);
}



const okemon = require("../Classes/Pokemon");
module.exports = async client => {
  const DBL = require("dblapi.js");
  const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MjM2NzgyNzM3MDM3NzIxOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk4MTc2NTU4fQ.xkvA3XL1hXbP3eMdn2cS2YybM0DQ0-yu47twbZ0a6Hk', client);
  
  setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
    }, 1800000);
  
  dbl.on('posted', () => {
    console.log('Server count posted!');
  })
  
  dbl.on('error', e => {
    console.log(`Oops! ${e}`);
  })
  
  //
  await spawnSchema.deleteMany({});
  
  setInterval(async() => {
    const Giveaways = await GiveawaySchema.find({enabled: true});
    if(!Giveaways) return;
    Giveaways.forEach(async(giveaway) => {
      const embed = new MessageEmbed(giveaway.embed);
      let channel = await client.channels.cache.get(giveaway.channel);
      if(!channel) {
        await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
        return;
    }
    let msg = await channel.messages.fetch(giveaway.msgId);
    if(!msg)  {
      await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
      return;
  }

  if(Date.now() > giveaway.time) {

    const reaction = msg.reactions.cache.get("🎉");
   
 
    let users = await fetchReactedUsers(reaction);
 
   
    const list = await users.filter(u =>  u.bot !== true && u.id !== giveaway.host);
      if(giveaway.type === "automatic") {
         const prize = giveaway.prize;
        
        
       let nwinner = list.forEach(async w => {
       
         
      if(prize.endsWith("c")){
         var amount = prize.replace("c","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
         
       if(prize.endsWith("credits")){
         var amount = prize.replace("credits","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("coins")){
         var amount = prize.replace("coins","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("pokecoins")){
         var amount = prize.replace("pokecoins","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("coin")){
         var amount = prize.replace("coin","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("pokecoin")){
         var amount = prize.replace("pokecoin","").replace("k", "000")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("redeems")){
         var amount = prize.replace("redeems","")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
       if(prize.endsWith("redeem")){
         var amount = prize.replace("redeem","")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
       if(prize.endsWith("r")){
         var amount = prize.replace("r","")
         var ra = parseInt(amount)
         let mg = await User.findOne({id: w.id});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
         });
       } 
    if((list.length === 0 || list.length < giveaway.winnerCount) && giveaway.type === "automatic") {
         let prize = giveaway.prize;
      
         if(prize.endsWith("c")){
         var amount = prize.replace("c","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
         
       if(prize.endsWith("credits")){
         var amount = prize.replace("credits","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("coins")){
         var amount = prize.replace("coins","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("pokecoins")){
         var amount = prize.replace("pokecoins","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("coin")){
         var amount = prize.replace("coin","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("pokecoin")){
         var amount = prize.replace("pokecoin","").replace("k", "000")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.balance + ra;
         mg.balance =newbal
         await mg.save();
       }
       if(prize.endsWith("redeems")){
         var amount = prize.replace("r","")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
       if(prize.endsWith("redeem")){
         var amount = prize.replace("r","")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
       if(prize.endsWith("r")){
         var amount = prize.replace("r","")
         amount = giveaway.winnerCount * amount
         var ra = parseInt(amount)
         let mg = await User.findOne({id: giveaway.host});
         const newbal = mg.redeems + ra;
         mg.redeems =newbal
         await mg.save();
       }
      
    }
     
    if (list.length === 0) {
     embed.description = `Winner: No one.`;
     embed.footer.text = `Giveaway Finished`;
      
     await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
     return msg.edit(embed);
 }else if(list.length < giveaway.winnerCount){
     embed.description = `Winner: Couldn't find enough winners.`;
     embed.footer.text = `Giveaway Finished`;
      
     await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
     return msg.edit(embed);
 }
 let winners = [];
 for (let i = 0; i < giveaway.winnerCount; i++) {
   const x = client.draw(list);
 
   if (!winners.includes(x)) winners.push(x);
 }
 
 embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
 embed.footer.text = `${client.config.footer()} | Giveaway Finished`;
 
 
 await msg.edit(embed);
 giveaway.enabled = false
 
  await giveaway.save().catch(e => console.log(e))
 if (winners.length) msg.channel.send(`🎉 Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${giveaway.prize}**! 🎉`);
 
 
   }
    })
  }, 60000)
  
  
  
    setInterval(() => {
    client.user.setActivity(`with ${client.users.cache.size} users | ${client.guilds.cache.size} Guilds`); 
    }, 60000);
    console.log('Ready!')
  
    client.setInterval(async () => {
      return;
       const guild = await Guild.find({ spawnbtn: true });
       let spawnch = guild.forEach(async (g) => { 
     //   console.log(g.spawnchannel)
       let spawnchn = client.channels.cache.get(g.spawnchannel);
             
        
        var rNo = randomInteger(10, 721);
        var rsNo = Math.floor((Math.random() + 120000) + 1);
        const poke = pokemon[rNo]._engName.toLowerCase();
        const poke2 = pokemon[rNo];
            
       let a = await spawnchn.send({
              embed: {
                title: `A random pokémon spawned`,
                color: 0x00f9ff,
                  description: "To catch the pokemon use ``.catch pokémon name``. Example: ``.catch pikachu``\n(Note: The pokemon will disappear in 2 min)",
                image: {
                  name: "spawn.png",
                  url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${poke2._nb}.png`
                }
              }
            });
        spawn.add({poke, chnl:spawnchn})
       // console.log(poke + " spawned in " + spawnchn)
        const collector = new Discord.MessageCollector(spawnchn, m => !m.author.bot && m.content.startsWith(`${client.config.prefix}catch`), {time: 120000});
         collector.on("collect", async m => {
          const msg = m.content.replace(".catch", "").trim();
    /*      function capitalizeFirstLetter(string) {
            return msg.charAt(0).toUpperCase() + msg.slice(1);
          }
          var cap = capitalizeFirstLetter(poke)
      */
      if(msg == poke) {   
            collector.stop(true);
            
  let user = await User.findOne({id: m.author.id});
  if(!user) {
    /*const usr = new User({
      id: m.author.id,
      balance: 0,
      xp: 1,
      level: 0,
      pokemons: [],
      redeems: 0,
      badges: []
    });
    await usr.save().catch(e => e); */
  }
  if(!user) return m.channel.send("You Need To Pick A Starter First!")
  const {classToPlain} = require("class-transformer");
const capitalize = function(arg) {
      return arg.charAt(0).toUpperCase() + arg.slice(1);
    };
var shiny = false
const options = {
      url: `https://pokeapi.co/api/v2/pokemon/${poke.toLowerCase()}`,
      json: true
    };     
let bdy = await get(options)
var uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${bdy.id}.png`
var re;
const t = await p.getPokemonByName(poke.toLowerCase());
            console.log(t.types)
const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ") 
// type fixed 
const res = new okemon({name: poke.charAt(0).toUpperCase()+poke.slice(1), shiny: shiny, url: uri, type: bdy.types[0].type.name.capitalize()});
const convert = classToPlain(res)
  user.pokemons.push(convert);
  await user.save();
 // console.log(user.pokemons);
  return a.edit(new Discord.MessageEmbed().setAuthor(` Congratulations ${m.author.username}! You successfully caught a ${capitalize(msg)}.`, m.author.avatarURL({format: "png", dynamic: true})).setColor('#05f5fc'))
          }
          if(m.content.startsWith(".hint")){
            var hint = poke.charAt(0).toUpperCase();
            return spawnchn.send("Pokemon first letter starts with " + hint)
          }
          else{
            return spawnchn.send(new Discord.MessageEmbed().setAuthor(` Hey ${m.author.username}! ${msg.charAt(0).toUpperCase + msg.slice(1)} is not the correct guess! Please try again.`, m.author.avatarURL({format: "png", dynamic: true})).setColor('#05f5fc'))
          }
        });
        collector.on("end", (collected, reason) => {
          if(reason == 'time') {
             return a.edit({embed: {
            color: 0x00f9ff,
            description: `The pokemon has disappeared`
          }}).then(m => m.delete({timeout: 60000}));         
          }
        });
          setTimeout(() => {
          spawn.delete({poke, channel:spawnchn});
        }, rsNo); 
    
     }); 
    },180000); 
}; 

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
