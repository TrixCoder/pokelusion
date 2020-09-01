const User = require("./../../models/user");

module.exports = {
    name: `delfav`,
    category: 'Information',
    description: 'Add a pokemon to your favorites',
    usage: 'addfav [pokemonNumber]',
    aliases: ["df"],
    run: async(client, message, args) => {

        const user = await User.findOne({id: message.author.id});

        if(!user) return message.channel.send(`You must pick a starter before giving it a nickname.`);

        if(isNaN(args[0]) || !user.pokemons[parseInt(args[0]) - 1].fav) {
          return message.channel.send(`Either that pokemon doesn't exist or you provided a invalid number.`);
        }
      let num = parseInt(args[0]) - 1;
      
      if(user.pokemons[num].fav == false) {
        return message.channel.send(`It is not in your favorite list`)
      }else{
        user.pokemons[num].fav = false;
        await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
        
        return message.channel.send(`Removed \`${num + 1}\` number pokemon from your favorites`);
      }

    }
}
