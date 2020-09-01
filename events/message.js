const server = require("./../models/server");
const use = require("./../models/User");
const Discord = require("discord.js")
const {Collection} = require("discord.js");
const cooldown = new Map(); //require("./../models/cooldown");
const quests = require("./../db/quest");
const quest = require("./../models/quest");
const { get } = require('request-promise-native')
const spawnSchema = new Collection();
const collector = new Map();
const spawnCooldown = new Set();
var levelup = require("./../db/levelup.js");
var pokemon = require("./../db/pokemon.js");
var forms = require("./../db/forms.js");
var primal = require("./../db/primal.js");
const shinyDb = require("./../db/shiny");
var gen8 = require('./../db/gen8.js')
var altnames = require("./../db/altnames.js");
const geyBot = new Set();

var rarities = [{
  type: "common",
  chance: 0
}, {
  type: "mythics",
  chance: 0.0004
}, {
  type: "legends",
  chance: 0.0001
}, {
  type: "ub",
  chance: 0.0002
},
{
  type: "alolans",
  chance: 0.0005
},

];

const hintCooldown = new Set();

function pickRandom() {
  var filler = 100 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);

  if (filler <= 0) {
    console.log("chances sum is higher than 100!");
    return;
  }

  // Create an array of 100 elements, based on the chances field
  var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);

  // Pick one
  var pIndex = Math.floor(Math.random() * 100);
  var rarity = rarities[probability[pIndex]];

  return rarity.type;
}

const Guild = require("./../models/guild");
const fs = require("fs");
const {classToPlain} = require("class-transformer");
const {MessageEmbed, MessageCollector} = require("discord.js");
const {randomNumber} = require("./../functions");
const User = require('../models/user.js');
let xpCooldown = new Set();
const {getlength, attach} = require("./../functions");
const pokedex = require("./../pokedex/index");
const p = new pokedex();
const Pokemon = require("./../Classes/Pokemon");
function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
const legends = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const common = fs.readFileSync("./db/common.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
//const galarians = fs.readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());

module.exports = async (client, msg) => {
  
  if(msg.author.bot || !msg.guild) return
  const guild = await Guild.findOne({ id: msg.guild.id });
  if(!guild) {
      const server = new Guild({
        id: msg.guild.id,
        prefix: null,
        spawnchannel: null,
        spawnbtn: false
      });
      await server.save();
  }
  
  if (!msg.guild.me.hasPermission("SEND_MESSAGES")) return;
  if (!msg.guild.me.hasPermission("EMBED_LINKS")) return;
  const nguild = await Guild.findOne({id: msg.guild.id});
  if(nguild.prefix == null) nguild.prefix = client.config.prefix;
  await nguild.save();
  let prefix = nguild.prefix;
  const mentionRegex = new RegExp(`^<@!${client.user.id}>$`);
  if(msg.content.includes("@everyone" || "@here") && msg.content.startsWith(prefix)) return
  const r = await server.findOne({name: "server", server: msg.guild.id});
  if(r && msg.content.startsWith(prefix)) return client.embed(msg.channel, undefined, undefined,  ` This server has been blacklisted. Use this ${client.config.banAppeal} to appeal`, "#CB1701", undefined, {name: `Seriously Your server got banned? Great!`, av: `https://cdn.discordapp.com/attachments/720183923421872138/723143932623454219/banThor.gif`}, msg.author.avatarURL({format: "png", dynamic: true}))
  const u = await use.findOne({name: "user", userid: msg.author.id});
  if(u && msg.content.startsWith(prefix)) return client.embed(msg.channel, undefined, undefined,  ` You have been blacklisted from bot. Use this ${client.config.banAppeal} to appeal`, "#CB1701", undefined, {name: `Seriously You got banned? Great!`, av: `https://cdn.discordapp.com/attachments/720183923421872138/723143932623454219/banThor.gif`}, msg.author.avatarURL({format: "png", dynamic: true}))
  if(msg.mentions.has(client.user) && !msg.mentions.everyone){
  if(r) return;
  if(u) return;
  const embed = new MessageEmbed()
  .setAuthor("Pokelusion Tips", msg.author.displayAvatarURL())
  .setDescription(`To learn how to use the bot, please use the ${nguild.prefix}help command.`)
  .addField("Command Prefix: ", `The current prefix in this server is \`${prefix}\`.`)
  .addField("Invite Bot: ", `**[Click Here!](https://discord.com/oauth2/authorize?client_id=552367827370377218&permissions=362560&scope=bot)**`)
  .addField("Support Server: ", `**[Click Here!](https://discord.gg/YvKnXaA)**`)
  .setColor("#05f5fc")
    msg.channel.send(embed);
  }

  if(msg.guild) {
    if(r) return;
    if(u) return;
    await leveling(msg, client);
    let res = spawnSchema.get(msg.channel.id)
    if(nguild.spawnchannel) {
       if(!client.channelCooldown.has(msg.guild.id)) {
     await spawnBoi(client, msg);
    }
    }else {
    if(!client.channelCooldown.has(msg.channel.id)) {
     await spawnBoi(client, msg);
    }
    }
      if(res) {
      const m = msg;
      const poke = res.pokemon
      const user = await User.findOne({id: msg.author.id});
      if(user) {
      geyBot.add(msg.channel.id);
      if(m.content.startsWith(`${nguild.prefix}hint`)) {
        if(hintCooldown.has(m.author.id)) return m.reply(`You can't use hint this much quickly please try after some time.`);
          let name = poke.name.split("")
          let done = []
          name.forEach(e=>done.push(e))
          for(var i=0;i<name.length;i++){
            let pos = Math.floor(Math.random()*name.length)
            done[done.map((x, i) => [i, x]).filter(x => x[1] == done[pos])[0][0]] = "_"
          }
        m.channel.send("Here's a hint: **`"+done.join("")+"`**")
        hintCooldown.add(m.author.id)
        setTimeout(() => {
          hintCooldown.delete(m.author.id)
        }, (2 * 60000));
      }else if(msg.content.startsWith(`${prefix}catch`)) {
        var name = msg.content.slice(`${prefix}catch`.length).trim().split(" ").join("-");
        for(var i = 0;i < altnames.length;i++){
          let org = []
          altnames[i].jpname.toLowerCase().split(" | ").forEach(nm => {
          org.push(nm.replace(" ", "-"))
          })
          for(let a = 0;a < org.length; a++){
            if(org[a] == name.toLowerCase()){
              let og = `${org[0]} | ${org[1]} | ${org[2]}`
              name = name.replace(name,og.toLowerCase().replace("-", " "))
            }
          }
        }
        const altjp = altnames.find(e => e.jpname.toLowerCase() === name.toLowerCase().replace("shiny-",""))
        const altfr = altnames.find(e => e.frname.toLowerCase() === name.toLowerCase().replace("shiny-",""))
        const altde = altnames.find(e => e.dename.toLowerCase() === name.toLowerCase().replace("shiny-",""))
        if(altfr){
          name = name.toLowerCase().replace(altfr.frname.toLowerCase(), altfr.name.toLowerCase())
        }
        else if(altjp){
          name = name.toLowerCase().replace(altjp.jpname.toLowerCase(), altjp.name.toLowerCase())
        }
        else if(altde){
          name = name.toLowerCase().replace(altde.dename.toLowerCase(), altde.name.toLowerCase())
        }
        if(name.toLowerCase() == poke.name.toLowerCase().split(/ +/g).join("-")) {
          //await spawnSchema.deleteOne({id: msg.channel.id});
          await spawnSchema.delete(msg.channel.id);
          geyBot.delete(msg.channel.id);
          let questCheck = await quest.findOne({user: m.author.id, status: false});
      
      if(m.guild.id == "716574567400996928") { // support server guild id
      if(questCheck && questCheck.doing == "MrSon's Froakies MISSING") {
        if(res.pokemon.name.toLowerCase() == "froakie") {
        if(questCheck.done[0]) {
        questCheck.done[0] = questCheck.done[0] + 1;
        }else{
          questCheck.done[0] = 1;
        };
          
        if(questCheck.done[0] > 25) {
          const options = {
      url: `https://pokeapi.co/api/v2/pokemon/mewtwo`,
      json: true
    };
          const t = await get(options);
          
          
          let lvl = Math.floor(Math.random() * 50)
          var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ");
      let le = 1;
      const pokemon = new Pokemon({name: "Mewtwo", shiny: false, rarity: type, url: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png"}, le);
        const convertToObject = await classToPlain(pokemon);
          
          await user.pokemons.push(convertToObject);
          
          user.balance = user.balance + 500;
          questCheck.status = true;
          
          m.author.send(`${quests[0].start.name}: \`${quests[0].start.end}\``).catch(async() => {
            m.channel.send(`hey ${m.author.toString()} I was unable to dm you here! \n\n ${quests[0].start.name}: \`${quests[0].start.end}\``)
              
          })
          
        }
        await questCheck.markModified("done");
        await questCheck.save().catch(console.error);
          
        }
        
        
      }
      }
      let lvl = poke.level;
      poke.xp = lvl * 100
      const shiny = poke.shiny;
      const usr = await User.findOne({id: m.author.id});
      await usr.save().then(async() => { 
      await user.markModified("pokemons");
      await user.pokemons.push(poke);
      await user.save().catch(e=>console.log(e))
      msg.channel.send(`🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name.replace(/-+/g, " ")}.`)
        
      });
        }else{
          geyBot.delete(msg.channel.id);
          return client.embed(m.channel, {
        name: ` | ${name.replace(/-+/g, " ")} is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
        }
      }
      }
      
  }
}
  
  
  if(!msg.content.startsWith(prefix)) return;
  let args = msg.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  
  
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  
  if(!command) return;
  
  if(msg.content.startsWith(nguild.prefix)){
    console.log(`\n\nCommand: ${msg}\nAuthor: ${msg.author.username}\nServerName: ${msg.guild.name}\nServerID: ${msg.guild.id}\n\n`)
  }
   
   let cooldownAmount = client.config.cooldown;
   const expire = await cooldown.get(msg.author.id) + cooldownAmount;
   if (expire > Date.now()) {
    var time = await require("moment").duration(expire - Date.now(), "ms").format("d [Days], h [Hours], mm [Minutes], ss [Seconds]")
    
    return client.embed(msg.channel, {
      name: ` | Please wait ${time} before using another command.`,
      av: msg.author.avatarURL({format: "png", dynamic: true})
    });
   }
  if(command.category == "special") {
    if(!client.config.specials.includes(msg.author.id)) return msg.channel.send(`This command is not usable for people who are not the developers of this bot.`)
  }
  if(command.category == "botowner") {
    if(!client.config.owners.includes(msg.author.id)) return msg.channel.send(`This command is not usable for people who are not the developers of this bot.`)
  }
  
  if(command.category == "testing") {
    if(!client.config.owners.includes(msg.author.id)) return msg.channel.send(`This command is not usable for people who are not the developers of this bot because it is being tested and will be unavailable until further notice.`)
  }
  try {
    command.run(client, msg, args, prefix);
    
    cooldown.set(msg.author.id, Date.now());
    
    setTimeout(() => {
    cooldown.delete(msg.author.id);
    }, client.config.cooldown)
    /*let newDoc = new cooldown({
        id: msg.author.id,
        time: client.config.cooldown + Date.now()
      });
    if(cooldown.findOne({id: msg.author.id})) {
      await cooldown.deleteOne({id: msg.author.id})
    }
      await newDoc.save().catch(console.error); */
    
  } catch(e) {
    console.error(e);
    return msg.channel.send(`An error occured: ${e.message}`);
  }
};


async function leveling(msg, client) {
  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
  let user = await User.findOne({id: msg.author.id});
  if(!user) return;
  let nUser = await User.findOne({id: msg.author.id});
 /* if(nUser.levelupbtn == null) nUser.levelupbtn = true;
  await nUser.save(); */
  if(nUser.lvlupbtn === false) return
  const selected = nUser.selected - 1;
  let poke = nUser.pokemons[selected];
  if(xpCooldown.has(msg.author.id)){return}else{
  if(!poke) return;
 setTimeout(()=>xpCooldown.delete(msg.author.id), 30000)
  const nguild = await Guild.findOne({id: msg.guild.id});
  let prefix = nguild.prefix;
  if(msg.content.startsWith(`${prefix}`)) return;
  if(poke.level == 100) return;
  let curxp = poke.xp;
  let newXp = curxp+10;
  xpCooldown.add(msg.author.id)
  let lvl = poke.level;
  let neededXp = lvl * 100 + 100;
  if(newXp > neededXp) {
    poke.level = lvl+1;
    nUser.pokemons[selected] = poke;
    await User.findOneAndUpdate({id: msg.author.id}, {pokemons: nUser.pokemons}, {  new: true })
    const Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setDescription(`Congratulations ${msg.author}! Your \`${poke.name.capitalize()}\` has just leveled up to ${poke.level}`)
	    .setThumbnail(msg.author.avatarURL({dynamic: true}))
       for(var i=0;i<levelup.length;i++){
        if(poke.name.toLowerCase() == levelup[i].name.toLowerCase()){
          if(poke.level > levelup[i].levelup){
            Embed.setDescription(`Congratulations ${msg.author}! Your \`${poke.name.capitalize()}\` has just leveled up to ${poke.level} and evolved into ${levelup[i].evo.capitalize()}`)
            poke.name = levelup[i].evo.capitalize()
            poke.xp = newXp;
            nUser.pokemons[selected] = poke;
            await User.findOneAndUpdate({id: msg.author.id}, {pokemons: nUser.pokemons}, {  new: true })
          }
      }
      }
      if(nUser.levelupbtn === true) return msg.channel.send(Embed)
      else{
        
      }
  }    
    poke.xp = newXp;
            nUser.pokemons[selected] = poke;
            await User.findOneAndUpdate({id: msg.author.id}, {pokemons: nUser.pokemons}, {  new: true })
  }

} 

async function spawnBoi(client, msg) {
  let shinyChance = 0.001;
    const randomGuess = Math.floor(Math.random() * 4);
    if(randomGuess === 2 || randomGuess === 4) {}
  else{
    const guild = await Guild.findOne({id: msg.guild.id});
    if(msg.content.startsWith(guild ? guild.prefix : client.config.prefix)) return;
    const checkIfEnabled = guild ? guild.spawnbtn : true;
    if(checkIfEnabled == false) return;
    if(guild.disabledChannels !== null && guild.disabledChannels.includes(msg.channel.id)) return;
    var channel = guild ? guild.spawnchannel : msg.channel.id;
    channel = await client.channels.cache.get(channel) || msg.channel;
    

      if(!client.channelCooldown.has(msg.channel.id)) {
    var gen = getType();
    var type = common;
      if(gen == "common") type = common;
      if(gen == "alolans") type = alolans
      //if(gen < 10) type = galarians
      if(gen == "mythics") type = mythics;
      if(gen == "legends") type = legends;
      if(gen == "ub") type = ub; 
      gen = (Math.floor(Math.random() * 100000) + 1) <= 1;
        
      var shiny;
      if(gen) {
        shiny = true
        
      }else if(!gen) {
        shiny = false;
      }
      const random = type[Math.floor(Math.random() * type.length)];
      var name = random.trim().split(/ +/g).join("-").toLowerCase();
      var findGen8 = gen8.find(r => r.name === name);
      var nm = name;
      if(name.startsWith("alolan-")) {
        name = name.replace("alolan-", ``);
        nm = `${name}-alola`
        name = random;
      };
      const options = {
      url: `https://pokeapi.co/api/v2/pokemon/${nm}`,
      json: true
      };   

          await get(options).then(async t => {
        const check = getlength(t.id)
        var uri
    if(shiny == false) {
    if(check === 1) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
    }
    else if(check === 2) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
    }
    else if(check === 3) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
    }else if(check > 3 && nm.endsWith("-alola")) {
      const c = await p.getPokemonByName(nm.replace("-alola", ""))
      const ch = getlength(c.id);
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${c.id}_f2.png`
      if(ch === 1) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${c.id}_f2.png`
      }else if(ch === 2) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${c.id}_f2.png`
      }else if(ch === 3) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${c.id}_f2.png`
      } 
    }
    }else{
      let get = shinyDb.find(r => r.name === nm);
      if(!get) {
      uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${random.toLowerCase()}.gif`
      }else{
        uri = get.url;
      }
    };
            
          if(findGen8) uri = findGen8.url;
        var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ");
      let lvl = Math.floor(Math.random() * 50)
      const poke = new Pokemon({name: name.capitalize(), shiny: shiny, rarity: type, url: uri}, lvl);
        const convertToObject = await classToPlain(poke);
        if(shiny == true && nm.endsWith("alola")){ 
          let sdb = shinyDb.find(r => r.name.toLowerCase() === nm.toLowerCase()) 
          if(sdb){
            uri = shinyDb.find(r => r.name === nm).url
          }
        }
          const nguild = await Guild.findOne({id: msg.guild.id});
  let imgname = "PokelusionSpawn.png"
  if(poke.url.endsWith(".gif")) imgname = "PokelusionSpawn.gif"
  const embed = new MessageEmbed()
  .setAuthor(` | A wild pokémon has аppeаred!`, client.user.avatarURL({format: "png", dynamic: true}))
  .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
  .attachFiles([{name: imgname, attachment: poke.url}])
  .setImage("attachment://"+imgname)
  .setColor("#05f5fc")
  .setFooter(client.config.footer(), msg.guild.iconURL({format: "png", dynamic: true}))
  
  if(!msg.guild.me.hasPermission(["SEND_MESSAGES", 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'])) return; //spawn(poke, msg, client, name, channel);
            

 channel.send(embed);
       if(guild.spawnchannel) {
         client.channelCooldown.add(msg.guild.id);
        setTimeout(async() => {
          client.channelCooldown.delete(msg.guild.id);
        }, 120000);
       }else{
       client.channelCooldown.add(channel.id);
        setTimeout(async() => {
          client.channelCooldown.delete(channel.id);
        }, 120000);
       }
       
        spawnSchema.set(channel.id, {
          pokemon: poke
        }) 
       
                              
      })
        .catch(err => {
          
            console.log(err);
          if(err.message.includes(`404 - "Not Found"`)) return console.log(`Unable to spawn this pokemon due to no availability of this pokemon: ${nm} in channel: ${msg.channel.name} - ${msg.channel.id}.`);
          console.log(`An error occured while trying to spawn a pokemon: \`${nm}\` Error: ${err.message} in channel: ${msg.channel.name} - ${msg.channel.id}.`)
        });  
        
      }else{
      } 
  
  }
} 


function getType() {
   // var gen = (Math.random() * 100)
    //console.log(gen);
    if ((Math.floor(Math.random() * 1000) + 1) <= 3) return 'ub';
    if ((Math.floor(Math.random() * 1000) + 1) <= 1) return 'legends';
    if ((Math.floor(Math.random() * 100) + 1) <= 4) return 'mythics';
    //if (gen < 23) return 'galarians';
    if ((Math.floor(Math.random() * 100) + 1) <= 21) return 'alolans';

    return 'common';
}
