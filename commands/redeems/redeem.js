const User = require('../../models/user.js');
const {MessageEmbed} = require("discord.js");
const pokedex = require("./../../pokedex/index");
const p = new pokedex();
var pkm = require("./../../db/pokemon.js");
const {classToPlain} = require("class-transformer");
const capitalize = function(arg) {
      return arg.charAt(0).toUpperCase() + arg.slice(1);
    };
const pokemon = require("../../Classes/Pokemon");
const {attach} = require('../../functions.js')
var forms = require("./../../db/forms.js");
const Server = require('../../models/guild.js')
const gen8 = require("./../../db/gen8.js");
const galarians = require("./../../db/galarians.js");
const shinydb = require("./../../db/shiny.js");



module.exports = {
  name: "redeem",
  category: 'redeems',
  description: "Check your redeems",
  usage: 'redeem',
  aliases: ["r"],
  run: async(client, message, args) => {
    const nguild = await Server.findOne({id: message.guild.id})
    const user = await User.findOne({id: message.author.id});
    if(!user) {
      return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with .start before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
  };
    if(!args[0]) {
    if(!user.redeems) {
      user.redeems = 0
      await user.save();
    }
    let embed = new MessageEmbed();
    embed.setTitle(`Your Redeems: ${user.redeems} 💸`);
    embed.setDescription(`Redeems are a special type of currency that can be used to get either a pokémon of your choice, or 15,000 credits.`)
    embed.addField(`.redeem <pokémon>`,`Use a redeem to obtain a pokémon of your choice.`)
    embed.addField(`.redeem credits`,`Use a redeem to obtain 15,000 credits.`)
    embed.setFooter(`How do I get redeems? Use .donate command to donate any amount then join our support server and show payment proof to obtain your redeems`)
    embed.setColor("#00f9ff");
    message.channel.send(embed);0
  }else if(args[0] == "credits" || args[0] == "c"){
    if(!user.redeems) {
    await User.findOneAndUpdate({id: message.author.id}, {redeems: 0}, {  new: true })
    return message.channel.send(`You have no redeems to redeem credits.`)
    }
    
    if(user.redeems == 0) {
      return message.channel.send(`You have no redeems to redeem credits.`)
    }
    
    user.redeems = user.redeems - 1;
    user.balance = user.balance + 15000;
    await User.findOneAndUpdate({id: message.author.id}, {redeems: user.redeems, balance: user.balance}, {  new: true })
    return message.channel.send(`You redeemed 15000 credits.`);
  
  }else{// if(!message.content.endsWith(`${nguild.prefix}redeem`) && !message.content.startsWith(`${nguild.prefix}redeem credits`) && !message.content.endsWith(`${nguild.prefix}r`) && !message.content.startsWith(`${nguild.prefix}r credits`) && !message.content.startsWith(`${nguild.prefix}r c`)){
    if(args[0] == "add") {
      return
    }
    if(args[0] == "remove") {
      return
    }
    if(Number(args[0])) {
      return
    }
    if(!user.redeems) {
    await User.findOneAndUpdate({id: message.author.id}, {redeems: 0}, {  new: true })
    return message.channel.send(`You have no redeems to redeem pokemon.`)
    }
    
    if(user.redeems < 1) {
      return message.channel.send(`You have no redeems to redeem pokemon.`)
    }
    
    
      const pokekaname = LowerizeFirstLetter(args.join("-"));
      const ar = pokekaname;
      if(ar.includes("shiny")) return message.reply("Shinys Cant Be Redeemed")

      let f = forms.find(r => r.name === ar);
      if(f) return message.reply("Forms Cant Be Redeemed")
      
    var uri;
    var shiny;
     
    let g = galarians.find(r => r.name === ar.replace("galarian-", ""));
    if(g && ar.startsWith("galarian-")){
      let pk = g
      const gen = (Math.random() * (100 - 0) + 0).toFixed(2)
      if(gen < 1) {
        shiny = true;
      }else{
        shiny = false;
        
      }
      if(shiny == true) {
        let findShiny = shinydb.find(r => r.name === ar);
        uri = findShiny.url;
      }else{
        uri = pk.url
      }
      
      const res = new pokemon({name: capitalize(pokekaname), shiny: shiny, rarity: pk.type, url: uri});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      user.redeems = user.redeems-1
      await user.save().then(() => { 
          return client.embed(message.channel, {
            name: ` | Succesfully Saved ${res.name} In Your Pokémon List`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        }); 
        }).catch((err) => { 
          message.channel.send(`Pokémon name is not valid! Please try again`)
          return console.log(err)
        });
    }
    let pk = pkm.find(r => r.name === ar);
    if(pk) {
      if(pk.name == "maxlord") return message.channel.send(`Pokémon name is not valid or you can't redeem it!`)
      const gen = (Math.random() * (100 - 0) + 0).toFixed(2)
      if(gen < 1) {
        shiny = true;
      }else{
        shiny = false;
      }
      if(shiny == true) {
        let findShiny = shinydb.find(r => r.name === ar);
        uri = findShiny.url;
      }else{
        uri = pk.url
      }
      
      const res = new pokemon({name: capitalize(pokekaname), shiny: shiny, rarity: pk.type, url: uri});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      user.redeems = user.redeems-1
      await user.save().then(() => { 
          return client.embed(message.channel, {
            name: ` | Succesfully Saved ${res.name} In Your Pokémon List`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        }); 
        }).catch((err) => { 
          message.channel.send(`Pokémon name is not valid! Please try again`)
          return console.log(err)
        });
    }
    let g8 = gen8.find(r => r.name === ar);
    if(g8) {
      const gen = (Math.random() * (100 - 0) + 0).toFixed(2)
      if(gen < 1) {
        shiny = true;
      }else{
        shiny = false
      }
      if(shiny == true) {
        let findShiny = shinydb.find(r => r.name === ar);
        uri = findShiny.url;
      }else{
        uri = g8.url
      }
      
      const res = new pokemon({name: capitalize(pokekaname), shiny: shiny, rarity: g8.type, url: uri});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      user.redeems = user.redeems-1
      await user.save().then(() => { 
          return client.embed(message.channel, {
            name: ` | Succesfully Saved ${res.name} In Your Pokémon List`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        }); 
        }).catch((err) => { 
          message.channel.send(`Pokémon name is not valid! Please try again`)
          return console.log(err)
        });
      
    }else{
      if(g8 || pk || g && ar.toLowerCase().startsWith("galarian-")) return
      const t = await p.getPokemonByName(pokekaname).catch((err) => { 
          message.reply(`Pokémon name is not valid or you can't redeem it.`)
          console.log(err)
        });
      const gen = (Math.random() * (100 - 0) + 0).toFixed(2)
      if(gen < 1) {
        shiny = true
        const pkmn = ar
        //let find = gen8.find(r => r.name === pkmn);
        
        for(var i=0;i<pkm.length;i++){
          console.log(pkmn)
	  if(pkmn == pkm[i]._engName.toLowerCase() || pkmn == pkm[i]._frName.toLowerCase() || pkmn == pkm[i]._nb){
              uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`
            }
        } 
      }else if(gen > 1){
        shiny = false
        const check = t.id
        const pokeid = checkl(t.id)
        
        uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${pokeid}.png`
        /*if(check < 10) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
    }
    else if(check < 100) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
    }
    else if(check > 99) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
    }*/
    
      }
      
      var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ")
    
    const res = new pokemon({name: capitalize(pokekaname), shiny: shiny, rarity: type, url: uri});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      user.redeems = user.redeems-1
      await user.save().then(() => { 
          client.embed(message.channel, {
            name: ` | Succesfully Saved ${res.name} In Your Pokémon List`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        }); 
        }).catch((err) => { 
          message.channel.send(`Pokémon name is not valid! Please try again`)
          console.log(err)
        });
    }
    
  }
  }
}

function LowerizeFirstLetter(arg) {
  return arg.charAt(0).toLowerCase() + arg.slice(1);
}

function checkl(num){
  var ID = `00${num}`
  if(num < 100) ID = `0${num}`
  if(num > 99) ID = `${num}`
  return ID
}