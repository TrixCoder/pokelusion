var pokemon = require("./../../db/pokemon.js");
const Discord = require("discord.js")
const User = require('../../models/user.js');
const hastebin = require("hastebin-gen");
const Guild = require('../../models/guild.js')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
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
let result;

module.exports = {
  name: "pokemon",
  category: "Information",
  description: "Check your pokémons.",
  usage: "pokemon [page number]",
  aliases: ["p"],
  run: async(client, message, args) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user) {
      return client.embed(message.channel, {
      name: ` | You must pick your starter pokémon with ${nguild.prefix}start before using this command.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
      });
    };
    if(message.content.includes(`${nguild.prefix}p add`) || message.content.includes(`${nguild.prefix}pokemon add`)) return;
    
     
    let e = message,
        n = args.join(" "),
        a = user,
        i = nguild,
        s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
        zbc = {};
  
  n.split(/--|—/gmi).map(x=>{
    if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
  })

   if(zbc["legendary"] || zbc["l"]) s = s.filter(e=>{if(legends.includes(e.name.capitalize().replace(/-+/g, " "))) return e });
   if(zbc["mythical"] || zbc["m"]) s = s.filter(e=>{if(mythics.includes(e.name.capitalize().replace(/-+/g, " "))) return e });
   if(zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e=>{if(ub.includes(e.name.capitalize().replace(/-+/g, " "))) return e });
   if(zbc["mega"] || zbc["mg"]) s = s.filter(e=>{if((e.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
   if(zbc["alolan"] || zbc["a"]) s = s.filter(e=>{if(alolans.includes(e.name.capitalize().replace(/-+/g, " "))) return e });
   if(zbc["galarian"]) s = s.filter(e=>{if(galarians.includes(e.name.capitalize().replace(/-+/g, " "))) return e; })
   if(zbc["shiny"]|| zbc["s"]) s = s.filter( e=>{ if (e.shiny) return e });
   if(zbc["name"] || zbc["n"]) s = s.filter(e=>{ if (e && (zbc['name'] || zbc['n']) == e.name.toLowerCase().replace(/-+/g, ' ')) return e });
   if(zbc["nick"] || zbc["nickname"]) s = s.filter(e=>{ if (e.nick && (zbc['nick'] || zbc["nickname"]) == e.nick.toLowerCase().replace(/-+/g, ' ')) return e });
   if(zbc.fav) s = s.filter(e=>{ if (e.fav) return e });
   if(zbc['type'] || zbc["tp"]) s = s.filter(e=>{if (e.rarity.match(new RegExp((zbc['type'] || zbc["tp"]),"gmi")) != null) return e });
   if(user.orderIV == true) s = s.sort((a,b)=>{return b.totalIV - a.totalIV})
   if(user.orderAlphabet == true)s = s.sort((a,b)=>{
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
   })



  let txt;
  let num = 0
  let embed = new Discord.MessageEmbed()
  let chunks = chunk(s, 20)
    let index = 0;
    if(Number(args[0])) index = parseInt(args[0])-1
    let ix = (( index % chunks.length) + chunks.length) % chunks.length;
    let actualpage = index + 1
    index = ((index % chunks.length) + chunks.length) % chunks.length;
    if(isNaN(e[0])) txt = s.map((item, i) => `**${item.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ${item.shiny ? ":star:" : ""} | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`).slice(0, 20).join("\n")
    if(Number(args[0])){
      if(txt == ""){
        txt += "Nothing to show"
      }
      if(chunks.length == 0){
        chunks.length = 1
      }
      embed
      .setTitle(`${e.author.tag}'s pokemon:`)
      .setColor('#05f5fc')
      .setDescription((chunks[index].map((item, i) =>{ return `**${item.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ${item.shiny ? ":star:" : ""} | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}`: "")}`}).join("\n")))
      if(args[0] > chunks.length){
        embed.setDescription("Nothing to show")
      }
      embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${s.length} pokémon matching this search.`);
      return e.channel.send(embed)
    }
    else{    
      if(txt == ""){
        txt += "Nothing to show"
      }
      if(chunks.length == 0){
        chunks.length = 1
      }
      let embed = new Discord.MessageEmbed()
      .setTitle(`${e.author.tag}'s pokemon:`)
      .setColor('#05f5fc')
      .setDescription(txt)
      .setFooter(`Showing 1-${chunks.length} of ${s.length} pokémon matching this search.`);
      return e.channel.send(embed)
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

function fa(c, r) {
            let l = [];
            if (c.match(r) == null)
                return [];
            let b = c.match(r)[0];
            l.push(b.match(/[<>]/gim)[0], b.match(/\d+/gim)[0]);
            return l;
        }
