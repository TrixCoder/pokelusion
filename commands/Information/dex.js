const Discord = require("discord.js")
const {MessageAttachment} = require("discord.js");
const fs = require("fs");
var pokemon = require("./../../db/pokemon.js");
var forms = require("./../../db/forms.js");
var mega = require("./../../db/mega.js");
var shadow = require("./../../db/shadow.js");
var megashiny = require("./../../db/mega-shiny.js");
var primal = require("./../../db/primal.js");
var shiny = require('./../../db/shiny.js')
var gen8 = require('./../../db/gen8.js')
var galarians = require("./../../db/galarians.js");
var altnames = require("./../../db/altnames.js");
var levelup = require('./../../db/levelup.js')
const Pokedex = require("./../../pokedex/index");
const P = new Pokedex();
const { get } = require('request-promise-native')
const Guild = require('../../models/guild.js')
var attacks = require("./../../db/attacks.js");
var concept = require("./../../db/concept.js");
const User = require('../../models/user.js');


module.exports = {
  name: "dex",
  category: "Information",
  description: "Gives info of a particular pokemon",
  usage: "Example: ``.dex pokemonname``",
  aliases: ["d", "pokedex"],
  run: async(client, message, args) => {
    
    function getlength(number) {
      return number.toString().length;
    }
    
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    let nguild = await Guild.findOne({ id: message.guild.id });
    if(!args[0]){
      let user = await User.findOne({id: message.author.id});   
      if(!user) return client.embed(message.channel, {
        name: " | You must pick your starter Pokemon with .start before using this command.",
        av: message.author.avatarURL({format: "png", dynamic: true})
      })
      if (!user.pokemons[0]) {
        return message.channel.send("You do not have any pokémon. Please pick it using ``.start`` command");
      }else{
        let chunks = 0;
        const dex = fs.readFileSync("./db/dex.txt").toString().replace(/ +/g, "-").trim().split("\n").map(r => r.trim());
        let n = 0;
        const embeddex = new Discord.MessageEmbed()
        .setTitle("Pokedex")
        .setColor("#05f5fc")
        .setDescription(`You've caught ${n} of ${dex.length} pokémon(s).\n\nNothing to show in this page`)
        let txt = []
        for(let i=0;i< dex.length;i++){
          for(let a=0;a< user.pokemons.length;a++){
            if(dex[i].toLowerCase() == user.pokemons[a].name.toLowerCase()){
              txt.push(`${user.pokemons[a].name.capitalize()}`)
            }
          }
        }
        txt = getUnique(txt)
        n = txt.length
        chunks = n/20
        if(chunks > chunks.toFixed(0)){
          chunks += 1
        }
        if(chunks < 1){
          chunks = 1
        }
        for(let a=0;a<txt.length && a<20;a++){
          embeddex.addField(
          `${txt[a]}`,
          `Caught`, true
          )
          embeddex.setDescription(`You've caught ${n} of ${dex.length} pokémon(s).`)
        }
        embeddex.setFooter(`Showing 1-${chunks.toFixed(0)} of ${n} pokémon matching this search.`);
        embeddex.setThumbnail(message.author.avatarURL({dynamic: true}))
        return message.channel.send(embeddex)
      }
    }
    let user = await User.findOne({id: message.author.id});   
    if(!user) return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with .start before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
    if (!user.pokemons[0]) {
      return message.channel.send("You do not have any pokémon. Please pick it using ``.start`` command");
    }
    if(message.content.endsWith(Number(args[0]))){
      let chunks = 0;
      const dex = fs.readFileSync("./db/dex.txt").toString().replace(/ +/g, "-").trim().split("\n").map(r => r.trim());
      let n=0;
      let txt = []
      for(let i=0;i< dex.length;i++){
        for(var a=0;a< user.pokemons.length;a++){
          if(dex[i].toLowerCase() == user.pokemons[a].name.toLowerCase()){
            txt.push(`${user.pokemons[a].name.capitalize()}`)
          }
        }
      }
      txt = getUnique(txt)
      let page = 0;
      let msw = 0;
      n = txt.length
      chunks = n/20
      if(chunks > chunks.toFixed(0)){
        chunks += 1
      }
      if(chunks < 1){
        chunks = 1
      }
      if(args[0] == 1){
        page = 0
        msw = 0
      }
      else{
        page = args[0]-1
        msw = (args[0]-1)*20-1
      }
      const embeddex = new Discord.MessageEmbed()
      .setTitle("Pokedex")
      .setColor("#05f5fc")
      .setDescription(`You've caught ${n} of ${dex.length} pokémon(s).\n\nNothing to show in this page`)
      for(let a=msw;a<txt.length && a<msw+20;a++){
        embeddex.addField(
          `${txt[a]}`,
          `Caught`, true
        )
        embeddex.setDescription(`You've caught ${n} of ${dex.length} pokémon(s).`)
      }
      embeddex.setFooter(`Showing ${args[0]}-${chunks.toFixed(0)} of ${n} pokémon matching this search.`);
      embeddex.setThumbnail(message.author.avatarURL({dynamic: true}))
      return message.channel.send(embeddex)
    }
    var arg = args.join('-');
    const dexsrc = arg.replace(/-+/g, " ")
    for(var i = 0;i < altnames.length;i++){
      let org = []
      altnames[i].jpname.toLowerCase().split(" | ").forEach(name => {
      org.push(name.replace(" ", "-"))
      })
      for(let a = 0;a < org.length; a++){
        if(org[a] == arg.toLowerCase().replace(" ", "-")){
          let og = `${org[0]} | ${org[1]} | ${org[2]}`
          arg = arg.replace(arg,og.toLowerCase().replace("-", " "))
        }
      }
    }
    const altjp = altnames.find(e => e.jpname.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    const altfr = altnames.find(e => e.frname.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    const altde = altnames.find(e => e.dename.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    if(altfr){
      arg = arg.toLowerCase().replace(altfr.frname.toLowerCase(), altfr.name.toLowerCase())
    }
    if(altjp){
      arg = arg.toLowerCase().replace(altjp.jpname.toLowerCase(), altjp.name.toLowerCase())
    }
    else if(altde){
      arg = arg.toLowerCase().replace(altde.dename.toLowerCase(), altde.name.toLowerCase())
    }
    const alt = altnames.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    var finder = "";
    var vf = false;
    let dexs;
    let num = 0;
    if(Number(args[0])){
      dexs = dexsrc.replace(" ", "-")
      dexs = dexsrc.replace(`${Number(args[0])} `, ``)
    }
    else{
      dexs = dexsrc.replace(" ", "-")
    }
    for(var i=0;i<altnames.length;i++){
      if(altnames[i].name.toLowerCase().includes(dexs.toLowerCase()) && altnames[i].name.toLowerCase() !== dexs.toLowerCase()){
        finder += altnames[i].name.capitalize() + "\n"
        vf = true
        if(dexs.toLowerCase() == "mew"){
          vf = false
        }
        num += parseInt(1);
      }
    }
    if(vf == true && !alt && !altfr && !altde && !altjp){
      if(Number(args[0])){      
        var lines = finder.split("\n");
        var txt = ""
        let chunks = 0;
        if(args[0] == 1){
          for (var i = args[0]*0; i < 20+(args[0]-1)*20; i++) {
            txt += lines[i] + "\n"
          }
        }
        else{
          for (var i = (args[0]*20)-20; i < 20+(args[0]-1)*20; i++) {
            txt += lines[i] + "\n"
          }
        }
        chunks = num/20
        if(chunks > chunks.toFixed(0)){
          chunks += 1
        }
        if(chunks < 1){
          chunks = 1
        }
        var finaltxt = txt.replace(/undefined\n+/g, "")
        var text= `${finaltxt}`
        let embed = new Discord.MessageEmbed()
        .setTitle(`Invalid pokemon ❎. Did you want to search:`)
        .setColor('#05f5fc')
        .setDescription(text)
        .setFooter(`Showing ${args[0]}-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
        return message.channel.send(embed)
      }
      else{
        let chunks = 0;
        var lines = finder.split("\n");
        var txt = ""
        for (var i = 0; i < 20+(1-1)*20; i++) {
          txt += lines[i] + "\n"
        }
        chunks = num/20
        if(chunks > chunks.toFixed(0)){
          chunks += 1
        }
        if(chunks < 1){
          chunks = 1
        }
        var finaltxt = txt.replace(/undefined\n+/g, "")
        var text= `${finaltxt}`
        let embed = new Discord.MessageEmbed()
        .setTitle(`Invalid pokemon ❎. Did you want to search:`)
        .setColor('#05f5fc')
        .setDescription(text)
        .setFooter(`Showing 1-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
        return message.channel.send(embed)
      }
    }
    const pm = pokemon.find(e => e.name === arg.toLowerCase().replace("shiny-",""))
    const fm = forms.find(e => e.name === arg.toLowerCase().replace("shiny-",""))
    const g8 = gen8.find(e => e.name === arg.toLowerCase().replace("shiny-",""))
    const g = galarians.find(e => e.name === arg.toLowerCase().replace("galarian-", "").replace("shiny-",""))
    const sm = shadow.find(e => e.name === arg.toLowerCase().replace("shadow-", ""))
    const cp = concept.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    const ai = attacks.find(e => e.Name.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    const lu = levelup.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-",""))
    
    if(!arg) return message.channel.send("Please specify a pokemon!")
    if(g && arg.toLowerCase().startsWith("galarian")){
      let pm = g
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`Galarian ${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    if(cp){
      let pm = cp
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    if(sm && arg.toLowerCase().startsWith("shadow")){
      let pm = sm
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`Shadow ${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    if(arg.toLowerCase().startsWith("ash")){
      const real=arg.replace("-"," ")
      const ar = arg.replace("ash-", "")
		  var pkmn = real.toLowerCase();
      if(pkmn.toLowerCase() == "ash greninja"){
        var url = "https://imgur.com/Mm4JEF8.png"
      }
		  for(var i=0;i<pokemon.length;i++){
			  if(pkmn == pokemon[i]._engName.toLowerCase()){
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`${pokemon[i]._engName.replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pokemon[i]._type}\n\n__**Base Stats**__\n**HP:** ${pokemon[i]._baseStats._hp}\n**Attack:** ${pokemon[i]._baseStats._atk}\n**Defense:** ${pokemon[i]._baseStats._def}\n**Sp.Atk:** ${pokemon[i]._baseStats._sAtk}\n**Sp.Def:** ${pokemon[i]._baseStats._sDef}\n**Speed:** ${pokemon[i]._baseStats._spd}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: url}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
    }
    }
    if(arg.toLowerCase().startsWith("shiny-ash")){
      const argu = arg.replace("shiny-","")
      const real=argu.replace("-"," ")
		  var pkmn = real.toLowerCase();
      if(pkmn.toLowerCase() == "ash greninja"){
        var url = "https://imgur.com/u02oaEZ.png"
      }
		  for(var i=0;i<pokemon.length;i++){
			  if(pkmn == pokemon[i]._engName.toLowerCase()){
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ ${pokemon[i]._engName.replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pokemon[i]._type}\n\n__**Base Stats**__\n**HP:** ${pokemon[i]._baseStats._hp}\n**Attack:** ${pokemon[i]._baseStats._atk}\n**Defense:** ${pokemon[i]._baseStats._def}\n**Sp.Atk:** ${pokemon[i]._baseStats._sAtk}\n**Sp.Def:** ${pokemon[i]._baseStats._sDef}\n**Speed:** ${pokemon[i]._baseStats._spd}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: url}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
    }
    }
    if(arg.toLowerCase().startsWith("mega-") || arg.startsWith("shiny-mega")){
      const real=arg.replace("mega-","")
      const ar = real.replace("shiny-", "")
		  var pkmn = ar.toLowerCase();
      for(var i=0;i<mega.length;i++){
			  if(ar == mega[i].name.toLowerCase()){
          const Embed = new Discord.MessageEmbed()
          if(arg.startsWith("mega-")){
            Embed.setTitle(`Mega ${mega[i].name.capitalize().replace(/-+/g, " ")}'s info`)
            Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${mega[i].type.capitalize()}\n\n__**Base Stats**__\n**HP:** ${mega[i].hp}\n**Attack:** ${mega[i].atk}\n**Defense:** ${mega[i].def}\n**Sp.Atk:** ${mega[i].spatk}\n**Sp.Def:** ${mega[i].spdef}\n**Speed:** ${mega[i].speed}`)
            name = "Pokemon.png"
            Embed.attachFiles([{name: name, attachment: mega[i].url}])
            .setImage("attachment://"+name)
          }
          if(arg.startsWith("shiny-mega")){
            Embed.setTitle(`⭐ Mega ${megashiny[i].name.capitalize().replace(/-+/g, " ")}'s info`)
            Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${mega[i].type.capitalize()}\n\n__**Base Stats**__\n**HP:** ${mega[i].hp}\n**Attack:** ${mega[i].atk}\n**Defense:** ${mega[i].def}\n**Sp.Atk:** ${mega[i].spatk}\n**Sp.Def:** ${mega[i].spdef}\n**Speed:** ${mega[i].speed}`)
            name = "Pokemon.png"
            Embed.attachFiles([{name: name, attachment: megashiny[i].url}])
            .setImage("attachment://"+name)
          }
          Embed.setColor("#05f5fc") 
          return message.channel.send(Embed)
      }
    }
    }
    if(arg.toLowerCase().startsWith("primal")){
      let p;
      if(arg.toLowerCase() === "primal-kyogre") {
        p = primal[0]
        const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`Primal ${p.name.replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: p.url}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
      if(arg.toLowerCase() === "primal-groudon") {
        p = primal[1]
        const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`Primal ${p.name.replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: p.url}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
      else{
        return message.channel.send(`${arg.replace(/-+/g, " ")} doesn't seem to appear in the Pokedex!`)
      }
    }
    if(arg.toLowerCase().startsWith("shiny")){
      var ar = arg.toLowerCase().replace("shiny-", "")
      var realname = ar      
      ar = realname.replace("alolan-", "");
      if(message.content.includes("alolan")){
        ar = `${ar.toLowerCase()}-alola`
      }
      let p;
      if(ar.toLowerCase() === "primal-kyogre") {
        p = primal[0]
        const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ Primal ${p.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: "https://i.imgur.com/XdZwD0s.png"}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
      if(ar.toLowerCase() === "primal-groudon") {
        p = primal[1]
        const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ Primal ${p.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
          Embed.setColor("#05f5fc") 
          name = "Pokemon.png"
          Embed.attachFiles([{name: name, attachment: "https://i.imgur.com/Xzm1FDn.png"}])
          .setImage("attachment://"+name)
          return message.channel.send(Embed)
      }
      if(pm && arg.toLowerCase() === `shiny-${pm.name}`){
    let pms = pm
    const s = shiny.find(e => e.name === arg.replace("shiny-","").toLowerCase())
    if(pms) {
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`⭐ ${pms.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pms.type}\n\n__**Base Stats**__\n**HP:** ${pms.hp}\n**Attack:** ${pms.atk}\n**Defense:** ${pms.def}\n**Sp.Atk:** ${pms.spatk}\n**Sp.Def:** ${pms.spdef}\n**Speed:** ${pms.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      url = s.url
      Embed.attachFiles([{name: name, attachment: url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }}
    if(g && arg.toLowerCase() === `shiny-galarian-${g.name}`){
    let pms = g
    const s = shiny.find(e => e.name === arg.replace("shiny-","").toLowerCase())
    if(pms) {
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`⭐ Galarian ${pms.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pms.type}\n\n__**Base Stats**__\n**HP:** ${pms.hp}\n**Attack:** ${pms.atk}\n**Defense:** ${pms.def}\n**Sp.Atk:** ${pms.spatk}\n**Sp.Def:** ${pms.spdef}\n**Speed:** ${pms.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      url = s.url
      if(!url.endsWith(".png")){
        url = s.url+ ".png"
      }
      Embed.attachFiles([{name: name, attachment: url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }}
    if(fm && arg.toLowerCase() === `shiny-${fm.name}`){
    let fms = fm
    const s = shiny.find(e => e.name === arg.replace("shiny-","").toLowerCase())
    if(fms) {
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`⭐ ${fms.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${fms.type}\n\n__**Base Stats**__\n**HP:** ${fms.hp}\n**Attack:** ${fms.atk}\n**Defense:** ${fms.def}\n**Sp.Atk:** ${fms.spatk}\n**Sp.Def:** ${fms.spdef}\n**Speed:** ${fms.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      url = s.url
      Embed.attachFiles([{name: name, attachment: url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }}
    if(g8 && arg.toLowerCase() === `shiny-${g8.name}`){
    let gs = g8
    const s = shiny.find(e => e.name === arg.replace("shiny-","").toLowerCase())
    if(gs) {
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`⭐ ${gs.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${gs.type}\n\n__**Base Stats**__\n**HP:** ${gs.hp}\n**Attack:** ${gs.atk}\n**Defense:** ${gs.def}\n**Sp.Atk:** ${gs.spatk}\n**Sp.Def:** ${gs.spdef}\n**Speed:** ${gs.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      url = s.url
      Embed.attachFiles([{name: name, attachment: url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }}
      const options1 = {
        url: `https://pokeapi.co/api/v2/pokemon/${ar.toLowerCase()}`,
        json: true
      };
      if(ar.toLowerCase() === "giratina") options1.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
      if(ar.toLowerCase() === "deoxys") options1.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
      if(ar.toLowerCase() === "nidoran") options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
      if(ar.toLowerCase().startsWith("nidoran-m")) options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
      if(ar.toLowerCase().startsWith("nidoran-f")) options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f"
      get(options1).then(async body => { 
      const Embed = new Discord.MessageEmbed()
      if(!message.content.includes("alolan")){
      Embed.setTitle(`⭐ ${body.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)}else{
      Embed.setTitle(`⭐ Alolan ${args.slice(2).join(' ').capitalize()}`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
      }
      Embed.setColor("#05f5fc") 
      Embed.attachFiles([{name: "Pokemon.gif", attachment: `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`}])
      .setThumbnail("attachment://"+"Pokemon.gif")
      var name; //= "Pokemon.gif";
      if(realname.toLowerCase() === "nidoran") realname = "nidoran-m"
      if(realname.toLowerCase().startsWith("nidoran-m")) realname = "nidoran-m"
      if(realname.toLowerCase().startsWith("nidoran-f")) realname = "nidoran-f"
      var url; 
        const pokemon = shiny.find(e => e.name === realname.toLowerCase())
        if(!pokemon) {
        url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`
        name = "Pokemon.gif"}
        if(pokemon){ 
        url = pokemon.url
        name = "Pokemon.png"}
      Embed.attachFiles([{name: name, attachment: url}])
      .setImage("attachment://"+name)
      /*Embed.attachFiles([{name: "Pokemon.gif", attachment: `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`}])
      .setThumbnail("attachment://"+"Pokemon.gif") */
      message.channel.send(Embed)
      }).catch(() => 
	      message.channel.send(`${dexsrc} doesn't seem to appear in the Pokedex!`)
	    )
      }
      
    else{
    if(g8){
      let pm = g8
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    if(fm){
      let pm = fm
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    if(pm){
      const Embed = new Discord.MessageEmbed()
      Embed.setTitle(`${pm.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**Type:** ${pm.type}\n\n__**Base Stats**__\n**HP:** ${pm.hp}\n**Attack:** ${pm.atk}\n**Defense:** ${pm.def}\n**Sp.Atk:** ${pm.spatk}\n**Sp.Def:** ${pm.spdef}\n**Speed:** ${pm.speed}`)
      Embed.setColor("#05f5fc") 
      name = "Pokemon.png"
      Embed.attachFiles([{name: name, attachment: pm.url}])
      .setImage("attachment://"+name)
      return message.channel.send(Embed)
    }
    var nm = arg;
    if(arg.toLowerCase().startsWith("alolan-")) {
      arg = arg.toLowerCase().replace(`alolan-`, "");
      arg = `${arg.toLowerCase()}-alola`;
    }
      const options = {
      url: `https://pokeapi.co/api/v2/pokemon/${arg.toLowerCase()}`,
      json: true
    };
    if(arg.toLowerCase() === "giratina") options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
    if(arg.toLowerCase() === "deoxys") options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
    if(arg.toLowerCase() === "shaymin") options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land"
    if(arg.toLowerCase() === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
    if(arg.toLowerCase().startsWith("nidoran-m")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
    if(arg.toLowerCase().startsWith("nidoran-f")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f"
    if(arg.toLowerCase().startsWith("porygon z") || arg.toLowerCase().startsWith("porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
    get(options).then(async body => { 
      let stats = Math.round(
        (body.stats[5].base_stat +
          body.stats[4].base_stat +
          body.stats[3].base_stat +
          body.stats[2].base_stat +
          body.stats[1].base_stat +
          body.stats[0].base_stat) 
      );
      var uri;
      let imgname = "Pokemon.jpg";
      let Embed = new Discord.MessageEmbed()
      .setTitle(`${body.name.replace(/-+/g, " ").capitalize()}'s info`)
      .setColor("#05f5fc")
      .setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
      if(!arg.toLowerCase().startsWith("porygon z") || arg.toLowerCase().startsWith("porygon-z")){
        Embed.setThumbnail(`https://raw.githubusercontent.com/jsziede/pokebot/master/gfx/models/${arg.toLowerCase()}.gif`)
      }
      if(body.types[1] != null) Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize().replace(/-+/g, " ")} | ${body.types[1].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
      Embed.setImage(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/salamence.png`)
      if (getlength(body.id) === 1) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${body.id}.png`
      }
      if (getlength(body.id) === 2) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${body.id}.png`
      }
      if (getlength(body.id) === 3) {
         uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${body.id}.png`
      }
      if (getlength(body.id) === 5 && arg.toLowerCase().startsWith("giratina-origin")) {
         uri = `https://imgur.com/UHVxS2q.png`
      }
      if(arg.toLowerCase() == "shellos") uri = "https://imgur.com/0TNMAHQ.png"
      if(arg.toLowerCase() == "jellicent") uri = "https://imgur.com/tMspIRX.png"
      else if(getlength(body.id) > 3 && arg.endsWith("-alola")) {
      const c = await P.getPokemonByName(arg.replace("-alola", ""))
      const ch = getlength(c.id);
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${c.id}_f2.png`
      if(ch === 1) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${c.id}_f2.png`
      }else if(ch === 2) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${c.id}_f2.png`
      }else if(ch === 3) {
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${c.id}_f2.png`
      }
      arg = nm;
      Embed.attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      .setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**`: "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}`: "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}`: "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
      .setTitle(`${nm.capitalize()}'s info`)  
    }
      Embed.attachFiles([{name: imgname, attachment: uri}])
      .setImage("attachment://"+imgname)
      
      if(arg[0].toLowerCase() == "giratina") Embed.setTitle("Giratina")
      if(arg[0].toLowerCase() === "deoxys") Embed.setTitle("Deoxys")
      message.channel.send(Embed)
    }).catch(() => 
	      message.channel.send(`${dexsrc} doesn't seem to appear in the Pokedex!`)
	    )
      }}
  }
  
  
function getUnique(array){
        var uniqueArray = [];
        
        // Loop through array values
        for(var value of array){
            if(uniqueArray.indexOf(value) === -1){
                uniqueArray.push(value);
            }
        }
        return uniqueArray;
}
