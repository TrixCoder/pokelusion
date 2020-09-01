const User = require("./../../models/user");
const { MessageCollector, MessageEmbed } = require("discord.js");

module.exports = {
    name: "release",
    category: "Information",
    description: "release a pokemon",
    usage: "how it can be used. for example: [latest] or (pokemonNumber)",
    run: async(client, message, args) => {

        const user = await User.findOne({id: message.author.id});

        if(!user) return message.channel.send(`You must pick a starter before releasing a pokemon.`);
        if((user.pokemons.length - 1) < 1){
            return message.channel.send(`You have only one pokemon so you can't release it.`);
        }
        if(!args[0]){
            var num = user.selected - 1;
            var name = user.pokemons[num].name;
            let embed = new MessageEmbed()
            .setTitle(` Are you sure you want to release your ${name}? type confirm to confirm it.`)
            .setColor("#05f5fc")
            .setDescription(`This confirmation will expire in 30 seconds or type cancel to cancel it.`);
            message.channel.send(embed);
            const collector = new MessageCollector(message.channel, (m) => {
                return m.author.id === message.author.id && new RegExp(`^(confirm|cancel)$`, "i").test(m.content)

            });

            collector.on("collect", async(m) => {
                if(/cancel/i.test(m.content)) return collector.stop("cancelled")

                if(/confirm/i.test(m.content)) {
                    await user.pokemons.splice((num), 1);
                    await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
                    message.channel.send(`Successfully released your pokemon!`);
                    return collector.stop("done")
                }

            });

            collector.on("end", (_, reason) => {
                if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled release.")
                if(["done"].includes(reason)) return
            });
        }
        if(args[0] == "latest") {
            var number = user.pokemons.length - 1
            var name = user.pokemons[number].name;
            let embed = new MessageEmbed()
            .setTitle(`Are you sure you want to release your ${name}? type confirm to confirm it.`)
            .setColor("#05f5fc")
            .setDescription(`This confirmation will expire in 30 seconds or type cancel to cancel it.`);
            message.channel.send(embed);
            const collector = new MessageCollector(message.channel, (m) => {
                return m.author.id === message.author.id && new RegExp(`^(confirm|cancel)$`, "i").test(m.content)

            });

            collector.on("collect", async(m) => {
                if(/cancel/i.test(m.content)) return collector.stop("cancelled")

                if(/confirm/i.test(m.content)) {
                    await user.pokemons.splice((user.pokemons.length - 1), 1);
                    await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
                    message.channel.send(`Successfully released your latest pokemon!`);
                    return collector.stop("done")
                }

            });

            collector.on("end", (_, reason) => {
                if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled release.")
                if(["done"].includes(reason)) return
            });

           
        }
        else if(parseInt(args[0])) {
            let num = parseInt(args[0]) - 1;
            if(!user.pokemons[num]) return message.channel.send(`No pokemon exists with that number`);
            name = user.pokemons[num].name;
            let embed = new MessageEmbed()
            .setTitle(` Are you sure you want to release your ${name}? type confirm to confirm it.`)
            .setColor("#05f5fc")
            .setDescription(`This confirmation will expire in 30 seconds or type cancel to cancel it.`);
            message.channel.send(embed);
            const collector = new MessageCollector(message.channel, (m) => {
                return m.author.id === message.author.id && new RegExp(`^(confirm|cancel)$`, "i").test(m.content)

            });

            collector.on("collect", async(m) => {
                if(/cancel/i.test(m.content)) return collector.stop("cancelled")

                if(/confirm/i.test(m.content)) {
                    await user.pokemons.splice((num), 1);
                    await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
                    message.channel.send(`Successfully released your pokemon!`);
                    return collector.stop("done")
                }

            });

            collector.on("end", (_, reason) => {
                if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled release.")
                if(["done"].includes(reason)) return
            });

        }

    }
} 
