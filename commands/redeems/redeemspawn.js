const User = require('../../models/user.js');
const Server = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const discord = require('discord.js')
const pokedex = require("./../../pokedex/index");
const p = new pokedex();
const { get } = require('request-promise-native')
var pkm = require("./../../db/pokemon.js");
//var forms = require("./../../db/forms.js");
const {classToPlain} = require("class-transformer");
const capitalize = function(arg) {
      return arg.charAt(0).toUpperCase() + arg.slice(1);
    };
const pokemon = require("../../Classes/Pokemon");
const {attach} = require('../../functions.js')
const gen8 = require("./../../db/gen8.js");
const galarians = require("./../../db/galarians.js");
const altnames = require("./../../db/altnames.js");
const shinydb = require("./../../db/shiny.js");

module.exports = {
  name: "redeemspawn",
  category: 'redeems',
  description: "Spawns Pokemons of your choice except shiny",
  usage: 'redeemspawn',
  aliases: ["rs"],
  run: async(client, message, args) => {
    const user = await User.findOne({id: message.author.id});
    const nguild = await Server.findOne({id: message.guild.id})
    if(!user) return client.embed(message.channel, { name: " | You must pick your starter Pokemon with .start before using this command.", av: message.author.avatarURL({format: "png", dynamic: true}) })
    if(!user.redeems) {
    await User.findOneAndUpdate({id: message.author.id}, {redeems: 0}, {  new: true })
    return message.channel.send(`You have no redeems to redeem pokemon.`)
    }
    if(user.redeems < 1) return message.channel.send(`You have no redeems to redeem pokemon.`)
    let name = args.join("-").toLowerCase()
    if(!args[0]) return message.channel.send({embed: {description: "Provide A Pokemon Name"}})
    
   if(args.includes("shiny")) return message.reply("Nice try 😉")
    let g8 = gen8.find(r => r.name === name.toLowerCase());
    for(var i = 0;i < altnames.length;i++){
      let org = []
      altnames[i].jpname.toLowerCase().split(" | ").forEach(name => {
      org.push(name)
      })
      for(let a = 0;a < org.length; a++){
        if(org[a] == name.toLowerCase()){
          let og = `${org[0]} | ${org[1]} | ${org[2]}`
          name = name.replace(name,og.toLowerCase())
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
    const alt = altnames.find(e => e.name.toLowerCase() === name.toLowerCase().replace("shiny-",""))
    let pk = pkm.find(r => r.name === name.toLowerCase());
    let g = galarians.find(r => r.name === name.toLowerCase().replace("galarian-", ""));
    if(g8){
      var uri = g8.url
      let imgname = "PokelusionSpawn.png"
      const embed = new MessageEmbed()
      .setAuthor(` | A wild pokémon has аppeаred!`, client.user.displayAvatarURL({format: "png", dynamic: true}))
      .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
      .setColor("#05f5fc")
      .setFooter(client.config.footer(), message.guild.iconURL({format: "png", dynamic: true}))
      .attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      let m = await message.channel.send(embed);
      if(g8){
        var pokename = g8.name
      }
      const filter =  m => m.author.id !== client.user.id && m.content.startsWith(`${nguild.prefix}`)
      const collector = new discord.MessageCollector(message.channel, filter, {time: 60000})
      user.redeems = user.redeems - 1;
      await user.save().catch(console.error);
      
      collector.on("collect", async m => {
        let check = m.content.toLowerCase().slice(`${nguild.prefix}catch`.length).trim().split(/ +/g)
        if(check.length === 0) return;
        
        if(m.content.toLowerCase() == (`${nguild.prefix}catch ${pokename}`)){
          if(!User.findOne({id: m.author.id})) {
            return client.embed(m.channel, undefined, undefined, `You must pick a starter before catching a pokemon.`) 
          }
        collector.stop('caught')
        const time = Math.random() * (100 - 0) + 0;
        var gen = time.toFixed(2);
        var shiny;
        if(gen < 0.1) {
          shiny = true
        
        }else if(gen > 0.1) {
          shiny = false
        }
        let lvl = Math.floor(Math.random() * 50)
        const poke = new pokemon({name: pokename.capitalize(), shiny: shiny, rarity: g8.type, url: uri}, lvl)
        poke.xp = lvl*100
  const convert = classToPlain(poke)
  const usr = await User.findOne({id: m.author.id});
    
          usr.pokemons.push(convert);
          await usr.markModified(`pokemons[${usr.pokemons.length - 1}]`)

          await usr.save()
          message.channel.send(`🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name}.`) 
  }else if(m.content.toLowerCase().startsWith(nguild.prefix+"catch ") && !m.content.toLowerCase().endsWith(`${pokename}`)){
    return client.embed(m.channel, {
        name: ` | That is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
  }
    })
    collector.on("end", (err, reason) => {
    if(reason == "caught") return;
      client.pokeCooldown.delete(message.channel.id);
    })
      return
    }
    if(g && name.toLowerCase().startsWith("galarian-")){
      var uri = g.url
      let imgname = "PokelusionSpawn.png"
      const embed = new MessageEmbed()
      .setAuthor(` | A wild pokémon has аppeаred!`, client.user.displayAvatarURL({format: "png", dynamic: true}))
      .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
      .setColor("#05f5fc")
      .setFooter(client.config.footer(), message.guild.iconURL({format: "png", dynamic: true}))
      .attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      let m = await message.channel.send(embed);
      var pokename = "galarian " + g.name
      const filter =  m => m.author.id !== client.user.id && m.content.startsWith(`${nguild.prefix}`)
      const collector = new discord.MessageCollector(message.channel, filter, {time: 60000})
      user.redeems = user.redeems - 1;
      await user.save().catch(console.error);
      
      collector.on("collect", async m => {
        let check = m.content.toLowerCase().slice(`${nguild.prefix}catch`.length).trim().split(/ +/g)
        if(check.length === 0) return;
        if(m.content.toLowerCase() == (`${nguild.prefix}catch ${pokename}`)){
          if(!User.findOne({id: m.author.id})) {
            return client.embed(m.channel, undefined, undefined, `You must pick a starter before catching a pokemon.`) 
          }
        collector.stop('caught')
        const time = Math.random() * (100 - 0) + 0;
        var gen = time.toFixed(2);
        var shiny;
        if(gen < 0.1) {
          shiny = true
        
        }else if(gen > 0.1) {
          shiny = false
        }
        let lvl = Math.floor(Math.random() * 50)
        const poke = new pokemon({name: pokename.replace(" ", "-").capitalize(), shiny: shiny, rarity: g.type, url: uri}, lvl)
        poke.xp = lvl*100
  const convert = classToPlain(poke)
  const usr = await User.findOne({id: m.author.id});
    
          usr.pokemons.push(convert);
          await usr.markModified(`pokemons[${usr.pokemons.length - 1}]`)

          await usr.save()
          message.channel.send(`🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name}.`) 
  }else if(m.content.toLowerCase().startsWith(nguild.prefix+"catch ") && !m.content.toLowerCase().endsWith(`${pokename}`)){
    return client.embed(m.channel, {
        name: ` | That is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
  }
    })
    collector.on("end", (err, reason) => {
    if(reason == "caught") return;
      client.pokeCooldown.delete(message.channel.id);
    })
      return
    }
    /*if(f){
      var uri = f.url
      let imgname = "PokeBotSpawn.png"
      const embed = new MessageEmbed()
      .setAuthor(` | A wild pokémon has аppeаred!`, client.user.displayAvatarURL({format: "png", dynamic: true}))
      .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
      .setColor("#05f5fc")
      .setFooter(client.config.footer(), message.guild.iconURL({format: "png", dynamic: true}))
      .attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      let m = await message.channel.send(embed);
      if(f){
        var pokename = f.name
      }
      const filter =  m => m.author.id !== client.user.id && m.content.startsWith(`${nguild.prefix}`)
      const collector = new discord.MessageCollector(message.channel, filter, {time: 60000})
      user.redeems = user.redeems - 1;
      await user.save().catch(console.error);
      
      collector.on("collect", async m => {
        let check = m.content.toLowerCase().slice(`${nguild.prefix}catch`.length).trim().split(/ +/g)
        if(check.length === 0) return;
        
        if(m.content.toLowerCase() == (`${nguild.prefix}catch ${pokename}`)){
          if(!User.findOne({id: m.author.id})) {
            return client.embed(m.channel, undefined, undefined, `You must pick a starter before catching a pokemon.`) 
          }
        collector.stop('caught')
        const time = Math.random() * (100 - 0) + 0;
        var gen = time.toFixed(2);
        var shiny;
        if(gen < 0.1) {
          shiny = true
        
        }else if(gen > 0.1) {
          shiny = false
        }
        let lvl = Math.floor(Math.random() * 50)
        const poke = new pokemon({name: pokename.capitalize(), shiny: shiny, rarity: f.type, url: uri}, lvl)
        poke.xp = lvl*100
  const convert = classToPlain(poke)
  const usr = await User.findOne({id: m.author.id});
    
          usr.pokemons.push(convert);
          await usr.markModified(`pokemons[${usr.pokemons.length - 1}]`)

          await usr.save()
          client.embed(m.channel, undefined, undefined, `🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name}.`) 
  }else if(m.content.toLowerCase() !== m.content.toLowerCase().startsWith(`${nguild.prefix}catch ${pokename}`)){
    return
    }
    })
    collector.on("end", (err, reason) => {
    if(reason == "caught") return;
      client.pokeCooldown.delete(message.channel.id);
    })
      return
    }*/
    if(pk){
      if(pk.name == "maxlord") return message.channel.send(`Pokémon name is not valid or you can't redeem it!`)
      var uri = pk.url
      let imgname = "PokelusionSpawn.png"
      const embed = new MessageEmbed()
      .setAuthor(` | A wild pokémon has аppeаred!`, client.user.displayAvatarURL({format: "png", dynamic: true}))
      .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
      .setColor("#05f5fc")
      .setFooter(client.config.footer(), message.guild.iconURL({format: "png", dynamic: true}))
      .attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      let m = await message.channel.send(embed);
      if(pk){
        var pokename = pk.name
      }
      const filter =  m => m.author.id !== client.user.id && m.content.startsWith(`${nguild.prefix}`)
      const collector = new discord.MessageCollector(message.channel, filter, {time: 60000})
      user.redeems = user.redeems - 1;
      await user.save().catch(console.error);
      
      collector.on("collect", async m => {
        let check = m.content.toLowerCase().slice(`${nguild.prefix}catch`.length).trim().split(/ +/g)
        if(check.length === 0) return;
        
        if(m.content.toLowerCase() == (`${nguild.prefix}catch ${pokename}`)){
          if(!User.findOne({id: m.author.id})) {
            return client.embed(m.channel, undefined, undefined, `You must pick a starter before catching a pokemon.`) 
          }
        collector.stop('caught')
        const time = Math.random() * (100 - 0) + 0;
        var gen = time.toFixed(2);
        var shiny;
        if(gen < 0.1) {
          shiny = true
        
        }else if(gen > 0.1) {
          shiny = false
        }
        let lvl = Math.floor(Math.random() * 50)
        const poke = new pokemon({name: pokename.capitalize(), shiny: shiny, rarity: pk.type, url: uri}, lvl)
        poke.xp = lvl*100
  const convert = classToPlain(poke)
  const usr = await User.findOne({id: m.author.id});
    
          usr.pokemons.push(convert);
          await usr.markModified(`pokemons[${usr.pokemons.length - 1}]`)

          await usr.save()
          message.channel.send(`🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name}.`) 
  }else if(m.content.toLowerCase().startsWith(nguild.prefix+"catch ") && !m.content.toLowerCase().endsWith(`${pokename}`)){
    return client.embed(m.channel, {
        name: ` | That is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
  }
    })
    collector.on("end", (err, reason) => {
    if(reason == "caught") return;
      client.pokeCooldown.delete(message.channel.id);
    })
      return
    }
    if(args.includes("alolan")){ message.content.replace("alolan", "") 
    name = args.slice(1).join("-")+"-alola".toLowerCase()}
    let imgname = "PokelusionSpawn.png"
    const embed = new MessageEmbed()
  .setAuthor(` | A wild pokémon has аppeаred!`, client.user.displayAvatarURL({format: "png", dynamic: true}))
  .setDescription(`Type \`${nguild.prefix}catch <pokémon name>\` to catch it`)
  .setColor("#05f5fc")
  .setFooter(client.config.footer(), message.guild.iconURL({format: "png", dynamic: true}))
  const options = {
    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
    json: true
  }
  if(name === "giratina") options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
  if(name === "deoxys") options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
  if(name === "giratina-origin") options.url = "https://pokeapi.co/api/v2/pokemon/giratina-origin"
  get(options).then(async body => { 
  var uri;
  if (getlength(body.id) === 1) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${body.id}.png`
      }
      if (getlength(body.id) === 2) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${body.id}.png`
      }
      if (getlength(body.id) === 3) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${body.id}.png`
      }
  embed.attachFiles([{name: imgname, attachment: uri}])
  .setImage("attachment://"+imgname)
  let m = await message.channel.send(embed);
  let pokename = body.name
  if(pokename == "giratina-altered"){
     pokename = "giratina"
  }
  if(pokename == "deoxys-normal"){
     pokename = "deoxys"
  }
  const filter =  m => m.author.id !== client.user.id && m.content.startsWith(`${nguild.prefix}`)
  const collector = new discord.MessageCollector(message.channel, filter, {time: 60000})
  user.redeems = user.redeems - 1;
    await user.save().catch(console.error);
 collector.on("collect", async m => {
   let check = m.content.toLowerCase().slice(`${nguild.prefix}catch`.length).trim().split(/ +/g)
   if(check.length === 0) return;
  // if(check !== pokename.toLowerCase()) return message.channel.send(`That is not a correct guess`);
   
  if(m.content.toLowerCase() == (`${nguild.prefix}catch ${pokename.replace("-", " ")}`)){
      if(!User.findOne({id: m.author.id})) {
      return client.embed(m.channel, undefined, undefined, `You must pick a starter before catching a pokemon.`) 
    }
    if(pokename == "giratina"){
      pokename = "giratina-altered"
    }
    if(pokename == "deoxys"){
      pokename = "deoxys-normal"
    }
    collector.stop('caught')
    const time = Math.random() * (100 - 0) + 0;
    var gen = time.toFixed(2);
      var shiny;
      if(gen < 0.1) {
        shiny = true
        
      }else if(gen > 0.1) {
        shiny = false
      }
    
    var re; 
    const type = body.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ")
    let lvl = Math.floor(Math.random() * 50)
    const poke = new pokemon({name: pokename.capitalize(), shiny: shiny, rarity: type, url: uri}, lvl)
    poke.xp = lvl*100
  const convert = classToPlain(poke)
  const usr = await User.findOne({id: m.author.id});
    
      //await usr.save().then(() => {
          usr.pokemons.push(convert);
          await usr.markModified(`pokemons[${usr.pokemons.length - 1}]`)

           // that is not how you check if its invalid dude
          await usr.save()
          message.channel.send(`🎉 Congratulations ${m.author.toString()}, You successfully caught a ${shiny ? `⭐`: ''}${poke.name}.`) 
        /*}).catch((err) => { 
          message.channel.send(`Pokémon name is not valid! Please try again`)
          console.log(err)
        }); */      
      //await user.save().catch(e=>console.log(e))
  }else if(m.content.toLowerCase().startsWith(nguild.prefix+"catch ") && !m.content.toLowerCase().endsWith(`${pokename}`)){
    return client.embed(m.channel, {
        name: ` | That is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
  }/*else if(m.content.toLowerCase() !== m.content.toLowerCase().startsWith(`${nguild.prefix}catch ${pokename}`)){
    return client.embed(m.channel, {
        name: ` | That is not a correct guess.`,
        av: m.author.avatarURL({format: "png", dynamic: true})
      })
  }*/
    })
  collector.on("end", (err, reason) => {
    if(reason == "caught") return;
    client.pokeCooldown.delete(message.channel.id);
  })
    }).catch((err) => message.channel.send(`${args.join(" ")} doesn't seem to appear in the Pokedex or you can't redeemspawn it!`))
  }
}
function getlength(number){
    return number.toString().length;
}
