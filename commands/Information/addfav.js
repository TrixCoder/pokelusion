const User = require("./../../models/user");

module.exports = {
    name: `addfav`,
    category: 'Information',
    description: 'Add a pokemon to your favorites',
    usage: 'addfav [pokemonNumber]',
    aliases: ["af"],
    run: async(client, message, args) => {

        const user = await User.findOne({id: message.author.id});

        if(!user) return message.channel.send(`You must pick a starter before giving it a nickname.`);

        if(isNaN(args[0]) || !user.pokemons[args[0] - 1]) {
          return message.channel.send(`Either that pokemon doesn't exist or you provided a invalid number.`);
        }
      let num = args[0] - 1;
      
      if(user.pokemons[num].fav == true) {
        return message.channel.send(`It is already in your favorite list`)
      }else{
        user.pokemons[num].fav = true;
        await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
        console.log(user.pokemons.filter(f=>f.fav === true))
        return message.channel.send(`Set \`${num + 1}\` number pokemon in your favorites`);
      }

    }
}
