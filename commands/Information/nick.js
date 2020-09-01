const User = require("./../../models/user");

module.exports = {
    name: `nickname`,
    category: 'Information',
    description: 'Change nickname or reset your nickname',
    usage: 'nick [name]',
    aliases: ["n", "nick"],
    run: async(client, message, args) => {

        const user = await User.findOne({id: message.author.id});

        if(!user) return message.channel.send(`You must pick a starter before giving it a nickname.`);

        const selected = user.selected - 1;

        if(!user.pokemons[selected]) {
            return message.channel.send(`The selected pokemon doesn't exit please select a pokemon.`);
        };

        if(!args[0]) return message.channel.send(`Provide a nickname please.`);

        if(args[0] == "reset") {
            user.pokemons[selected].nick = undefined

            await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, { new: true});

            return message.channel.send(`Reset your ${user.pokemons[selected].name}'s nickname.`);
        }

        let nick = args.join(" ");

        if(nick.length > 30) {
         return message.channel.send(`Your pokemon's nickname cannot be over 30 characters.`)
       }
        
        user.pokemons[selected].nick = nick;

        await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, { new: true});

        return message.channel.send(`Changed nickname to \`${nick}\`.`);


    }
}
