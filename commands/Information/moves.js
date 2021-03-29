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
  name: "moves",
  category: "Information",
  description: "Gives moves info of a particular pokemon",
  usage: "Example: ``.moves``",
  aliases: ["mv", "mvs"],
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
    var name;
    if (!user.selected) return message.channel.send("You did not select any pokemon. Please select a pokemon first using ``.select number``. Example: ``.select 1``");
   
      var selected = user.selected - 1;
      let z;
    name = user.pokemons[selected].name.toLowerCase()
const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${name}`,
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
      avail = avail.map(x=>{ return `${(x[0].charAt(0).toUpperCase() + x[0].substr(1)).replace("-", " ")}` }).join("\n");
//[Level: ${x[1]}]
    const embed = new Discord.MessageEmbed()
    .setAuthor(`Level ${user.pokemons[selected].level} ${(user.pokemons[selected].name.charAt(0).toUpperCase()+user.pokemons[selected].name.substr(1)).replace("-", " ")}`)
    .setColor(0x00ffff)
    .setDescription("To learn a move, use the `<prefix>learn <move> <position>` command.")
    .addField("**Current Moves**", user.pokemons[selected].moves.map(e=>e.name).join("\n") || "Tackle\nTackle\nTackle\nTackle", true)
    .addField("**Available Moves**", avail, true)
    
 return message.channel.send(embed)//console.log(moves);
    
     
   }
}






//Old Code
/*
for(var i=0; i < attacks.length;i++){
			  if(user.pokemons[selected].name.toLowerCase() === attacks[i].Name.toLowerCase()){
          let atk = attacks[i].Fast_Attacks.map(e=> `${e.Name} - ${e.Damage} Base Power`).join("\n")
          
        let moves;// = user.pokemons[selected].moves
          
         if(!user.pokemons[selected].moves[0]){
          let newmoves = ["Tackle", "Tackle", "Tackle", "Tackle"];
          User.findOne({id: message.author.id}, async (err, res) => {
            if(err) console.log(err)
            res.pokemons[selected].moves.push(newmoves)
            res.markModified(`pokemons[${selected}].moves`); //
            await res.save() 
           let moves = res.pokemons[selected].moves
            const embed = new Discord.MessageEmbed()
          .setAuthor("Level "+user.pokemons[selected].level+" "+res.pokemons[selected].name).setColor(0x00ffff)
          .setDescription(`To Learn A Move, Use The \`${nguild.prefix}learn <move>\` Command.`)
            .addField("Current Moves", `${moves.join("\n")}`, true)
          .addField("Available Moves", `${atk}`, true)
          
            return message.channel.send(embed)
          })
          }else{
        let moves = user.pokemons[selected].moves; console.log(moves+" 3")
          const embed = new Discord.MessageEmbed()
          .setAuthor("Level "+user.pokemons[selected].level+" "+attacks[i].Name).setColor(0x00ffff)
          .setDescription(`To Learn A Move, Use The \`${nguild.prefix}learn <move>\` Command.`)
          .addField("Current Moves", `${moves.replace(",", "\n")}`, true)
          .addField("Available Moves", `${atk}`, true)
          
          return message.channel.send(embed)
          }
          
          
          
				 // var text = "**"+"'s** moves:\n"+`${attacks[i].Fast_Attacks.map(e=> e.Name).join("\n")}`;
	 			  //text += "**"+attacks[i].Fast_Attacks+"** \n";
				  //message.channel.send(text);
        }
       }
*/
/*
let arg = args.join("-")
      const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${arg.toLowerCase()}`,
        json: true
      };
      
      let moves = []
      get(options).then(async body => {
        for(let i=0;i<body.moves.length;i++){
          moves.push(body.moves[i].move.name)
        }
        return message.reply(moves)
      });
*/