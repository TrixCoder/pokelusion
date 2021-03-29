const Discord = require("discord.js")
var attacks = require("./../../db/attacks.js");
var Pokemon = require("./../../db/pokemon.js");
const User = require('../../models/user.js');
const Server = require('../../models/guild.js')
const { get } = require('request-promise-native')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const {getlength} = require("./../../functions.js");

module.exports = {
  name: "learn",
  category: "Information",
  description: "Gives moves info of a particular pokemon",
  usage: "Example: ``.moves``",
  aliases: ["l"],
  run: async(client, message, args) => {
    let user = await User.findOne({id: message.author.id});
    let nguild = await Server.findOne({id: message.guild.id})
    if(!user) return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with ``.start`` before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
    
    if (!user.pokemons[0]) {
      return message.channel.send("You do not have any pokémon. Please pick it using ``.start`` command");
    }

    if (!user.selected) return message.channel.send("You did not select any pokemon. Please select a pokemon first using ``.select number``. Example: ``.select 1``");
   
      var selected = user.selected - 1;
      let z;
     let poke = user.pokemons[selected]

    
const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${poke.name.toLowerCase()}`,
        json: true
      };
      
let moves = {}; z = await get(options).catch(er=>{if(er.message.includes(`404 - "Not Found"`)) return message.reply("Moves of **"+name.replace("-", " ")+"** Are still being worked on!")})
     
Object.entries(z.moves).forEach((v)=>{
    if(v[1].version_group_details) {
        let temp_z = v[1].version_group_details.filter((move)=>{ if(move.move_learn_method.name == "level-up") return move });
        temp_z = temp_z.map(move=>{ if(move.move_learn_method.name == "level-up") return {name: move.move, level: move.level_learned_at} })
   if(temp_z.length > 0) moves[v[1].move.name] = temp_z[(temp_z.length - 1)].level;
    }
});
    let avail = Object.entries(moves).filter(e=>e[1] <= user.pokemons[selected].level)
      avail = avail.map(x=>{ return `${(x[0].charAt(0).toUpperCase() + x[0].substr(1))}` }).join("\n");
    
    var move = args.filter(a=>!parseInt(a)).map(a=>a).join("-")
    move = move.charAt(0).toUpperCase()+move.substr(1).toLowerCase()//a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()).join("-")
    var place = args[args.length-1]

    console.log(avail, move)
  if(!move || !avail.includes(move)) return message.reply("Invalid move")
    if(!parseInt(place)) return message.reply("<prefix>learn <move> <position>")
    if(poke.moves.length === 4){
  
      message.channel.send(`Replaced ${poke.moves[Number(place)-1].name} with ${move.replace("-", " ")}`)
      poke.moves[Number(place)-1].name = move.replace("-", " ")
      await user.markModified(`pokemons`)
      await user.markModified(`moves`)
      await user.save()
    }else{
      poke.moves.push({name: "Tackle"}, {name: "Tackle"}, {name: "Tackle"}, {name: "Tackle"})
      
      message.channel.send(`Replaced ${poke.moves[Number(place)-1].name} with ${move.replace("-", " ")}`)
      poke.moves[Number(place)-1].name = move.replace("-", " ")
      await user.markModified(`pokemons`)
      await user.markModified(`moves`)
      await user.save()
    }
 
    
     
   }
}
