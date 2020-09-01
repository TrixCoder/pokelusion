const Discord = require("discord.js")
const Guild = require('../../models/guild.js')

module.exports = {
  name: "help",
  category: "Which category this command is in",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["h"],
  run: async(client, message, args) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    if(message.content.endsWith(`${nguild.prefix}help`) && message.content.startsWith(`${nguild.prefix}help`) || message.content.endsWith(`${nguild.prefix}h`) && message.content.startsWith(`${nguild.prefix}h`)){
      var Embed = new Discord.MessageEmbed()
      .setColor('#05f5fc')
      .setTitle(`Commands List <:pokecoin:720059437468876843> :`)
      .setDescription(`To see a page, just add the page number after the ${nguild.prefix}help command. Like this: ${nguild.prefix}help 2`)
      .addField("Page 1 | Getting Started!", `What you'll need to know to start using Pokélusion.`)
      .addField("Page 2 | Pokélusion Commands!", `The core commands of the bot.`)
      .addField("Page 3 | Trading", `Commands to trade pokemons, redeems and credits.`)
      .addField("Page 4 | Settings", `Help configuring Pokélusion in your server.`)
      .addField("Page 5 | Miscellaneous", `Commands that don't really fit in anywhere else.`)
      .addField("Page 6 | Filters", `Commands that help filter your Pokémon.`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 1`) && message.content.startsWith(`${nguild.prefix}help 1`) || message.content.endsWith(`${nguild.prefix}h 1`) && message.content.startsWith(`${nguild.prefix}h 1`)){
      var Embed = new Discord.MessageEmbed()
       .setColor('#05f5fc')
       .setTitle(`Pokélusion Help | Getting Started`)
      .setDescription(`Welcome to Pokécord! If you haven't already, try using ${nguild.prefix}start to find out how to get your first Pokémon, then come back here and check out the other commands!`)
      .addField(`${nguild.prefix}start`, `Find out how to pick your starter Pokémon!`)
      .addField(`${nguild.prefix}pick`, `Pick your starter Pokémon!`)
      .addField(`${nguild.prefix}help`, `Displays the help menu!`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 2`) && message.content.startsWith(`${nguild.prefix}help 2`) || message.content.endsWith(`${nguild.prefix}h 2`) && message.content.startsWith(`${nguild.prefix}h 2`)){
      var Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Pokélusion Help | Pokélusion Commands`)
      .setDescription(`If you need more information about a specific command, type ${nguild.prefix}help <command>. For example: ${nguild.prefix}help trade`)
      .addField(`${nguild.prefix}info`, `Displays the info of selected pokemon or pokemon number that you wanna see!\nExample: ${nguild.prefix}info 2 or ${nguild.prefix}info\nShortcut: ${nguild.prefix}i`)
      .addField(`${nguild.prefix}select`, `Select a different Pokémon.\nExample: ${nguild.prefix}select 2\nShortcut: ${nguild.prefix}s`)
      .addField(`${nguild.prefix}pokedex`, `Shows stats of any pokemon.\nExample: ${nguild.prefix}pokedex pikachu\nShortcuts: ${nguild.prefix}d or ${nguild.prefix}dex`)
      .addField(`${nguild.prefix}catch`, `Catch a wild Pokémon when it appears in chat.\nExample: ${nguild.prefix}catch charmander.`)
      .addField(`${nguild.prefix}pokemon`, `Displays the list of the pokémons you own.\nExample: ${nguild.prefix}pokemon or ${nguild.prefix}pokemon 2\nShortcut: ${nguild.prefix}p`)
      .addField(`${nguild.prefix}nickname`, `Set nickname of selected pokemon.\nExample: ${nguild.prefix}nickname fire king\nShortcut: ${nguild.prefix}nick`)
      .addField(`${nguild.prefix}fav`, `Displays the list of pokemons that you own.\nExample: ${nguild.prefix}fav\nShortcut: ${nguild.prefix}f`)
      .addField(`${nguild.prefix}addfav`, `Add any pokemon in favourite list.\nExample: ${nguild.prefix}addfav <pokemon number>\nShortcut: ${nguild.prefix}af <pokemon number>`)
      .addField(`${nguild.prefix}delfav`, `Remove any pokemon from favourite list.\nExample: ${nguild.prefix}delfav <pokemon number>\nShortcut: ${nguild.prefix}df <pokemon number>`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 3`) && message.content.startsWith(`${nguild.prefix}help 3`) || message.content.endsWith(`${nguild.prefix}h 3`) && message.content.startsWith(`${nguild.prefix}h 3`)){
      var Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Pokélusion Help | Trading`)
      .setDescription(`If you need more information about a specific command, type ${nguild.prefix}help <command>. For example: ${nguild.prefix}help trade.`)
      .addField(`${nguild.prefix}trade`, `Trade with another user.`)
      .addField(`${nguild.prefix}balance`, `Displays your pokécoins balance.`)
      .addField(`${nguild.prefix}p add number`, `Add any pokemon of a particular number in trade.\nExample: ${nguild.prefix}p add 2`)
      .addField(`${nguild.prefix}c add amount`, `Add any amount of a pokécoins in trade.\nExample: ${nguild.prefix}c add 200`)
      .addField(`${nguild.prefix}r add amount`, `Add any amount of a redeems in trade.\nExample: ${nguild.prefix}r add 1`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 4`) && message.content.startsWith(`${nguild.prefix}help 4`) || message.content.endsWith(`${nguild.prefix}h 4`) && message.content.startsWith(`${nguild.prefix}h 4`)){
      var Embed = new Discord.MessageEmbed()
      .setColor('#05f5fc')   
      .setTitle(`Pokélusion Help | Settings`)
      .setDescription(`If you need more information about a specific command, type ${nguild.prefix}help <command>. For example: ${nguild.prefix}help trade.`)
      .addField(`${nguild.prefix}config`, `To see available configurations.`)
      .addField(`${nguild.prefix}config spawnenable <true/false>`, `To enable/disable spawns.`)
      .addField(`${nguild.prefix}config prefix <new prefix>`, `To configure a new prefix for a particular guild.`)
      .addField(`${nguild.prefix}config spawnchannel #channel`, `To configure a particular spawn channel.`)
      .addField(`${nguild.prefix}config levelup true/false`, `To enable/disable levelup message for yourself.`)
      .addField(`${nguild.prefix}gstart time prize`, `To configure and start giveaway in a particular channel.`)
      .addField(`${nguild.prefix}agstart time prize`, `To configure and start a giveaway in a particular channel. Note: Use it in your own risk because if bot restarts(sometimes automatically restarts) you may loose your stuff.`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 5`) && message.content.startsWith(`${nguild.prefix}help 5`) || message.content.endsWith(`${nguild.prefix}h 5`) && message.content.startsWith(`${nguild.prefix}h 5`)){
      var Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Pokélusion Help | Miscellaneous`)
      .setDescription(`If you need more information about a specific command, type ${nguild.prefix}help <command>. For example: ${nguild.prefix}help trade.`)
      .addField(`${nguild.prefix}invite`, `To invite the bot or join support server of bot.`)
      .addField(`${nguild.prefix}redeem`, `Exchange your redeems for pokémon or pokécoins.`)
      .addField(`${nguild.prefix}redeemspawn`, `To redeemspawn a pokemon of choice.`)
      .addField(`.botinfo`, `To check details of bot.`)
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help 6`)  && message.content.startsWith(`${nguild.prefix}help 6`) || message.content.endsWith(`${nguild.prefix}h 6`) && message.content.startsWith(`${nguild.prefix}h 6`)){
      var Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Pokélusion Help | Filters`)
      .setDescription("These filters are limited by one for now. That means you can only use one filter in a particular command. We will fix that soon :)\n\n``--shiny`` | Search for shiny pokémon\n``--name <Pokémon Name>`` | Search for a certain Pokémon by name\n``--nickname <Pokémon Name>`` | Search for a certain Pokémon by nickname\n``--legendary`` | Search for legendary Pokémon\n``--mythical`` | Search for mythical Pokémon\n``--ub`` | Search for Ultra Beast Pokémon\n``--alolan`` | Search for Alolan Pokémon")
      message.author.send(Embed).then(() => { message.channel.send(`📬 Sent commands in DMs!`); }).catch((err) => { message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
    if(message.content.startsWith(`${nguild.prefix}help config`) || message.content.startsWith(`${nguild.prefix}help cfg`) || message.content.startsWith(`${nguild.prefix}help configure`)){
      var cmsg = `
      To configure your server:
**__Step 1:__**
• Use \`${nguild.prefix}cfg sc <channel>\` to redirect spawns. If you don't want a redirect then you can skip this step or type \`${nguild.prefix}config sc reset\` to remove the redirect. 
• Use \`${nguild.prefix}cfg dc <channel>\` to disable spawns in <channel>.
• Use \`${nguild.prefix}cfg ec <channel>\` to enable spawns in <channel>.
• You must type \`${nguild.prefix}cfg ec/dc <channel>\` for **every** channel you would like to modify. If you would like to disable/enable all channels at once, replace \`<channel>\` with \`all\` in \`${nguild.prefix}cfg dc/ec\`.
**__Step 2:__**
• Type \`${nguild.prefix}cfg se true\` to start spawning Pokemon in all channels where spawns are enabled.

• To change the bot's prefix: Type \`${nguild.prefix}cfg px <new-prefix>\`. Your prefix must be 5 characters or less.
• To enable/disable level-up messages: Type \`${nguild.prefix}cfg lu true\` to enable. Type \`${nguild.prefix}cfg lu false\` to disable.
      `
      var Embed = new Discord.MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Pokélusion Help | Configuration`)
      .setDescription(cmsg)
      message.channel.send(Embed).then(() => { return }).catch((err) => { return message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
    }
  }
} 
