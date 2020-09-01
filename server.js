String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

const {MessageEmbed, Discord} = require('discord.js');
const config = require("./config.js");
const Client = require("./Classes/Client");
const client = new Client();
client.config = config;
const mongoose = require("mongoose")
mongoose.connect(`mongodb://127.0.0.1:27017/pokelusion`,{ useNewUrlParser: true, useUnifiedTopology: true }).then(mon => {
  console.log(`Connected to the database!`);
}).catch((err) => {
        console.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });    


const Guild = require('./models/guild.js')
const {readdirSync} = require("fs");
const ascii = require("ascii-table");
const table = new ascii("Commands");
client.msgs = require('./db/blacklist.json')

client.on("guildCreate", guild => {
  let embed = new MessageEmbed()
  .setTitle(`Guild Joined, I'm now in ${client.guilds.cache.size} guilds!`)
  .setDescription(`This guild has ${guild.memberCount} members.`)
  .addField("Owner", `${guild.owner}`)
  .addField("Owner ID", `${guild.owner.id}`)
  .addField("Guild Name", `${guild.name}`)
  .addField("Guild ID", `${guild.id}`)
  .setFooter(`Guild Created at ${guild.createdAt}`)
  .setColor("#05f5fc")
  .setThumbnail(guild.displayAvatarURL)
  client.channels.cache.get("718461725531308112").send(embed);
  const invitechannels = guild.channels.cache.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
  invitechannels.random().createInvite()
  .then(invite=> 
    console.log('Create Invite:\nhttps://discord.gg/' + invite.code)
    )
})

client.on("guildDelete", guild => {
  let embed = new MessageEmbed()
  .setColor("#05f5fc")
  .setTitle(`Guild left, I'm now in ${client.guilds.cache.size} guilds!`)
  .setDescription(`This guild has ${guild.memberCount} members.`)
  .addField("Owner", `${guild.owner}`)
  .addField("Owner ID", `${guild.owner.id}`)
  .addField("Guild Name", `${guild.name}`)
  .addField("Guild ID", `${guild.id}`)
  .setFooter(`Guild Created at ${guild.createdAt}`)
  .setThumbnail(guild.displayAvatarURL)
  client.channels.cache.get("718461725531308112").send(embed);
}); 

const handleC = () => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`./commands/${dir}/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => { 
              client.aliases.set(alias, pull.name)  
              if(pull.category !== "botowner") client.aliashelp.push(alias)
            });
        }
    });
    
    console.log(table.toString());
}
handleC();


client.login("NTUyMzY3ODI3MzcwMzc3MjE4.XH4OoA.oGYtiUc3Pv2fSxUpFE6aX7EqzBU");

/* event handler */
  const events = readdirSync("./events/");
  for (const event of events) {
    const file = require(`./events/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  };

require('./app.js');
