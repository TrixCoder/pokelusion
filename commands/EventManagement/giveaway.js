const ms = require("ms");
const { MessageEmbed, MessageCollector } = require("discord.js");
const GiveawaySchema = require("./../../models/Giveaway");
//const cooldown = new Map();
const {classToPlain} = require("class-transformer");
const { stripIndentTransformer } = require("common-tags");
const moment = require("moment");

async function fetchReactedUsers(reaction, after) {
    const opts = { limit: 100, after };
    const reactions = await reaction.users.fetch(opts);
    if (!reactions.size) return [];
  
    const last = reactions.last().id;
    const next = await fetchReactedUsers(reaction, last);
    return reactions.array().concat(next);
  }

module.exports = {
    name: `giveaway`,
    category: 'EventManagement',
    description: `Create  or end or reroll a giveaway.`,
    aliases: ["g"],
    usage: 'giveaway create <#channel> <duration> <winnerCount> | giveaway end <messageId> | giveaway reroll <messageId>',
    run: async(client, msg, args, prefix) => {
        const message = msg;
        let emojiID = client.config.emojis;
            let loading, success, fail;
                loading = "👷"
                success = "🎉"
                fail = "🛑"
            

        if(!args[0]) {
            return client.embed(message.channel, {
                name: ` | Giveaway Help Menu`,
                av: message.guild.iconURL({format: "png", dynamic: true})
            }, undefined, `Hey ${message.author}! How to use giveaway cmd? Here's the help for you! \n CMD: ${["create", "end", "reroll"].map(r => `\`${r}\``).join(" ")} \n How to use?: \`${prefix}giveaway <cmd>\` \n For example: \`${prefix}giveaway reroll 723906744295751681\`..`, "#F6260C", undefined, {
                name: client.config.footer(),
                av: client.user.avatarURL({format: "png", dynamic: true})
            }).then(c => c.delete({timeout: 30000}));
        }

        if(args[0] == "start"){
          var giveawayChannel = message.channel
          var giveawayDuration = ms(args[1])
          var wfilter = args[2].replace("w", "")
          var giveawayNumberWinners = wfilter
          var giveawayPrize = args[3]
          let secondndCheck = await GiveawaySchema.findOne({id: message.guild.id, channel: giveawayChannel.id, enabled: true});
                    if(secondndCheck) return message.reply(`${fail} There is already a giveaway running in that channel. Please wait for it to finish to run one more there ${fail}.`)
                let embed = new MessageEmbed()
                .setColor(0xcc8822)
                .setTitle(giveawayPrize)
                .setDescription(`Possible Winners: ${giveawayNumberWinners}\nReact with :tada: to enter!\n HOSTED BY: ${message.author}.`)
                .setFooter(`Ends at`)
                .setTimestamp(Date.now() + giveawayDuration)
                let m = await giveawayChannel.send(embed);
                await m.react("🎉");
                let check = await GiveawaySchema.find({id: message.guild.id, enabled: true});
                if(check.length > 15 && !check(msg.author.id)) {
                    return message.reply(`${fail} You have over 15 giveaways running. Please upgrade to premium to run more or stop a giveaway. ${fail}`)
                }
                const object = {
                    name: 'Giveaway',
                    id: message.guild.id,
                    channel: giveawayChannel.id,
                    embed: classToPlain(embed),
                    winnerCount: giveawayNumberWinners,
                    host: message.author.id,
                    time: giveawayDuration + Date.now(),
                    prize: giveawayPrize,
                    msgId: m.id,
                    enabled: true,
                    role: null
                }
                const newDOc = new GiveawaySchema(object);
    
                await newDOc.save().catch(e => console.log(e));    
          }
      
        if(args[0] == "create") {
           /* const check = await cooldown.get(message.guild.id);
            const time = await client.convertMs(check - Date.now())
            if(check) return client.embed(msg.channel, {
                name: ` | Please wait ${time} seconds before creating another giveaway.`,
                av: msg.author.avatarURL({format: "png", dynamic: true})
              });

            let giveawayChannel = message.mentions.channels.first();

            if(!giveawayChannel){
                return message.channel.send(`${fail} You have to mention a valid channel!`);
            }
        

            let giveawayDuration = args.slice(2)[0];

            if(!giveawayDuration || isNaN(ms(giveawayDuration))){
                return message.channel.send(`${fail} You have to specify a valid duration!`);
            }
        
        
            let giveawayNumberWinners = args.slice(3)[0];
            
            if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
                return message.channel.send(`${fail} You have to specify a valid number of winners!`);
            } */

            let embed = new MessageEmbed()
            .setAuthor(` Giveaway Creation Set-Up`, msg.guild.iconURL({format: 'png', dynamic: true}))
            .setFooter(`This setup will cancel in 1 minute if no response or type cancel to cancel the setup at any time.`, client.user.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`Please mention a channel or a user id where the giveaway will occur.`)
            
            /*let giveawayPrize = args.slice(4).join(' ');
            if(!giveawayPrize){
                return message.channel.send(`${fail} You have to specify a valid prize!`);
            } */
            let num = 1;
            let maxTries = 5;
            let tries = 1;
            let MSG = await msg.channel.send(embed);
            let collector = new MessageCollector(msg.channel, (m) => {
                return m.author.id === msg.author.id;
            }, {time: 60000});
            let giveawayChannel, giveawayDuration, giveawayNumberWinners, giveawayRole, giveawayServer, giveawayPrize;
            collector.on("collect", async(m) => {
                if(/cancel/i.test(m.content)) return collector.stop("cancelled")
                if(m.deletable) m.delete();
                if(num == 1) {
                    const channel = m.mentions.channels.first() || client.channels.cache.get(m.content);

                    if(!channel) {
                        tries = tries + 1;
                        if(tries > maxTries) {
                            return collector.stop("MAX_TRIED")
                        }
                        return msg.channel.send(`${fail} You have to mention a valid channel. You have ${(maxTries - tries)} Tries left.`).then(c => c.delete({timeout: 5000}));
                    }

                    giveawayChannel = channel;

                    num = num + 1;

                    embed.addField(`Giveaway Channel`, channel.toString(), true);
                    embed.setDescription(`Now Please tell how long the giveaway should last for?`)

                    return MSG.edit(embed);

                }
            else if(num == 2) {

                if(isNaN(ms(m.content))) {

                        tries = tries + 1;
                        if(tries > maxTries) {
                            return collector.stop("MAX_TRIED")
                        }

                    return msg.channel.send(`${fail} You have to mention a valid time. You have ${(maxTries - tries)} Tries left.`).then(c => c.delete({timeout: 5000}));

                }

                giveawayDuration = ms(m.content);

                num = num + 1;

                embed.addField(`Giveaway Time`,  moment.duration(giveawayDuration).format(" D [days], H [hrs], m [mins], s [secs]"), true)
                //embed.setDescription(`Would you like to enable role requirement? type a role id if you want to or type \`no\` to not have role requirement.`);
                .setDescription(`Please specify max winners for winning the giveaay? (max winners is 6)`);

                return MSG.edit(embed);


            }
           /* else if(num == 3) {
                let check = new RegExp(`^no$`);
                if(!m.content.match(check)) {
                    let role = message.guild.roles.cache.get(m.content);

                    if(!role) {
                        tries = tries + 1;
                        if(tries > maxTries) {
                            return collector.stop("MAX_TRIED")
                        }

                    return msg.channel.send(`${fail} You have to mention a valid role id. You have ${(num - maxTries)} Tries left.`);

                }
                
                giveawayRole = role.id;

                embed.addField(`Role Requirement`, role.toString())
                .setDescription(`Please specify server id for server requirement. If you don't want to have it then type \`no\` to cancel it.`);



                }

            } */

            else if(num == 3) {
                if(isNaN(m.content) && Number(m.content) > 6) {
                    tries = tries + 1;
                    if(tries > maxTries) {
                        return collector.stop("MAX_TRIED")
                    }

                return msg.channel.send(`${fail} Please mention valid winners & make sure not to go over 6 winners. You have ${(maxTries - tries)} Tries left.`).then(c => c.delete({timeout: 5000}));
                }

                giveawayNumberWinners = parseInt(m.content);

                num = num + 1;

                embed.addField(`Giveaway Winners`, giveawayNumberWinners)
                embed.setDescription(`Would you like to enable role requirement?. type \`true\` to enable or \`false\` for not.`);

                return MSG.edit(embed);

            }else if(num == 4) {

                if(/true/i.test(m.content)) {

                    giveawayRole = "DOING";


                    num = num + 1;

                    embed.setDescription(`Mention a role or role id for the requirement.`);



                    return MSG.edit(embed);

                }

                else if(/false/i.test(m.content)) {
                    giveawayRole = null;

                    num = num + 1;


                    embed.setDescription(`Please provide a reward for winning the giveaway.`)
                    .addField(`Role Requirement`, `NONE`)

                    return MSG.edit(embed)
                }

            }
            else if(num == 5 && giveawayRole == "DOING") {
                let role = m.mentions.roles.first() || m.guild.roles.cache.get(m.content);

                if(!role) {
                    tries = tries + 1;
                    if(tries > maxTries) {
                        return collector.stop("MAX_TRIED")
                    }

                return msg.channel.send(`${fail} Invalid role provided. Please provide a valid role. You have ${(maxTries - tries)} Tries left.`).then(c => c.delete({timeout: 5000}));
                }

                giveawayRole = role.id;

                embed.setDescription(`Please provide a reward for winning the giveaway.`)

                embed.addField(`Role Requirement`, role.toString())

                return MSG.edit(embed);
            }

            
            else if(num == 5 && giveawayRole !== "DOING") {
                giveawayPrize = m.content;
                collector.stop("ENDED");

                embed.addField(`Giveaway Prize`, giveawayPrize)
                .setDescription(`You're all set. We are working on starting your giveaway.`);

                await MSG.edit(embed);

                let confirmMsg = await message.channel.send(`${loading} ___***Creating your giveaway***___ ${loading}. Please wait for it to process.`);
                setTimeout(async() => {
                    let secondndCheck = await GiveawaySchema.findOne({id: message.guild.id, channel: giveawayChannel.id, enabled: true});
                    if(secondndCheck) return confirmMsg.edit(`${fail} There is already a giveaway running in that channel. Please wait for it to finish to run one more there ${fail}.`)
                let embed = new MessageEmbed()
                .setColor(0xcc8822)
                .setTitle(giveawayPrize)
                .setDescription(`Possible Winners: ${giveawayNumberWinners}\nReact with :tada: to enter!\n HOSTED BY: ${message.author}.\n ${giveawayRole ? `Must have the role <@&${giveawayRole}> to enter the giveaway.` : ''}`)
                .setFooter(`Ends at`)
                .setTimestamp(Date.now() + giveawayDuration)
                let m = await giveawayChannel.send(embed);
                await m.react("🎉");
                let check = await GiveawaySchema.find({id: message.guild.id, enabled: true});
                if(check.length > 15 && !check(msg.author.id)) {
                    return confirmMsg.edit(`${fail} You have over 15 giveaways running. Please upgrade to premium to run more or stop a giveaway. ${fail}`)
                }
                
                const object = {
                    name: 'Giveaway',
                    id: message.guild.id,
                    channel: giveawayChannel.id,
                    embed: classToPlain(embed),
                    winnerCount: giveawayNumberWinners,
                    host: message.author.id,
                    time: giveawayDuration + Date.now(),
                    prize: giveawayPrize,
                    msgId: m.id,
                    enabled: true,
                    role: giveawayRole
                }
                const newDOc = new GiveawaySchema(object);
    
                await newDOc.save().catch(e => console.log(e));
    
                confirmMsg.edit(`${success} Sucessfully Started the giveaway ${success}`);
            }, 5000);
            }
            });

            collector.on("end", (lol, reason) => {
                if(reason == "MAX_TRIED") return msg.channel.send(`Set-Up cancelled due to too many failed attempts.`);

                if(["cancelled", "time"].includes(reason)) return msg.channel.send(`Cancelled giveaway Set-Up.`);
            })
            

    
            

       

            

        }
        else if(args[0] == "end") {
            if(!args[1] || !message.channel.messages.fetch(args[1])) {
                return message.channel.send(`${fail} Invalid Message Id Given. Either not provided or doesn't exist in the channel.`);
            }
            let msg = await message.channel.messages.fetch(args[1]);

            let result = await GiveawaySchema.findOne({id: message.guild.id, channel: message.channel.id, msgId: msg.id, enabled: true});

            if(!result) return message.channel.send(`${fail} No Giveaway running with that message id.`);

            let embed = new MessageEmbed(result.embed)

            
            const reaction = msg.reactions.cache.get("🎉");
  

            let users = await fetchReactedUsers(reaction);
           
            const list = await users.filter(u =>  u.bot !== true);

   if (!list.length) {
 
    embed.description = `Winner: No one.`;
    embed.footer.text = `Giveaway Finished`;

     result.enabled = false;
     
     await result.save().catch(e => console.log(e));
    //await GiveawaySchema.deleteOne({id: result.id, enabled: true, channel: result.channel, msgId: result.msgId})
    return msg.edit(embed);
}

            let winners = [];
for (let i = 0; i < result.winnerCount; i++) {
  const x = client.draw(list);

  if (!winners.includes(x)) winners.push(x);
}

embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
embed.footer.text = `${client.config.footer()} | Giveaway Finished`;


await msg.edit(embed);
result.enabled = false

 await result.save().catch(e => console.log(e))
if (winners.length) msg.channel.send(`Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${result.prize}**!`);


        }
        else if(args[0] == "reroll") {
            if(!args[1] || !message.channel.messages.fetch(args[1])) {
                return message.channel.send(`${fail} Invalid Message Id Given. Either not provided or doesn't exist in the channel.`);
            }
            let msg = await message.channel.messages.fetch(args[1]);

            let result = await GiveawaySchema.findOne({id: message.guild.id, channel: message.channel.id, msgId: msg.id, enabled: false});

            if(!result) return message.channel.send(`${fail} No Giveaway ended with that message id.`);

            let embed = new MessageEmbed(result.embed)

            
            const reaction = msg.reactions.cache.get("🎉");
  

            let users = await fetchReactedUsers(reaction);
           
            const list = await users.filter(u =>  u.bot !== true);

   if (!list.length) {
    /*try {
        clearInterval(client.collector.get(result.msgId));
      }catch(e)
       {} */
    embed.description = `Winner: No one.`;
    embed.footer.text = `Giveaway Finished`;

    await GiveawaySchema.deleteOne({id: result.id, enabled: true, channel: result.channel, msgId: result.msgId})
    return msg.edit(embed);
}

            let winners = [];
for (let i = 0; i < result.winnerCount; i++) {
  const x = client.draw(list);

  if (!winners.includes(x)) winners.push(x);
}

embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;


await msg.edit(embed);
result.enabled = false
/*try {
  clearInterval(client.collector.get(result.msgId));
}catch(e)
 {} */
 await result.save().catch(e => console.log(e))
if (winners.length) msg.channel.send(`Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${result.prize}**!`);


        }
    }
}