var pokemon = require("./../../db/pokemon.js");
const Discord = require("discord.js")
const User = require('../../models/user.js');
var forms = require("./../../db/forms.js");
var mega = require("./../../db/mega.js");
var megashiny = require("./../../db/mega-shiny.js");
var galarians = require("./../../db/galarians.js");
var shadow = require("./../../db/shadow.js");
var primal = require("./../../db/primal.js");
const { get } = require('request-promise-native')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const {getlength} = require("./../../functions.js");
var shiny = require('./../../db/shiny.js')
var gen8 = require('./../../db/gen8.js')
const Guild = require('../../models/guild.js')
const fs = require("fs");
const hastebin = require("hastebin-gen");
var concept = require("./../../db/concept.js");

module.exports = {
  name: "info",
  category: "Information",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["i"],
  run: async(client, message, args) => {
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    let user = await User.findOne({id: message.author.id});   
    if(!user) return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with .start before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
    if (!user.pokemons[0]) {
      return message.channel.send("You do not have any pokémon. Please pick it using .start command");
    if (!user.selelcted){
      return message.channel.send("You did not select any pokemon. Please select a pokemon first using ``.select number``. Example: ``.select 1``");
    }
    }else{
      var selected = user.selected - 1;
      if(!isNaN(args[0])) {
        selected = args[0] - 1;
        if(!user.pokemons[selected]) return message.channel.send(`Hey, ${message.author.username}! You have no pokemon with that number.`);
      }else if(args[0] == "latest" || args[0] === "l") {
        selected = user.pokemons.length - 1
      }
      const s = shiny.find(e => e.name === user.pokemons[selected].name.toLowerCase())
      if(user.pokemons[selected].nature == null){
        var natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Docile", "Bold", "Relaxed", "Impish", "Lax", "Serious", "Timid", "Hasty", "Jolly", "Naive", "Bashful", "Modest", "Mild", "Quiet", "Rash", "Quirky", "Calm", "Gentle", "Sassy", "Careful"]
        user.pokemons[selected].nature = natures[Math.floor(Math.random() * natures.length)]
        await user.markModified(`pokemons`);
        await user.save()
      }
      name = user.pokemons[selected].name.toLowerCase();
      if(name.startsWith("alolan")) {
        name = name.replace("alolan", "").trim().toLowerCase();
        name = `${name}-alola`.toLowerCase();
      }
      if (name == "charmander"){
        var nb = "004"
      }
      if (name == "squirtle"){
        var nb = "007"
      }
      if (name == "bulbasaur"){
        var nb = "001"
      }
      let level = user.pokemons[selected].level
      var nb = user.pokemons[selected]._nb
      //var tp = user.pokemons[selected].rarity;
      var stat1 = user.pokemons[selected].hp
      var stat2 = user.pokemons[selected].atk
      var stat3 = user.pokemons[selected].def
      var stat4 = user.pokemons[selected].spatk
      var stat5 = user.pokemons[selected].spdef
      var stat6 = user.pokemons[selected].speed
      const g8 = gen8.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
      if(g8){
      let hpBase = g8.hp;
      let atkBase = g8.atk;
      let defBase = g8.def;
      let spatkBase = g8.spatk;
      let spdefBase = g8.spdef;
      let speedBase = g8.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = g8.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${g8.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = g8.url
      if(user.pokemons[selected].shiny && s) url = s.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const f = forms.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
      if(f){
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      if(user.pokemons[selected].shiny && s){
        url = s.url
      }
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const cp = concept.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
      if(cp){
      let f = cp
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      if(user.pokemons[selected].shiny && s) url = s.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const g = galarians.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase().replace("galarian-",""))
      if(g && user.pokemons[selected].name.toLowerCase().startsWith("galarian")){
      let f = g
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} Galarian ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      if(user.pokemons[selected].shiny && s) url = s.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const fm = forms.find(e => e.name === name.toLowerCase())
      if(fm){ 
      let f = fm
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      if(user.pokemons[selected].shiny && s) url = s.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const mg = mega.find(e => e.name.toLowerCase() === name.replace("mega-", "").toLowerCase())
      if(mg && name.toLowerCase().startsWith("mega-")){ 
      let f = mg
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
      name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} Mega ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      const mgs = megashiny.find(e => e.name === name.replace("mega-", "").toLowerCase())
      if(user.pokemons[selected].shiny && mgs) url = mgs.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const sm = shadow.find(e => e.name.toLowerCase() === name.replace("shadow-", "").toLowerCase())
      if(sm && name.toLowerCase().startsWith("shadow")){ 
      let f = sm
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
      name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} Shadow ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      const s = shiny.find(e => e.name === name.toLowerCase())
      if(user.pokemons[selected].shiny && s) url = s.url
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      const pm = primal.find(e => e.name === name.replace("primal-","").toLowerCase())
      if(pm && name.toLowerCase().startsWith("primal")){ 
      let f = pm
      let hpBase = f.hp;
      let atkBase = f.atk;
      let defBase = f.def;
      let spatkBase = f.spatk;
      let spdefBase = f.spdef;
      let speedBase = f.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = f.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} Primal ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url = f.url
      if(user.pokemons[selected].shiny){
        if(user.pokemons[selected].name.toLowerCase() == "primal-kyogre"){
          url = "https://i.imgur.com/XdZwD0s.png"
        }
        else if(user.pokemons[selected].name.toLowerCase() == "primal-groudon"){
          url = "https://i.imgur.com/Xzm1FDn.png"
        }
      }
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);  
      
      }
        
      const pk = pokemon.find(e => e.name === user.pokemons[selected].name.toLowerCase())
      if(pk){
      let hpBase = pk.hp;
      let atkBase = pk.atk;
      let defBase = pk.def;
      let spatkBase = pk.spatk;
      let spdefBase = pk.spdef;
      let speedBase = pk.speed;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
              name = user.pokemons[selected].name.toLowerCase();
      var tp = pk.type.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${pk.name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
	    Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      let url;
      if(user.pokemons[selected].shiny && s){
        url = s.url
      }
      if(user.pokemons[selected].shiny && user.pokemons[selected].name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png"){
        url = "https://i.imgur.com/lkx7zZ3.png"
      }
      if(user.pokemons[selected].shiny && user.pokemons[selected].name.toLowerCase() == "meltan"){
        url = "https://i.imgur.com/le2MSsx.png"
      }
      else{
        url = pk.url
      }
      if(url !== user.pokemons[selected].url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons`);
        await user.save()
      }
      Embed.attachFiles([{name: "Pokemon.png", attachment: url}])
      .setImage("attachment://"+"Pokemon.png")
      Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
      return message.channel.send(Embed);
      }
      }
      let level = user.pokemons[selected].level
      P.getPokemonByName(name).then(async function(response){
      let hpBase = response.stats[0].base_stat;
      let atkBase = response.stats[1].base_stat;
      let defBase = response.stats[2].base_stat;
      let spatkBase = response.stats[3].base_stat;
      let spdefBase = response.stats[4].base_stat;
      let speedBase = response.stats[5].base_stat;
      let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0/ 4) * level) /100) + level + 10);
      let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level/100+5) * 0.9);
      let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0/4)) * level/100+5) * 1);
      let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0/4)) * level/100+5) * 1.1);
      let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0/4)) * level/100+5) * 1);
      let fspeed= Math.floor(Math.floor((2 * speedBase + stat6 + (0/4)) * level/100+5) * 1);
      let totaliv = ((stat1+stat2+stat3+stat4+stat5+stat6)/186)*100
      const totalivs = Math.floor(Math.round(totaliv)) 
    
      const finaliv = (totaliv.toFixed(2))
      const options = {
      url: `https://pokeapi.co/api/v2/pokemon/${name}`,
      json: true
    };

let bdy = await get(options)
let id;
if(bdy.id < 10) id = `00${bdy.id}`
else if(bdy.id > 9 && bdy.id < 100) id = `0${bdy.id}`
else if(bdy.id > 99) id = bdy.id
        if(name.endsWith('-alola')) {
          name = name.replace("-alola", "").trim().toLowerCase();
          const t = await P.getPokemonByName(name);
          id = `${t.id}_f2`
          const ch = getlength(t.id);
      if(ch === 1) {
        id = `00${t.id}_f2`
      }else if(ch === 2) {
        id = `0${t.id}_f2`
      }else if(ch === 3) {
        id = `${t.id}_f2` 
      }
        }
        name = user.pokemons[selected].name.toLowerCase();
var tp = bdy.types[0].type.name.capitalize()
      if(isNaN(user.pokemons[selected].xp)){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      if(user.pokemons[selected].xp > user.pokemons[selected].level*100+101){
        user.pokemons[selected].xp = user.pokemons[selected].level*100
        await user.save()
      }
      const Embed = new Discord.MessageEmbed()
  	  Embed.setColor('#05f5fc')
	    Embed.setTitle(`${(user.pokemons[selected].shiny ? "⭐": "")} ${name.capitalize().replace(/-+/g, " ")}'s info`)
      Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${tp}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
      if(bdy.types[1] != null) {
        let body = bdy
        Embed.setDescription(`${(user.pokemons[selected].nick != null ? `**Nickname:** ${user.pokemons[selected].nick}`: "")}\n**Level:**  ${user.pokemons[selected].level} | **XP:** ${user.pokemons[selected].xp}\n**Type:** ${body.types[0].type.name.capitalize().replace(/-+/g, " ")} | ${body.types[1].type.name.capitalize()}\n**Nature:** ${user.pokemons[selected].nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
      }
      Embed.setThumbnail(message.author.avatarURL({dynamic: true}))
      var uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`
        if(name.toLowerCase() == "shellos") uri = "https://imgur.com/0TNMAHQ.png"
        if(name.toLowerCase() == "jellicent") uri = "https://imgur.com/tMspIRX.png"
      if(user.pokemons[selected].name.toLowerCase() === "giratina-origin" && !user.pokemons[selected].shiny) uri = "https://imgur.com/UHVxS2q.png"
      if(user.pokemons[selected].name.toLowerCase() === "eternatus" && user.pokemons[selected].shiny) uri = "https://i.imgur.com/lkx7zZ3.png"
      if(user.pokemons[selected].shiny){
        uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
        const pokemon = shiny.find(e => e.name.toLowerCase().replace("-", " ") === name.toLowerCase().replace("-", " "))
        
        if(pokemon){ 
        uri = pokemon.url
        name = "Pokemon.png"}
        if(name.toLowerCase() == "giratina-origin"){
          uri = `https://imgur.com/UHVxS2q.png`
        }
        if(name.toLowerCase() == "giratina-altered"){
          uri = `https://i.imgur.com/oSe49i5.png`
        }
        let p;
        if(name.toLowerCase() === "primal-kyogre") {
          p = primal[0]
          uri = "https://i.imgur.com/XdZwD0s.png"}
        if(name.toLowerCase() === "primal-groudon") {
          p = primal[1]
          uri = "https://i.imgur.com/Xzm1FDn.png"}
      }
      if(uri !== user.pokemons[selected].url){
        user.pokemons[selected].url = uri
        await user.markModified(`pokemons`);
        await user.save()
      }
  let imgname = "Pokemon.png";
  if(uri.endsWith(".gif")) imgname = "Pokemon.gif"
  Embed.attachFiles([{name: imgname, attachment: uri}])
  .setImage("attachment://"+imgname)
  Embed.setFooter(`Displaying Pokémon: ${selected+1}/${user.pokemons.length}`)
  message.channel.send(Embed);
    }).catch((err) => {
        message.reply("An error occured to info the pokemon. Please contact to developers of the bot")
      })//console.log(err));
      
    }
  }
