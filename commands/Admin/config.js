const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "config",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "config <prefix/spawnchannel/spawnenable> <newvalue>",
  aliases: ["cfg", "configure"],
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
    var cmsg = `
      To configure bot for your server:
**__Step 1:__**
• Use \`${nguild.prefix}redirect <channel>\` to redirect spawns. If you don't want a redirect then you can skip this step or type \`${nguild.prefix}redirect reset\` to remove the redirect. 
• Use \`${nguild.prefix}spawn disbale <channel>\` to disable spawns in <channel>.
• Use \`${nguild.prefix}spawn enable <channel>\` to enable spawns in <channel>.
• You must type \`${nguild.prefix}spawn enable/disable <channel>\` for **every** channel you would like to modify. If you would like to disable all channels at once, replace \`<channel>\` with \`all\` in \`${nguild.prefix}spawn disable <channel>\`.
**__Step 2:__**
• Type \`${nguild.prefix}enablespawns true\` to start spawning Pokemon in all channels where spawns are enabled.

• To change the bot's prefix: Type \`${nguild.prefix}prefix <new-prefix>\`. Your prefix must be 5 characters or less.

To configure your user based settings:
• To enable/disable level-up messages: Type \`${nguild.prefix}levelup enable\` to enable. Type \`${nguild.prefix}levelup false\` to disable levelupm message.
• To order pokemons: Type \`${nguild.prefix}order iv\`.
Note: You can also replace iv with alphabet or number to change it's order
      `
      var Embed = new MessageEmbed()
	    .setColor('#05f5fc')
	    .setTitle(`Configuration`)
      .setDescription(cmsg)
      message.channel.send(Embed).then(() => { return }).catch((err) => { return message.channel.send(`${err}.\nMaybe your DMs are closed. Please try to open them and try this command again.`)});
  }
}