const {classToPlain} = require("class-transformer");
const capitalize = function(arg) {
      return arg.charAt(0).toUpperCase() + arg.slice(1);
    };
const Guild = require('../../models/guild.js')
let starters = [ "bulbasaur", "charmander", "squirtle",
                        "chikorita", "cyndaquil", "totodile",
                        "treecko", "torchic", "mudkip",
                        "turtwig", "chimchar", "piplup",
                        "snivy", "tepig", "oshawott",
                        "chespin", "fennekin", "froakie",
                        "rowlet", "litten", "popplio",
                        "grookey", "scorbunny", "sobble"];
const gen8Starters = ["grookey", "scorbunny", "sobble"];
const userSchema = require("./../../models/user");
const pokedex = require("./../../pokedex/index");
const p = new pokedex();
const pokemon = require("../../Classes/Pokemon");
const mongoose = require("mongoose");
const {getlength, randomNumber, attach} = require("./../../functions");
const gen8 = require("./../../db/gen8.js");
var pkm = require("./../../db/pokemon.js");
const {get} = require("request-promise-native");

module.exports = {
    name: "pick",
    category: "Start",
    description: "Pick your first ever pokemon",
    usage: "<starter name>",
    run: async(client, message, args) => {
      const result = await userSchema.findOne({id: message.author.id});
    if(result) return client.embed(message.channel, {
        name: ` | You already picked your starter`,
        av: message.author.avatarURL({format: "png", dynamic: true})
    });
      
        if(!args[0]) return client.embed(message.channel, {
            name: ` | You didn't specify a starter name.`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        });
       
       if(!starters.includes(args[0].toLowerCase())) return client.embed(message.channel, {
         name: ` | That is not a starter pokemon`,
         av: message.author.avatarURL({format: "png", dynamic: true})
       })
        
        /*starters.find(r => {
            if(r._engName.toLowerCase() == args.join(" ")) {
                return res = r;
            }
            return null
        }) */
    function LowerizeFirstLetter(arg) {
            return arg.charAt(0).toLowerCase() + arg.slice(1);
          }
      
      const arg = LowerizeFirstLetter(args.join("-"));
      const ar = arg;
    let find = gen8.find(r => r.name === arg);
    if(gen8Starters.includes(arg)) {
      
    var uri;
      var shiny;
      const gen = randomNumber(0, 100);
      if(gen < 1) {
        shiny = true
        uri = find.url
        
      }else if(gen > 1){
        shiny = false
        uri = find.url
    
      }
      var re;
      const type = find.type
    const res = new pokemon({name: find.name, shiny: shiny, rarity: type, url: uri});
    let newDoc = new userSchema({
        id: message.author.id,
        balance: 0,
        pokemons: [],
        redeems: 0
    });
      
    await newDoc.save().then(async r => {
      const user = await userSchema.findOne({id: message.author.id});
      const convert = res//await classToPlain(res)
      user.pokemons.push(convert);
      user.balance = user.balance + 250;
      user.selected = user.pokemons.length
      await user.save().catch(e => e);
        return client.embed(message.channel, {
            name: ` | Succesfully made ${res.name} your starter Pokémon`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        });
    }).catch(console.error);
      
    }else{
    const t = await p.getPokemonByName(arg);
    var uri;
      var shiny;
      const gen = randomNumber(0, 100);
      if(gen < 1) {
        shiny = true
        const pkmn = ar
        for(var i=0;i<pkm.length;i++){
			  if(pkmn == pkm[i]._engName.toLowerCase() || pkmn == pkm[i]._frName.toLowerCase() || pkmn == pkm[i]._nb){
         uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`
        }
        }
        
      }else if(gen > 1){
        shiny = false
        const check = getlength(t.id)
    if(check === 1) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
    }
    else if(check === 2) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
    }
    else if(check === 3) {
      uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
    }
    
      }
      var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ")
      
    const res = new pokemon({name: capitalize(args[0]), shiny: shiny, rarity: type, url: uri});
    let newDoc = new userSchema({
        id: message.author.id,
        balance: 0,
        pokemons: [],
        redeems: 0
    });
      
    await newDoc.save().then(async r => {
      const user = await userSchema.findOne({id: message.author.id});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      user.balance = user.balance + 250;
      user.selected = user.pokemons.length
      await user.save().catch(e => e);
        return client.embed(message.channel, {
            name: ` | Succesfully made ${res.name} your starter Pokémon`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        });
    }).catch(console.error);
    }
}
}
