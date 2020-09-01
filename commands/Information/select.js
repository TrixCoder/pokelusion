const userSchema = require("./../../models/user");
const User = require('../../models/user.js');

module.exports = {
  name: 'select',
  category: `Information`,
  description: `Select a pokemon.`,
  usage: `select <pokemonumber>`,
  aliases: ["s"],
  run: async(client, message, args) => {
    let user = await User.findOne({id: message.author.id});
    if(!args[0]) return client.embed(message.channel, {
      name: ` | Please select a valid pokemon number.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
    if(args[0] == "latest" || args[0] === "l") {
      args[0] = args[0].replace(args[0],parseInt(user.pokemons.length))
    }
  if(isNaN(args[0])) return client.embed(message.channel, {
      name: ` | Please type a proper pokemon number that is in your pokemon list.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
    if(!user || user.pokemons === []) {
      return client.embed(message.channel, {
      name: " | You must pick your starter Pokemon with ``.start`` before using this command.",
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
  }
    if(!user.pokemons[parseInt(args[0]) - 1]) return client.embed(message.channel, {
      name: ` | That pokemon doesn't exist`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    })
   user.selected = parseInt(args[0]);
   await user.save().catch(er => console.log(er))
 // console.log(user.selected)
    message.channel.send(`${message.author} | You selected your level ${user.pokemons[parseInt(args[0]) - 1].level} ${user.pokemons[parseInt(args[0]) - 1].name} `)
  }
}