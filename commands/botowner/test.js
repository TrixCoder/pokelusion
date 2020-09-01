const pokemon = require("./../../Classes/Pokemon");
const pokedex = require("./../../pokedex/index");
const p = new pokedex();
const request = require("request");
const {getlength, attach} = require("./../../functions");
var pkm = require("./../../db/pokemon.js");
const {classToPlain} = require("class-transformer");
const capitalize = function(arg) {
      return arg.charAt(0).toUpperCase() + arg.slice(1);
    };
const User = require('../../models/user.js');
module.exports = {
  name: "test",
  category: "botowner",
  run: async(client, message, args) => {
    function LowerizeFirstLetter(arg) {
            return arg.charAt(0).toLowerCase() + arg.slice(1);
          }
      const pokekaname = LowerizeFirstLetter(args.join("-"));
      const ar = pokekaname;
   const t = await p.getPokemonByName(pokekaname);
    const user = await User.findOne({id: message.author.id})
    var uri;
      var shiny;
        shiny = true
        const pkmn = ar
        for(var i=0;i<pkm.length;i++){
			  if(pkmn == pkm[i]._engName.toLowerCase() || pkmn == pkm[i]._frName.toLowerCase() || pkmn == pkm[i]._nb){
         uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`
        }
        }
      var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ")
    let name = `Pokelusion-Spawn.jpg`
    if(uri.endsWith(".gif")) name = `PokelusionSpawn.gif`
      uri = await attach(client, uri);
    const res = new pokemon({name: capitalize(pokekaname), shiny: shiny, rarity: type, url: uri});
      const convert = classToPlain(res)
      user.pokemons.push(convert);
      await user.save().catch(e => e);
        return client.embed(message.channel, {
            name: ` | Succesfully Saved ${res.name} In Your Pokémon List`,
            av: message.author.avatarURL({format: "png", dynamic: true})
        });
    
    
    
    /*String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    if(!args[0]) return;
    try{
    const t = await p.getPokemonByName(args.join('-'))
    var uri;
      var re;
      const type = t.types.map(r => {
        if(r !== r) re = r;
        if(re == r) return;
        return `${r.type.name.capitalize()}`
                                   
      }).join(" | ");
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
    const result = new pokemon({name: args[0], shiny: false, rarity: type, url: uri});
      console.log(result);
  }
  catch(err) {
    if(err.message.includes(`Request failed`)) {
      return message.channel.send(`That is a invalid pokemon.`);
    }
  }*/
  }
}