const Discord = require("discord.js")
var attacks = require("./../../db/attacks.js");
var pokemon = require("./../../db/pokemon.js");
const User = require('../../models/user.js');
const { get } = require('request-promise-native')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const {getlength} = require("./../../functions.js");

module.exports = {
  name: "weak",
  category: "Information",
  description: "Gives weakness info of a particular pokemon",
  usage: "Example: ``.weak pokemonname``",
  aliases: ["w"],
  run: async(client, message, args) => {
      var pkmn = message.content.toString().toLowerCase();
      pkmn = args[0];
      for (var i = 0; i < attacks.length; i++) {
        if (pkmn == attacks[i].Name.toLowerCase()) {
          return message.channel.send({
            embed: {
              title: `${attacks[i].Name}'s Weaknesses`,
              color: 0x05f5fc,
              description: `N°${attacks[i].Number}\nName: ${attacks[i].Name}\nWeaknesses: ${attacks[i].Weaknesses}\nResistant: ${attacks[i].Resistant}\nMaxCP: ${attacks[i].MaxCP}\nMaxHP: ${attacks[i].MaxHP}`,
              image: {
                url: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${attacks[i].Number}${attacks[i].Name}.png`
              }
            }
          });
        }
      }
    }
  }