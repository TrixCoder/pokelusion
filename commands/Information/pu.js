var pokemon = require("./../../db/pokemon.js");
const Discord = require("discord.js")
const User = require('../../models/user.js');
const hastebin = require("hastebin-gen");
const Guild = require('../../models/guild.js')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const react = ["⏪", "◀️", "▶️", "⏩"]
const ind = 0;
const fs = require("fs");
const legends = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
var forms = require("./../../db/forms.js");
var mega = require("./../../db/mega.js");
var shadow = require("./../../db/shadow.js");
var megashiny = require("./../../db/mega-shiny.js");
var primal = require("./../../db/primal.js");
var shiny = require('./../../db/shiny.js');
var galarians = fs.readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());



module.exports = {
  name: "pu",
  category: "Information",
  description: "Check your pokémons.",
  usage: "pokemon [page number]",
  run: async(client, message, args) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user) {
      return client.embed(message.channel, {
      name: ` | You must pick your starter pokémon with ${nguild.prefix}start before using this command.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
      });
    };
    if(message.content.includes(`${nguild.prefix}p add`) || message.content.includes(`${nguild.prefix}pokemon add`)){
      return
    }
    
    let str = args.join(" ")
    
    let filter = str.trim().split(`--`).filter(r => r !== "");
    let n = "";
    for(i=0;i<filter.length;i++){
      if(filter[i].includes("name ") || filter[i].includes("n ")){
        name = (filter[i].replace("name ",""))
      }
    }
    if(filter.includes("galarian")) {
      let txt = user.pokemons.map((r, i) => {
            r.num = i + 1;
            return r;
          }).filter(r => galarians.some(d => {
        let nameinDB = d.toLowerCase();
        let givenName = r.name.replace(/ /g, "-").toLowerCase()
        
        if(givenName === nameinDB) return true;
        
      }));
      if(Number(args[0])){
        let chunks = chunk(txt, 20);
        let index = args[0]-1;
        let ix = (( index % chunks.length) + chunks.length) % chunks.length;
        const embed = new Discord.MessageEmbed();
        let actualpage = index + 1
        index = ((index % chunks.length) + chunks.length) % chunks.length;
        if(args[0] > chunks.length){
          embed.setDescription(`Nothing to show`)
          embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${txt.length} pokémon matching this search.`);
        }
        else{
          embed.setDescription(chunks[index].map((item, i) => `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).join('\n'))
          embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${txt.length} pokémon matching this search.`);
        }
        embed.setTitle(`${message.author.tag}'s pokemon:`)
        embed.setColor(`#05f5fc`)
        return message.channel.send(embed);
      }
      else{
        let chunks = chunk(txt, 20);
        const embed = new Discord.MessageEmbed();
        if(args[0] > txt.length){
          embed.setDescription(`Nothing to show`)
          embed.setFooter(`Showing 1-1 of ${txt.length} pokémon matching this search.`);
        }
        else{
          embed.setDescription(chunks[0].map((item, i) => `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).join('\n'))
          embed.setFooter(`Showing 1-${chunks.length} of ${txt.length} pokémon matching this search.`);
        }
        embed.setTitle(`${message.author.tag}'s pokemon:`)
        embed.setColor(`#05f5fc`)
        return message.channel.send(embed);
      }
      
    }
    if(filter.includes("legendary") || filter.includes("l")){
      if(Number(args[0])){
        let dir = ``;
        let num =0;
        let chunks = 0;
        if(user.orderIV == true){
          let txt = user.pokemons.map((r, i) => {
            r.num = i + 1;
            return r;
          }).sort((a, b) => {
            return b.totalIV - a.totalIV
          });
          for (var i = 0; i < txt.length; i++) {
            if (legends.includes(txt[i].name.capitalize())) {
              var p = ``
              txt.map((item, i) => {
                return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
              })
              console.log(txt)
              p += txt.slice((args[0]-1)*20, 20+(args[0]-1)*20).join("\n") 
              dir += p
              num += parseInt(1);
            }
          }
          message.channel.send(dir)
        }
        for (var i = 0; i < user.pokemons.length; i++) {
          if (legends.includes(user.pokemons[i].name.capitalize())) {
            var p = ``
            p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
            dir += p
            num += parseInt(1);
          }
        }
        if(dir == ""){
          dir += "Nothing to show"
        }
        chunks = num/20
        if(chunks > chunks.toFixed(0)){
          chunks += 1
        }
        if(chunks < 1){
          chunks = 1
        }
        var lines = dir.split("\n");
        var txt = ""
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
        var finaltxt = txt.replace(/undefined\n+/g, "")
        var text= `${finaltxt}`
        let embed = new Discord.MessageEmbed()
        .setTitle(`${message.author.tag}'s pokemon:`)
        .setColor('#05f5fc')
        .setDescription(text)
        .setFooter(`Showing ${args[0]}-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
        return message.channel.send(embed)
      }
      else{
        let num =0;
        let chunks = 0;
        let dir = ``;
        for (var i = 0; i < user.pokemons.length; i++) {
          if (legends.includes(user.pokemons[i].name.capitalize())) {
            var p = ``
            p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
            dir += p
            num += parseInt(1);
          }
        }
        if(dir == ""){
          dir += "Nothing to show"
        }
        chunks = num/20
        if(chunks > chunks.toFixed(0)){
          chunks += 1
        }
        if(chunks < 1){
          chunks = 1
        }
        var lines = dir.split("\n");
        var txt = ""
        for (var i = 0; i < 20+(1-1)*20; i++) {
          txt += lines[i] + "\n"
        }
        var finaltxt = txt.replace(/undefined\n+/g, "")
        var text= `${finaltxt}`
        let embed = new Discord.MessageEmbed()
        .setTitle(`${message.author.tag}'s pokemon:`)
        .setColor('#05f5fc')
        .setDescription(text)
        .setFooter(`Showing 1-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
        return message.channel.send(embed)
      }
    }
    else if(filter.some(value => value.includes('name')) || filter.some(value => value.includes('n ')) && filter.some(value => value.includes('shiny')) || filter.some(value => value.includes('s'))){
      if(name == ""){
        return message.reply("Please specify a pokemon name. Correct usage: ``<prefix>pokemon --name charmander``.")
      }
      else{
        if(filter.some(value => value.includes('shiny')) || filter.some(value => value.includes('s'))) {
          user.pokemons.filter(r => r.shiny === true);
        }
        if(Number(args[0])){
          if(message.content.toLowerCase().includes("alolan")){
            name = name.replace("-"," ")
          }
          if(message.content.toLowerCase().includes("shiny")){
            name = name.replace("shiny ", "")
          }
          let dir = ``;
          let num =0;
          let chunks = 0;
          for (var i = 0; i < user.pokemons.length; i++) {
            if(user.pokemons[i].shiny && name.toLowerCase() == user.pokemons[i].name.toLowerCase()){
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
            }
          }
          if(dir == ""){
            dir += "Nothing to show"
          }
          chunks = num/20
          if(chunks > chunks.toFixed(0)){
            chunks += 1
          }
          if(chunks < 1){
            chunks = 1
          }
          var lines = dir.split("\n");
          var txt = ""
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
          var finaltxt = txt.replace(/undefined\n+/g, "")
          var text= `${finaltxt}`
          let embed = new Discord.MessageEmbed()
          .setTitle(`${message.author.tag}'s pokemon:`)
          .setColor('#05f5fc')
          .setDescription(text)
          .setFooter(`Showing ${args[0]}-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
          return message.channel.send(embed)
        }
        else{
          if(message.content.toLowerCase().includes("alolan")){
            name = name.replace("-"," ")
          }
          if(message.content.toLowerCase().includes("shiny")){
            name = name.replace("shiny ", "")
          }
          let num =0;
          let dir = ``;
          let chunks=0;
          for (var i = 0; i < user.pokemons.length; i++) {
            if(user.pokemons[i].shiny && name.toLowerCase() == user.pokemons[i].name.toLowerCase()){
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
            }
          }
          if(dir == ""){
            dir += "Nothing to show"
          }
          chunks = num/20
          if(chunks > chunks.toFixed(0)){
            chunks += 1
          }
          if(chunks < 1){
            chunks = 1
          }
          var lines = dir.split("\n");
          var txt = ""
          for (var i = 0; i < 20+(1-1)*20; i++) {
            txt += lines[i] + "\n"
          }
          var finaltxt = txt.replace(/undefined\n+/g, "")
          var text= `${finaltxt}`
          let embed = new Discord.MessageEmbed()
          .setTitle(`${message.author.tag}'s pokémon:`)
          .setColor('#05f5fc')
          .setDescription(text)
          .setFooter(`Showing 1-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
          return message.channel.send(embed)
        }
      }
    }
    else if(filter.some(value => value.includes('name')) || filter.some(value => value.includes('n '))){
      if(name == ""){
        return message.reply("Please specify a pokemon name. Correct usage: ``<prefix>pokemon --name charmander``.")
      }
      else{
        if(Number(args[0])){
          if(message.content.toLowerCase().includes("alolan")){
            name = name.replace("-"," ")
          }
          if(message.content.toLowerCase().includes("shiny")){
            name = name.replace("shiny-", "")
          }
          let dir = ``;
          let num =0;
          let chunks = 0;
          for (var i = 0; i < user.pokemons.length; i++) {
            if (name.toLowerCase() == user.pokemons[i].name.toLowerCase()) {
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
            }
            else if(message.content.includes("shiny") && user.pokemons[i].shiny && name.toLowerCase() == user.pokemons[i].name.toLowerCase()){
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
            }
          }
          if(dir == ""){
            dir += "Nothing to show"
          }
          chunks = num/20
          if(chunks > chunks.toFixed(0)){
            chunks += 1
          }
          if(chunks < 1){
            chunks = 1
          }
          var lines = dir.split("\n");
          var txt = ""
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
          var finaltxt = txt.replace(/undefined\n+/g, "")
          var text= `${finaltxt}`
          let embed = new Discord.MessageEmbed()
          .setTitle(`${message.author.tag}'s pokemon:`)
          .setColor('#05f5fc')
          .setDescription(text)
          .setFooter(`Showing ${args[0]}-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
          return message.channel.send(embed)
        }
        else{
          if(message.content.toLowerCase().includes("alolan")){
            name = name.replace("-"," ")
          }
          if(message.content.toLowerCase().includes("shiny")){
            name = name.replace("shiny-", "")
          }
          let num =0;
          let dir = ``;
          let chunks=0;
          for (var i = 0; i < user.pokemons.length; i++) {
            if (name.toLowerCase() == user.pokemons[i].name.toLowerCase()) {
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
              }
            else if(message.content.includes("shiny") && user.pokemons[i].shiny && name.toLowerCase() == user.pokemons[i].name.toLowerCase()){
              var p = ``
              p +=`${user.pokemons[i].name.capitalize()} ${(user.pokemons[i].shiny ? "⭐": "")} | Level: ${user.pokemons[i].level} | Number: ${i+1} | IV: ${user.pokemons[i].totalIV}%${(user.pokemons[i].nick != null ? ` | Nickname: ${user.pokemons[i].nick}`: "")}\n`
              dir += p
              num += parseInt(1);
            }
          }
          if(dir == ""){
            dir += "Nothing to show"
          }
          chunks = num/20
          if(chunks > chunks.toFixed(0)){
            chunks += 1
          }
          if(chunks < 1){
            chunks = 1
          }
          var lines = dir.split("\n");
          var txt = ""
          for (var i = 0; i < 20+(1-1)*20; i++) {
            txt += lines[i] + "\n"
          }
          var finaltxt = txt.replace(/undefined\n+/g, "")
          var text= `${finaltxt}`
          let embed = new Discord.MessageEmbed()
          .setTitle(`${message.author.tag}'s pokémon:`)
          .setColor('#05f5fc')
          .setDescription(text)
          .setFooter(`Showing 1-${chunks.toFixed(0)} of ${num} pokémon matching this search.`);
          return message.channel.send(embed)
        }
      }
    }
    
    else if(Number(args[0]) && user.pokemons[20] && message.content.startsWith(`${nguild.prefix}pu`) || Number(args[0]) && message.content.startsWith(`${nguild.prefix}pokemonu`)){
      let chunks = chunk(user.pokemons, 20);
      let index = args[0]-1;
      let ix = (( index % chunks.length) + chunks.length) % chunks.length;
      const embed = new Discord.MessageEmbed();
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if(args[0] > chunks.length){
        embed.setDescription(`Nothing to show`)
        embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${user.pokemons.length} pokémon matching this search.`);
      }
      else{
        if(user.orderIV == true){
          let txt = user.pokemons.map((r, i) => {
              r.num = i + 1;
              return r;
            }).sort((a, b) => {
              return b.totalIV - a.totalIV
            }).map((item, i) => {
              return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
            })
          embed.setDescription(txt.slice((args[0]-1)*20, 20+(args[0]-1)*20).join("\n"))
        }else if(user.orderAlphabet == true){
          let txt = user.pokemons.map((r, i) => {
            r.num = i + 1;
            return r;
          }).sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          }).map((item, i) => {
           return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
          })
          embed.setDescription(txt.slice((args[0]-1)*20, 20+(args[0]-1)*20).join("\n"))
        }else{
         embed.setDescription(chunks[index].map((item, i) => `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${no+i+1} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).join('\n'))
        }
        const no = ((index + 1)*20)-20
        embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${user.pokemons.length} pokémon matching this search.`);
      }
      embed.setTitle(`${message.author.tag}'s pokemon:`)
      embed.setColor(`#05f5fc`)
      return message.channel.send(embed); 
    }
    
    else if(user.pokemons[20] && message.content.endsWith(`${nguild.prefix}pu`) || message.content.endsWith(`${nguild.prefix}pokemonu`)){
      let chunks = chunk(user.pokemons, 20);
      let index = 0;
      let ix = (( index % chunks.length) + chunks.length) % chunks.length;
      const embed = new Discord.MessageEmbed();
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      const no = ((index + 1)*20)-20
      embed.setTitle(`${message.author.tag}'s pokemon:`)
      if(user.orderIV == true){
        let txt = user.pokemons.map((r, i) => {
          r.num = i + 1;
          return r;
        }).sort((a, b) => {
          return b.totalIV - a.totalIV
        }).map((item, i) => {
         return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
        })
        embed.setDescription(txt.slice(0, 20).join("\n"))
      }else if(user.orderAlphabet == true){
        let txt = user.pokemons.map((r, i) => {
          r.num = i + 1;
          return r;
        }).sort((a, b) => {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }).map((item, i) => {
         return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
        })
        embed.setDescription(txt.slice(0, 20).join("\n"))
      }else{
        embed.setDescription(chunks[index].map((item, i) => `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${no+i+1} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).join('\n'))
      }
      embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${user.pokemons.length} pokémon matching this search.`);
      embed.setColor(`#05f5fc`)
      return message.channel.send(embed); 
    }else{
      let chunks = chunk(user.pokemons, 20);
      const embed = new Discord.MessageEmbed();
      embed.setTitle(`${message.author.tag}'s pokemon:`)
      if(user.orderIV == true){
        let txt = user.pokemons.map((r, i) => {
          r.num = i + 1;
          return r;
        }).sort((a, b) => {
          return b.totalIV - a.totalIV
        }).map((item, i) => {
         return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
        })
        embed.setDescription(txt.slice(0, 20).join("\n"))
      }else if(user.orderAlphabet == true){
        let txt = txt.map((r, i) => {
          r.num = i + 1;
          return r;
        }).sort((a, b) => {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }).map((item, i) => {
         return `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`
        })
        embed.setDescription(txt.slice(0, 20).join("\n"))
      }else{
        embed.setDescription(chunks[0].map((item, i) => `**${item.name.capitalize()} ${(item.shiny ? "⭐": "")}** | Level: ${item.level} | Number: ${i+1} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).join('\n'))
      }
      embed.setFooter(`Showing 1-1 of ${user.pokemons.length} pokémon matching this search.`);
      embed.setColor(`#05f5fc`)
      return message.channel.send(embed);
    }
    
    
    
  }
}
function chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  }