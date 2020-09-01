const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const User = require("./../../models/user");
let spawnchn = '';
let levelupchn = ''
let levelup = ''
let spawn = ''
let dcs = ''
let orda = ''
let ordi = ''
let ordn = ''

//Add Admin Only Command 🔽
let admonly = ["prefix", "px", "spawnchannel", "sc", "spawnenable", "se", "disablechannel", "dc", "enablechannel", "ec"]

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
    if(nguild.spawnchannel == null){ spawnchn = "`Not Set`" }else{ spawnchn = `<#${nguild.spawnchannel}>` }
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
    let ecs = message.guild.channels.cache.filter(r => !nguild.disabledChannels.includes(r.id) && !["category", "voice"].includes(r.type) && r.permissionsFor(message.guild.me).has(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"])).array().map(r => `<#${r.id}>`).slice(0, 20).join(" , ");
    if(user.levelupbtn == false){ levelup = "`Disabled`" }else{ levelup = "`Enabled`"}
    if(nguild.spawnbtn == false){ spawn = "`Disabled`" }else{ spawn = "`Enabled`"}
    if(user.orderAlphabet == false){ orda = "" }else{ orda = "Alphabet"}
    if(user.orderIV == false){ ordi = "" }else{ ordi = "IV"}
    if(!user.orderIV == true && !user.orderAlphabet == true){ ordn = "Number" } else{ ordn = ""}
    let g = "``"+ `For ${message.guild.name}:`+ "``"
    let u = "``"+ `For ${message.author.username}:`+ "``"

    if(dcs.length > 2048) dcs = "Too Many Channels To Show"
    if(!ecs) ecs = "None"
    if(ecs.length > 2048) ecs = "Too Many Channels To Show"
    if(!args[0]) {
      return message.channel.send( {embed: {title: `Configuration`, color: 0x00f9ff,
        description: `\`${g}\`

Prefix: \`${nguild.prefix || client.config.prefix}\`
Spawn Channel: ${spawnchn}
Spawn Enable: \`${spawn}\`
Spawn Disabled Channels: ${dcs}
Spawn Enabled Channels: ${ecs}

\`${u}\`

Order: \`${ordi}${orda}${ordn}\`
LevelupMessage: \`${levelup}\`
\n\nYou can use **${nguild.prefix}help config** to get a full guide about it`
      }} );
    }
    if(admonly.includes(args[0].toLowerCase()) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
  if(args[0].toLowerCase() == 'prefix' || args[0].toLowerCase() == 'px') {
    if(!args[1]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config prefix <value>** or **${nguild.prefix || client.config.prefix}config px <value>**`)
    let prefix = args.slice(1).join(" ");
    if(prefix.length > 5) return message.channel.send(`Max prefix length is 5 characters`);
    nguild.prefix = prefix;
    await nguild.save();
    return message.channel.send( {embed: {title: `Prefix configuration`,color: 0x00f9ff, description: `Prefix for ${message.guild.name} has been set to \`${nguild.prefix}\``}} );
      }
  
  if(args[0].toLowerCase() == 'spawnchannel' || args[0].toLowerCase() == 'sc') {
    if(args[1] == "reset") {
      nguild.spawnchannel = null;
      await nguild.save();
      return message.channel.send(`Removed redirect channel.`);
    }
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(r=>r.name.toLowerCase().includes(args[1]))
    if(!channel) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config spawnchannel <mentionchannel/id/name>** or **${nguild.prefix || client.config.prefix}config sc <mentionchannel/id/name>**`);
    nguild.spawnchannel = channel.id;
        await nguild.save();
        return message.channel.send( {embed: {title: `Spawn channel configuration`, color: 0x00f9ff, description: `Spawn channel for ${message.guild.name} has been set to <#${nguild.spawnchannel}>`}} );
      }
    
 if(args[0].toLowerCase() == 'spawnenable' || args[0].toLowerCase() == 'se') {
       // if(nguild.spawnchannel == null) return message.channel.send(`Before enabling/disabling you need to set the spawn channel`);
        if(!args[1]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config spawnenable <true/false>** or **${nguild.prefix || client.config.prefix}config se <true/false>**`);
        if(!args[1].toLowerCase().match(/true|false/)) return message.channel.send(`Correct usage: ${nguild.prefix || client.config.prefix}config spawnenable <true/false>`)
        nguild.spawnbtn = args[1].toLowerCase();
       await nguild.save();
        return message.channel.send( {embed: {title: `Spawn configuration`, color: 0x00f9ff, description: `Spawn for ${message.guild.name} has been set to \`${nguild.spawnbtn}\``}} );
      }
    
    
    if(args[0].toLowerCase() == 'disablechannel' || args[0].toLowerCase() == 'dc') {
      if(nguild.disabledChannels == null) nguild.disabledChannels = [];

      if(args[1].toLowerCase() == "reset") {
      nguild.disabledChannels = null;
      await nguild.save();
      return message.channel.send(`Removed disabled channels.`);
      }
      //if(nguild.disabledChannels.includes(channel.id)) return message.channel.send(`Its already disabled there!`);
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
    
    if(args[0].toLowerCase() == "enablechannel" || args[0].toLowerCase() == "ec") {
      
      let channel = message.mentions.channels.first() || client.channels.cache.get(args[1]);
      
      if(!nguild.disabledChannels.includes(channel.id)) return message.channel.send(`This channel is already enabled.`);
      
      nguild.disabledChannels.splice(nguild.disabledChannels.indexOf(channel.id), 1);
      
      await nguild.markModified('disabledChannels');
      
      await nguild.save().catch(console.error);
      
      return message.channel.send(`Enabled spawns in ${channel.toString()}`);
      
    }
    

    
if(args[0].toLowerCase() == "levelup" || args[0].toLowerCase() == "lu"){
  let user = await User.findOne({id: message.author.id});
  if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
 // if(nguild.levelupchannel == null) return message.channel.send(`Before enabling/disabling you need to set the levelup channel`);
  if(!args[1]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config levelup <true/false>** or **${nguild.prefix || client.config.prefix}config lu <true/false>**`);
  if(!args[1].toLowerCase().match(/true|false/)) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config levelup <true/false>** or **${nguild.prefix || client.config.prefix}config lu <true/false>**`);
  user.levelupbtn = (args[1].toLowerCase() === "true") ? true : false;
  await user.save()
  return message.channel.send( {embed: {title: `Levelup configuration`, color: 0x00f9ff, description: `Levelup messages for <@${message.author.id}> has been set to \`${user.levelupbtn ? true : false}\``}} );
}
    
    if(args[0].toLowerCase() == "order") {
    
    if(args[1].toLowerCase() == 'alphabet') {
       let user = await User.findOne({id: message.author.id});
  if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
 // if(nguild.levelupchannel == null) return message.channel.send(`Before enabling/disabling you need to set the levelup channel`);
  /*if(!args[2]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config order alphabet <true/false>** `);
  if(!args[2].toLowerCase().match(/true|false/)) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config order alphabet <true/false>**`); */
  user.orderAlphabet = !user.orderAlphabet; //(args[1].toLowerCase() === "true") ? true : false;
  if(user.orderAlphabet == true) {
    user.orderIV = false;
  }
  await user.save()
  return message.channel.send( {embed: {title: `Levelup configuration`, color: 0x00f9ff, description: `Aphabet Order for <@${message.author.id}> has been set to \`${user.orderAlphabet ? true : false}\``}} );
}else if(args[1].toLowerCase() == 'iv') {
       let user = await User.findOne({id: message.author.id});
  if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
 // if(nguild.levelupchannel == null) return message.channel.send(`Before enabling/disabling you need to set the levelup channel`);
  /*if(!args[2]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config order alphabet <true/false>** `);
  if(!args[2].toLowerCase().match(/true|false/)) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}config order alphabet <true/false>**`); */
  user.orderIV = !user.orderIV; //(args[1].toLowerCase() === "true") ? true : false;
  if(user.orderIV == true) {
    user.orderAlphabet = false;
  }
  await user.save()
  return message.channel.send( {embed: {title: `Levelup configuration`, color: 0x00f9ff, description: `IV Order for <@${message.author.id}> has been set to \`${user.orderIV ? true : false}\``}} );
  }else if(args[1].toLowerCase() == 'number' || args[1].toLowerCase() == 'no') {
  let user = await User.findOne({id: message.author.id});
  if(!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
  user.orderAlphabet = false;
  user.orderIV = false;
  await user.save()
  return message.channel.send( {embed: {title: `Levelup configuration`, color: 0x00f9ff, description: `IV Order for <@${message.author.id}> has been set to \`Number\``}} );
}
    } 
  }
}