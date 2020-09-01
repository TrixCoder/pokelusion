var pokemon = require("./../../db/pokemon.js");
const User = require('../../models/user.js');
var forms = require("./../../db/forms.js");
var mega = require("./../../db/mega.js");
var megashiny = require("./../../db/mega-shiny.js");
var galarians = require("./../../db/galarians.js");
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
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const {MessageEmbed, MessageCollector} = require("discord.js");
const cooldown = new Set();
const fetch = require("node-fetch");

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

function randomNum (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: `duel`,
  category: 'Duel',
  description: `Duel with anyone.`,
  usage: '.duel @user',
  run: async (bot, message, args, prefix) => {
    const embed = new MessageEmbed()
    let nguild = await Guild.findOne({ id: message.guild.id });
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    let user = await User.findOne({id: message.author.id}); 
    var u1 = message.mentions.users.first()
    if(!u1){
      return message.reply(`Please mention a user in order to start duel match. Correct usage: \`${nguild.prefix}duel @user\`.`)
    }
    if(u1.id == message.author.id){
      return message.reply("You can't duel yourself.")
    }
    let user1 = await User.findOne({id: u1.id}); 
    if(!user) return bot.embed(message.channel, {
      name: `| You must pick your starter Pokemon with ${nguild.prefix}start before dueling.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
    if (!user.pokemons[0]) {
      return message.channel.send(`You do not have any pokémon. Please pick it using ${nguild.prefix}start command`);
    }
    if (!user.selected){
      return message.channel.send(`You did not select any pokemon. Please select a pokemon first using ${nguild.prefix}select number. Example:${nguild.prefix}select 1`);
    }
    if(!user1) return bot.embed(message.channel, {
      name: ` | Mentioned user must pick a starter Pokemon using ${nguild.prefix}start before dueling.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
    if (!user1.pokemons[0]) {
      return message.channel.send(`Mentioned user do not have any pokémon. Please pick it using ${nguild.prefix}start command`);
    }
    if (!user1.selected){
      return message.channel.send(`Mentioned user did not select any pokemon. Please select a pokemon first using ${nguild.prefix}select number. Example: ${nguild.prefix}select 1`);
    }
    
    var selected = user.selected - 1;
    var selected1 = user1.selected - 1;
    if(user.pokemons[selected].nature == null){
      var natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Docile", "Bold", "Relaxed", "Impish", "Lax", "Serious", "Timid", "Hasty", "Jolly", "Naive", "Bashful", "Modest", "Mild", "Quiet", "Rash", "Quirky", "Calm", "Gentle", "Sassy", "Careful"]
      user.pokemons[selected].nature = natures[Math.floor(Math.random() * natures.length)]
      await user.markModified(`pokemons`);
      await user.save()
    }
    if(user1.pokemons[selected1].nature == null){
      var natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Docile", "Bold", "Relaxed", "Impish", "Lax", "Serious", "Timid", "Hasty", "Jolly", "Naive", "Bashful", "Modest", "Mild", "Quiet", "Rash", "Quirky", "Calm", "Gentle", "Sassy", "Careful"]
      user1.pokemons[selected1].nature = natures[Math.floor(Math.random() * natures.length)]
      await user1.markModified(`pokemons`);
      await user1.save()
    }
    var name = user.pokemons[selected].name.toLowerCase();
    if(name.startsWith("alolan")) {
      name = name.replace("alolan", "").trim().toLowerCase();
      name = `${name}-alola`.toLowerCase();
    }
    var name1 = user1.pokemons[selected1].name;
    if(name1.toLowerCase().startsWith("alolan")) {
      name1 = name1.replace("alolan", "").trim().toLowerCase();
      name1 = `${name1}-alola`.toLowerCase();
    }
    //Dueler checker
    const cp = concept.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
    const g = galarians.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase().replace("galarian-",""))
    const pk = pokemon.find(e => e.name === user.pokemons[selected].name.toLowerCase())
    const g8 = gen8.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
    const s = shiny.find(e => e.name === user.pokemons[selected].name.toLowerCase())
    const f = forms.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
    
    //Accepter checker
    const cp1 = concept.find(e => e.name.toLowerCase() === user1.pokemons[selected1].name.toLowerCase())
    const g1 = galarians.find(e => e.name.toLowerCase() === user1.pokemons[selected1].name.toLowerCase().replace("galarian-",""))
    const pk1 = pokemon.find(e => e.name === user1.pokemons[selected1].name.toLowerCase())
    const g81 = gen8.find(e => e.name.toLowerCase() === user1.pokemons[selected1].name.toLowerCase())
    const s1 = shiny.find(e => e.name === user1.pokemons[selected1].name.toLowerCase())
    const f1 = forms.find(e => e.name.toLowerCase() === user1.pokemons[selected1].name.toLowerCase())
    
    var url = user.pokemons[selected].url
    var url1 = user1.pokemons[selected1].url
  
    //url verification for dueler
  
    if(cp && !cp.url == url){
      user.pokemons[selected].url = cp.url
      await user.markModified(`pokemons[selected]`)
      await user.save()
    }else
    if(g && !g.url == url){
      user.pokemons[selected].url = g.url
      await user.markModified(`pokemons[selected]`)
      await user.save()
    }else
    if(pk && !pk.url == url){
      user.pokemons[selected].url = pk.url
      await user.markModified(`pokemons[selected]`)
      await user.save()
    }else
    if(g8 && !g8.url == url){
      user.pokemons[selected].url = g8.url
      await user.markModified(`pokemons[${selected}]`)
      await user.save()
    }else
    if(s && !s.url == url){
      user.pokemons[selected].url = s.url
      await user.markModified(`pokemons[${selected}]`)
      await user.save()
    }else
    if(f && !f.url == url){
      user.pokemons[selected].url = f.url
      await user.markModified(`pokemons[${selected}]`)
      await user.save()
    }else
    if(!f && !s && !g8 && !pk && !g && !cp){
      //get mon for dueler
      const options = {
      url: `https://pokeapi.co/api/v2/pokemon/${name}`,
      json: true
      };
      console.log(165)
      let bdy = await get(options)
      console.log(167)
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
      url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`
      if(!user.pokemons[selected].url == url){
        user.pokemons[selected].url = url
        await user.markModified(`pokemons[${selected}]`)
        await user.save()
      }
    }
    //accepter url verification
    if(cp1 && !cp1.url == url1){
      user1.pokemons[selected1].url = cp1.url
      await user.markModified(`pokemons[${selected1}]`)
      await user1.save()
    }
    if(g1 && !g1.url == url1){
      user1.pokemons[selected1].url = g1.url
      await user1.save()
    }
    if(pk1 && !pk1.url == url1){
      user1.pokemons[selected1].url = pk1.url
      await user1.save()
    }
    if(g81 && !g81.url == url1){
      user1.pokemons[selected1].url = g81.url
      await user1.save()
    }
    if(s1 && !s1.url == url1){
      user1.pokemons[selected1].url = s1.url
      await user1.save()
    }
    if(f1 && !f1.url == url1){
      user1.pokemons[selected1].url = f1.url
      await user1.save()
    }
    if(!f1 && !s1 && !g81 && !pk1 && !g1 && !cp1){
      const options1 = {
      url: `https://pokeapi.co/api/v2/pokemon/${name1}`,
      json: true
      };

      let bdy1 = await get(options1)
      let id1;
      if(bdy1.id < 10) id1 = `00${bdy1.id}`
      else if(bdy1.id > 9 && bdy1.id < 100) id1 = `0${bdy1.id}`
      else if(bdy1.id > 99) id1 = bdy1.id
      if(name1.endsWith('-alola')) {
        name1 = name1.replace("-alola", "").trim().toLowerCase();
        const t1 = await P.getPokemonByName(name1);
        id1 = `${t1.id}_f2`
        const ch1 = getlength(t1.id);
        if(ch1 === 1) {
          id1 = `00${t1.id}_f2`
        }else if(ch1 === 2) {
          id1 = `0${t1.id}_f2`
        }else if(ch1 === 3) {
          id1 = `${t1.id}_f2` 
        }
        }
      url1 = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id1}.png`
      if(!user1.pokemons[selected1].url == url1){
        user1.pokemons[selected1].url = url1
        await user1.save()
      }
    }
    if(cooldown.has(message.author.id)){ return message.channel.send(`You are already in a duel. Please wait for it to finish or if not please wait for a few minutes`)
    }else if(cooldown.has(user.id)) {return message.channel.send(`The user you mentioned is already in a duel or must wait for cooldown to end.`)}
    const m = await message.channel.send(`${u1}, You were invited to a duel\nUse \`${nguild.prefix}accept\` to accept else use \`${nguild.prefix}deny\` to deny the duel request.`)
    cooldown.add(message.author.id);
    cooldown.add(u1.id);
    const collector = new MessageCollector(message.channel, m =>m.author.id === u1.id, { time: 30000 });

    collector.on('collect', async msg => {
	    if (msg.content === `${nguild.prefix}accept`){
        

	      const canvas = Canvas.createCanvas(700, 250);
	      const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://imgur.com/BR1ctUs.png`);
	      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	      ctx.strokeStyle = '#74037b';
	      ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const poke1 = await Canvas.loadImage(url1); // dueler pokemon image url here 
        ctx.drawImage(poke1, 450, 27, 150, 150);
        const poke2 = await Canvas.loadImage(url); // accepter pokemon image url here
        ctx.drawImage(poke2, 100, 27, 150, 150)
    
        embed.setAuthor(`Duel has started!`)
        embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}`)
        embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
        embed.setImage("attachment://"+"name.png")
        embed.setColor("#05f5fc")  
        let em = await message.channel.send(embed);
        
        
        let pokemonOne = Math.floor(Math.floor((2 * user.pokemons[selected].hp + user.pokemons[selected].hp + (0/ 4) * user.pokemons[selected].level) /100) + user.pokemons[selected].level + 10);
        let PokemonTwo = Math.floor(Math.floor((2 * user1.pokemons[selected1].hp + user1.pokemons[selected1].hp + (0/ 4) * user1.pokemons[selected1].level) /100) + user1.pokemons[selected1].level + 10);//200;
        let PokemonSpeed = Math.floor(Math.floor((2 * user.pokemons[selected].speed + user.pokemons[selected].speed + (0/ 4) * user.pokemons[selected].level) /100) + user.pokemons[selected].level + 10);//20;
        let pokemonTwoSpeed = Math.floor(Math.floor((2 * user1.pokemons[selected1].speed + user1.pokemons[selected1].speed + (0/ 4) * user1.pokemons[selected1].level) /100) + user1.pokemons[selected1].level + 10);//30;
        
        let used = null;
        let used2 = null;
        
        let filter = mes => [message.author.id, u1.id].includes(mes.author.id) && mes.content.toLowerCase().startsWith(`${nguild.prefix}use`)
        let Duelcollector = message.channel.createMessageCollector(filter, {time: (3 * 60000) });
       
        Duelcollector.on("collect", async(mes) => {
          /*
          if(mes.author.id !== message.author.id && mes.author.id !== u1.id) return;
          if(!mes.content.startsWith(`${nguild.prefix}use`)) return;*/
          if(mes.author.id === message.author.id && mes.content.startsWith(`${nguild.prefix}use`)) {
            let ar = mes.content.slice(`${nguild.prefix}use`.length).trim().split(/ +/g);
            
            if(!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);
            
             if(used !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
          
          used = 'done'
            mes.delete()
          if(used && used2) RunDuel();
          
          }
          else if(mes.author.id === u1.id && mes.content.startsWith(`${nguild.prefix}use`)) {
            let ar = mes.content.slice(`${nguild.prefix}use`.length).trim().split(/ +/g);
            if(!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);
            if(used2 !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
            used2 = 'done';
            mes.delete()
           if(used && used2) RunDuel();
              
        }
             
        });
        
        async function RunDuel() {
          used = null;
          used2 = null;
          
        let damage = randomNum(10, 20);
      if(PokemonSpeed > pokemonTwoSpeed) {
        PokemonTwo = PokemonTwo - damage

        let damage1 = randomNum(10, 20);
        pokemonOne = pokemonOne  - damage1
        
        if(pokemonOne < 1) pokemonOne = 0
        if(PokemonTwo < 1) PokemonTwo = 0
        embed.setAuthor(`Duel has started!`)
        embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
        embed.setImage("attachment://"+"name.png")
        embed.setColor("#05f5fc")
        embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\n${message.author} has used move and dealt ${damage} Damage.\n${u1} has used move and dealt ${damage1} Damage.\n\n${user.pokemons[selected].name}: ${pokemonOne}\n${user1.pokemons[selected1].name}: ${PokemonTwo}`)
        em.edit(embed)
        if(pokemonOne < 1) {
          Duelcollector.stop();
          cooldown.delete(message.author.id);
          cooldown.delete(user.id)
          embed.setAuthor(`Duel ended!`)
          embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
          embed.setImage("attachment://"+"name.png")
          embed.setColor("#05f5fc")
          embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\nDuel ended and ${u1} won the duel`)
          return em.edit(embed)
        }else if(PokemonTwo < 1) {
          Duelcollector.stop();
          cooldown.delete(message.author.id);
          cooldown.delete(user.id)
          embed.setAuthor(`Duel ended!`)
          embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
          embed.setImage("attachment://"+"name.png")
          embed.setColor("#05f5fc")
          embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\nDuel ended and ${message.author} won the duel`)
          return em.edit(embed)
        }
      }else{
        pokemonOne = pokemonOne  - damage    
        
        let damage1 = randomNum(10, 20);
        PokemonTwo = PokemonTwo - damage
        if(pokemonOne < 1) pokemonOne = 0
          if(PokemonTwo < 1) PokemonTwo = 0
        embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
        embed.setImage("attachment://"+"name.png")
        embed.setColor("#05f5fc")
        embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\n${u1} has used move and dealt ${damage} Damage.\n${message.author} has used move and dealt ${damage1} Damage.\n\n${user.pokemons[selected].name}: ${pokemonOne}\n${user1.pokemons[selected1].name}: ${PokemonTwo}`)
        em.edit(embed)        
        if(pokemonOne < 1) {
          Duelcollector.stop();
          cooldown.delete(message.author.id);
      cooldown.delete(user.id)
          embed.setAuthor(`Duel ended!`)
          embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
          embed.setImage("attachment://"+"name.png")
          embed.setColor("#05f5fc")
          embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\nDuel ended and ${u1} won the duel`)
          return em.edit(embed)
          //Duel ended and ${u1} won the duel
        }else if(PokemonTwo < 1) {
          Duelcollector.stop();
          cooldown.delete(message.author.id);
      cooldown.delete(user.id)
          embed.setAuthor(`Duel ended!`)
          embed.attachFiles([{name: "name.png", attachment: canvas.toBuffer()}])
          embed.setImage("attachment://"+"name.png")
          embed.setColor("#05f5fc")
          embed.setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${u1.username}'s ${user1.pokemons[selected1].name.capitalize()}\n\nDuel ended and ${message.author} won the duel`)
          return em.edit(embed)
          //Duel ended and ${message.author} won the duel
        }
      }
      
      }
       
        
      }
      
      
      else if(msg.content === `${nguild.prefix}deny`){
        message.channel.send("Cancelled the duel")
        collector.stop('deny')
      }
    });
    collector.on('end', (r, reason) => {
      if(['reason', 'deny'].includes(reason)) {
      message.channel.send(`Duel request expired`)
      cooldown.delete(message.author.id);
      cooldown.delete(user.id)
      }
    });
  
    
    
  }
}
