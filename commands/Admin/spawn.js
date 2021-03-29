const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");

module.exports = {
  name: "spawn",
  category: 'Admin',
  description: "Changes the configuration for a server",
  usage: "spawn [args]",
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
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
    if(!args[0]){
      let spawn = "";
      let redirected = "";
      if(nguild.disabledChannels.includes(message.channel.id)){
        spawn = "Disabled"
      }
      if(!nguild.disabledChannels.includes(message.channel.id) && (nguild.spawnchannel == null || nguild.spawnchannel == message.channel.id) && message.guild.me.hasPermission("SEND_MESSAGES")){
        spawn = "Enabled"
      }
      if(nguild.spawnchannel == message.channel.id) {redirected = "True"}else{redirected = "False"}
      return message.channel.send( {embed: {title: `Spawn Configuration for ${message.channel.name}`, color: 0x00f9ff,
        description: `Spawn: \`${spawn}\`
Redirected Spawn: \`${redirected}\`
        `
      }} );
    }
    else{
      if(nguild.spawnchannel !== null) return message.reply(`Spawns are being redirected to <#${nguild.spawnchannel}>. In order to close redirection of spawns you need to use \`${nguild.prefix}redirect reset\``)
      if(args[0].toLowerCase() == "enable" || args[0].toLowerCase() == "e") {
        let channel = message.channel;
        if(args[1]){
          channel = message.mentions.channels.first() || client.channels.cache.get(args[1]);
        }
        if(!nguild.disabledChannels.includes(channel.id)) return message.channel.send(`This channel is already enabled.`);
        nguild.disabledChannels.splice(nguild.disabledChannels.indexOf(channel.id), 1);
        await nguild.markModified('disabledChannels');
        await nguild.save().catch(console.error);
        return message.channel.send(`Enabled spawns in ${channel.toString()}`);
      
      }
      if(args[0].toLowerCase() == 'disable' || args[0].toLowerCase() == 'd') {
        if(nguild.disabledChannels == null) nguild.disabledChannels = [];
        if(!args[1]){
          let channel = message.channel;
          nguild.disabledChannels.push(channel.id);
          await nguild.markModified('disabledChannels');
          await nguild.save().catch(e => console.log(e));
          return message.channel.send(`Disabled spawns in ${channel.toString()}.`);
        }
        if(args[1].toLowerCase() == "reset") {
          nguild.disabledChannels = null;
          await nguild.save();
          return message.channel.send(`Removed disabled channels.`);
        }
        if(args[1].toLowerCase() === "all"){
          message.guild.channels.cache.forEach(async chan => {
          nguild.disabledChannels.push(chan.id)
          await nguild.markModified('disabledChannels');
        await nguild.save().catch(e => console.log(e));
        })
        return message.channel.send(`Disabled spawns in All Channels.`);
        }else{
          let channel = message.mentions.channels.first() || client.channels.cache.get(args[1]);
          if(!channel) return message.channel.send(`Invalid channel`);
          nguild.disabledChannels.push(channel.id);
          await nguild.markModified('disabledChannels');
          await nguild.save().catch(e => console.log(e));
          return message.channel.send(`Disabled spawns in ${channel.toString()}.`);}
      }
      if(args[0].toLowerCase() == "disabledspawnchannels" || args[0].toLowerCase() == "dsc" || args[0].toLowerCase() == "dscs"){
        let dcs = ''
        if(nguild.disabledChannels == null) {
          nguild.disabledChannels = [];
          await nguild.markModified('disabledChannels');
          await nguild.save();
        }
        let oldChannelSize = nguild.disabledChannels.size;
        nguild.disabledChannels.forEach((r, i) => r => {
          let check = client.channels.cache.get(r);
          if(!check) nguild.splice(i, 1);
        });
        if(nguild.disabledChannels.size !== oldChannelSize) {
          await nguild.save().catch(console.error);
        }
        if(nguild.disabledChannels == null || nguild.disabledChannels == "") { dcs = "``Not Set``"} else{ dcs = nguild.disabledChannels.map(r => `<#${r}>`).join(" , ")}
        if(dcs.length > 2048) dcs = "Too Many Channels To Show"
        return message.channel.send( {embed: {title: `Disabled Channels`, color: 0x00f9ff,
          description: `${dcs}`
        }});
      }
      if(args[0].toLowerCase() == "enabledspawnchannels" || args[0].toLowerCase() == "esc" || args[0].toLowerCase() == "escs"){
        let ecs = message.guild.channels.cache.filter(r => !nguild.disabledChannels.includes(r.id) && !["category", "voice"].includes(r.type) && r.permissionsFor(message.guild.me).has(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"])).array().map(r => `<#${r.id}>`).slice(0, 20).join(" , ");
        if(!ecs) ecs = "None"
        if(ecs.length > 2048) ecs = "Too Many Channels To Show"
        return message.channel.send( {embed: {title: `Enabled Channels`, color: 0x00f9ff,
          description: `${ecs}`
        }});
      }
    }
  } 
}