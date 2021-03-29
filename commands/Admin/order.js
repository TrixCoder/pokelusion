const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "order",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "spawn [args]",
  aliases: ["o"],
  run: async(client, message, args) => {
    const guild = await Guild.findOne({ id: message.guild.id });
    if(!guild) {
      const server = new Guild({id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null});
      await server.save();
    }
 
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user){
      return message.reply(`Please pick a starter pokemons using ${nguild.prefix}start`)
    }
    let orda = ''
    let ordi = ''
    let ordn = ''

    if(user.orderAlphabet == false){ orda = "" }else{ orda = "Alphabet"}
    if(user.orderIV == false){ ordi = "" }else{ ordi = "IV"}
    if(!user.orderIV == true && !user.orderAlphabet == true){ ordn = "Number" } else{ ordn = ""}
    if(!args[0]){
      return message.channel.send( {embed: {title: `Order`, color: 0x00f9ff,
        description: `\`${ordi}${orda}${ordn}\``
      }} );
    }
    if(args[0].toLowerCase() == 'alphabet' || args[0].toLowerCase() == 'a') {
      let user = await User.findOne({id: message.author.id});
      user.orderAlphabet = !user.orderAlphabet;
      if(user.orderAlphabet == true) {
        user.orderIV = false;
      }
      await user.save()
      return message.channel.send( {embed: {title: `Order configuration`, color: 0x00f9ff, description: `Aphabet Order for <@${message.author.id}> has been set to \`${user.orderAlphabet ? true : false}\``}} );
    }else if(args[0].toLowerCase() == 'iv') {
      let user = await User.findOne({id: message.author.id});
      if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
      user.orderIV = !user.orderIV; //(args[1].toLowerCase() === "true") ? true : false;
      if(user.orderIV == true) {
        user.orderAlphabet = false;
      }
      await user.save()
      return message.channel.send( {embed: {title: `Order configuration`, color: 0x00f9ff, description: `IV Order for <@${message.author.id}> has been set to \`${user.orderIV ? true : false}\``}} );
    }else if(args[0].toLowerCase() == 'number' || args[0].toLowerCase() == 'no') {
      let user = await User.findOne({id: message.author.id});
      if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
      user.orderAlphabet = false;
      user.orderIV = false;
      await user.save()
      return message.channel.send( {embed: {title: `Order configuration`, color: 0x00f9ff, description: `IV Order for <@${message.author.id}> has been set to \`Number\``}} );
    }
  }
}