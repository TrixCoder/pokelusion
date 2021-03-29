const {MessageEmbed, MessageCollector} = require("discord.js");
const cooldown = new Set();
const User = require("../../models/user");

module.exports = {
  name: 'trade',
  category: "Trade",
  description: "Trade credits or redeems or pokemons",
  usage: "trade <@user>",
  run: async(client, message, args, prefix) => {
    var doing;
    const userdb = await User.findOne({id: message.author.id});
    
    if(!userdb) return message.channel.send(`You must pick your starter before using trade command.`);
    
    if(!args[0]) return client.embed(message.channel, {
      name: ` | Ping someone to trade with.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
    const user = message.mentions.users.first();
    if(!user) return client.embed(message.channel, {
      name: ` | You didn't mention a proper user.`,
      av: message.author.avatarURL({format: "png", dynamic: true})
    });
    if(user.id == message.author.id) return message.channel.send(`You cannot trade with yourself.`);
    const userd = await User.findOne({id: user.id});
    
    if(!userd) return message.channel.send(`The user you mentioned didn't pick a starter.`);
    if(args[2] === "0" || args[2] === 0) return message.reply("You Cant Trade 0")
    if(cooldown.has(message.author.id)){ return message.channel.send(`You are already in a trade. Please wait for it to finish or if not please wait for a few minutes`)
    }else if(cooldown.has(user.id)) {return message.channel.send(`The user you mentioned is already in a trade or must wait for cooldown to end.`)
    }else{
    message.channel.send(`Hey ${user.toString()}. ${message.author.tag} wants to trade. Please type \`${prefix}accept\` to accept or \`${prefix}decline\` to cancel.`);
   const collector =  message.channel.createMessageCollector(msg => {
      return msg.author.id === user.id && msg.content.toLowerCase().startsWith(`${prefix}`);
    }, {time: 120000, errors: ['time']
       });
    
    cooldown.add(message.author.id);
    cooldown.add(user.id);
    
    collector.on("end", (r, reason) => {
      if(reason == "time") {
        cooldown.delete(message.author.id);
        cooldown.delete(user.id)
        message.channel.send(`Trade request has expired.`)
        
      }
      if(reason == "done traded"){
        cooldown.delete(message.author.id);
       cooldown.delete(user.id)
      }
    })
    collector.on("collect", async m => {
     if(m.content.toLowerCase().startsWith(`${prefix}decline`)) {
        cooldown.delete(message.author.id);
       cooldown.delete(user.id)
       collector.stop("lol")
       return message.channel.send(`Cancelled the trade.`);
     }
     if(m.content.toLowerCase().startsWith(`${prefix}accept`)) {
     collector.stop("lol")
     let msg = ``;
     const embed = new MessageEmbed()
     .setTitle(`Trade between ${message.author.username} & ${user.username}`)
     .setDescription(`For instructions on how to use trade. Please check \`${prefix}help\`.`)
     .addField(`${message.author.username} is offering | `,"```" + " " + msg + " " +"```")
     .addField(`${user.username} is offering | `, `\`\`\` ${msg} \`\`\``)
     .setColor("#05f5fc")
     let ms = await message.channel.send(embed);
     

     const uPokemons = [];
     const pPokemons = [];
     const Pcollector = new MessageCollector(message.channel, m => {
       return [
         message.author.id,
         user.id
       ].includes(m.author.id) && m.content.startsWith(`${prefix}`);
     }, {time: 60000});
   /* const Ucollector = new MessageCollector(message.channel, m => {
       return m.author.id === user.id && m.content.startsWith(`${prefix}`);
     }, {time: 60000}); */
     Pcollector.on("collect", async msg => {
       if(msg.author.id === message.author.id) {
       if(msg.content.startsWith(`${prefix}cancel`)) {
         Pcollector.stop("stopped");
         cooldown.delete(message.author.id);
         cooldown.delete(user.id)
         return message.channel.send(`${msg.author.tag} stopped the trade.`);
       }
       const saveEmoji = "✅";
       
       if(msg.content.startsWith(`${prefix}confirm`)) {
         embed.fields[0].name = `${message.author.username} is offering | ${saveEmoji}`;
         await ms.edit(embed);
         if(embed.fields[0].name.endsWith(saveEmoji) && embed.fields[1].name.endsWith(saveEmoji)) {
           if(doing == true) return;
           doing = true
           return check();
           
         }
       }else{
        
      if(pPokemons.length > 20) return msg.channel.send(`You cannot trade over 20 things at once.`);

       
       if(msg.content.startsWith(`${prefix}c `)) {
        const arg = msg.content.slice(`${prefix}c`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          const num = parseInt(arg.slice(1).join(" "));
          console.log(num);
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          if(arg[1].includes(`-`)){
            return msg.reply("You can't add negative coins")
          }
          if(num > userdb.balance) return msg.channel.send(`You do not have that much money.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;

          if(!uPokemons.some(r => r.type == "c")) {
            uPokemons.push({type: "c", value: num, name: "Credits"});
          }else{
            for(var i = 0; i < uPokemons.length; i++) {
              
              const data = uPokemons[i];
              if(data.type == "r") {
                uPokemons[i].value = num + uPokemons[i].value;
              }
              
            }
          }
          //uPokemons.push({type: "p", value: num, name: userdb.pokemons[num].name});
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!uPokemons.some(r => r.type === "c")) return msg.channel.send(`There is no money in the trade.`);
           embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < uPokemons.length; i++) {
             let data = uPokemons[i];
             if(data.tyoe == "c") {
               uPokemons[i].value = uPokemons[i].value - num;
               if(uPokemons[i].value == 0) uPokemons.splice(i, 1);
             }
           }
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}c <add/remove> <pokemon number>\``)
         }
        }
       
       if(msg.content.startsWith(`${prefix}p`)) {
        const arg = msg.content.slice(`${prefix}p`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          if(arg[1].includes(`-`)){
            return msg.reply("You can't add negative coins")
          }
          const num = parseInt(arg[1]);
          if(!userdb.pokemons[num - 1]) return msg.channel.send(`That pokemon doesn't exist in ur list of pokemons.`);
          if(uPokemons.some(r => r.type == "p" && r.value === num)) return message.channel.send(`That is already in your trading list.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
          uPokemons.push({type: "p", value: num, name: `${(userdb.pokemons[num - 1].shiny ? "⭐" : "")} ${userdb.pokemons[num - 1].name}`, object: userdb.pokemons[num - 1]});
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!uPokemons.some(r => r.type === "p" && r.value === num)) return msg.channel.send(`There is no pokemon named that trade.`);
           embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < uPokemons.length; i++) {
             let data = uPokemons[i];
             if(data.value == num) {
               uPokemons.splice(i, 1);
             }
           }
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}p <add/remove> <pokemon number>\``)
         }
        }
       
       if(msg.content.startsWith(`${prefix}r`)) {
        const arg = msg.content.slice(`${prefix}r`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
          if(num > userdb.redeems) return msg.channel.send(`You do not have that much amount of redeem.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
             if(!uPokemons.some(r => r.type == "r")) {
            uPokemons.push({type: "r", value: num, name: "Redeems"});
          }else{
            for(var i = 0; i < uPokemons.length; i++) {
              
              const data = uPokemons[i];
              if(data.type == "r") {
                uPokemons[i].value = num + uPokemons[i].value;
              }
              
            }
          }
          //pPokemons.push({type: "p", value: num, name: `${(userd.pokemons[num].shiny ? "⭐" : "")} ${userd.pokemons[num].name}`});
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          //await pPokemons.save();
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!uPokemons.some(r => r.type === "r")) return msg.channel.send(`There is no money in the trade.`);
           embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < uPokemons.length; i++) {
             let data = uPokemons[i];
             if(data.type == "r") {
               uPokemons[i].value = uPokemons[i].value - num;
               if(uPokemons[i].value == 0) uPokemons.splice(i, 1);
             }
           }
          embed.fields[0].value = `\`\`\` ${uPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}r <add/remove> <amount>\``)
         }
        }
       }
      }
      else if(msg.author.id === user.id) {
  
     
     

       if(msg.content.startsWith(`${prefix}cancel`)) {
         Pcollector.stop("stopped");
         cooldown.delete(message.author.id);
         cooldown.delete(user.id);
         return message.channel.send(`${msg.author.tag} stopped the trade.`);
       }
       const saveEmoji = "✅";
       
       if(msg.content.startsWith(`${prefix}confirm`)) {
         embed.fields[1].name = `${msg.author.username} is offering | ${saveEmoji}`;
         await ms.edit(embed);
         if(embed.fields[0].name.endsWith(saveEmoji) && embed.fields[1].name.endsWith(saveEmoji)) {
           if(doing == true) return;
           doing = true
           return check();
        
         }
       }else{
         if(pPokemons.length > 20) return msg.channel.send(`You cannot trade over 20 things at once.`);
       
        if(msg.content.startsWith(`${prefix}c `)) {
        const arg = msg.content.slice(`${prefix}c`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          if(arg[1].includes(`-`)){
            return msg.reply("You can't add negative coins")
          }
          const num = parseInt(arg[1]);
          if(num > userd.balance) return msg.channel.send(`You do not have that much money.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
          if(!pPokemons.some(r => r.type == "c")) {
            pPokemons.push({type: "c", value: num, name: "Credits"});
          }else{
            for(var i = 0; i < pPokemons.length; i++) {
              
              const data = pPokemons[i];
              if(data.type == "c") {
                pPokemons[i].value = num + pPokemons[i].value;
              }
              
            }
          }
          //uPokemons.push({type: "p", value: num, name: userdb.pokemons[num].name});
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!pPokemons.some(r => r.type === "c")) return msg.channel.send(`There is no money in the trade.`);
           embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < pPokemons.length; i++) {
             let data = pPokemons[i];
             if(data.type == "c") {
               pPokemons[i].value = pPokemons[i].value - num;
               if(pPokemons[i].value == 0) pPokemons.splice(i, 1);
             }
           }
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}c <add/remove> <amount>\``)
         }
        }
       
       
       if(msg.content.startsWith(`${prefix}p`)) {
        const arg = msg.content.slice(`${prefix}p`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          if(arg[1].includes(`-`)){
            return msg.reply("You can't add negative coins")
          }
          const num = parseInt(arg.slice(1).join(" "));
          if(!userd.pokemons[num - 1]) return msg.channel.send(`That pokemon doesn't exist in ur list of pokemons.`);
          if(pPokemons.some(r => r.type == "p" && r.value === num)) return message.channel.send(`That is already in your trading list.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
          pPokemons.push({type: "p", value: num, name: `${(userd.pokemons[num - 1].shiny ? "⭐" : "")} ${userd.pokemons[num - 1].name}`, object: userd.pokemons[num - 1]});
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          //await pPokemons.save();
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!pPokemons.some(r => r.type === "p" && r.value === num)) return msg.channel.send(`There is no pokemon named that trade.`);
           embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < pPokemons.length; i++) {
             let data = pPokemons[i];
             if(data.value == num) {
               pPokemons.splice(i, 1);
             }
           }
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value) } | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}p <add/remove> <pokemon number>\``)
         }
        }
       
       if(msg.content.startsWith(`${prefix}r`)) {
        const arg = msg.content.slice(`${prefix}r`.length).trim().split(/ +/g);
        if(arg[0] == "add") {
          if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
          if(num > userd.redeems) return msg.channel.send(`You do not have that much amount of redeem.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
             if(!pPokemons.some(r => r.type == "r")) {
            pPokemons.push({type: "r", value: num, name: "Redeems"});
          }else{
            for(var i = 0; i < pPokemons.length; i++) {
              
              const data = pPokemons[i];
              if(data.type == "r") {
                pPokemons[i].value = num + pPokemons[i].value;
              }
              
            }
          }
          //pPokemons.push({type: "p", value: num, name: `${(userd.pokemons[num].shiny ? "⭐" : "")} ${userd.pokemons[num].name}`});
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value)} | ${r.name}`).join("\n")} \`\`\``;
          //await pPokemons.save();
          await ms.edit(embed);
        }
         else if(arg[0] == "remove") {
           var res;
           if(isNaN(arg[1])) return msg.channel.send(`That is not a number.`);
          const num = parseInt(arg[1]);
           if(!pPokemons.some(r => r.type === "r")) return msg.channel.send(`There is no redeem in the trade.`);
          embed.fields[0].name = `${message.author.username} is offering | `;
          embed.fields[1].name = `${user.username} is offering | `;
           for(var i = 0; i < pPokemons.length; i++) {
             let data = pPokemons[i];
             if(data.type == "r") {
               pPokemons[i].value = pPokemons[i].value - num;
               if(pPokemons[i].value == 0) pPokemons.splice(i, 1);
             }
           }
          embed.fields[1].value = `\`\`\` ${pPokemons.map(r => `${parseInt(r.value) + 1} | ${r.name}`).join("\n")} \`\`\``;
          await ms.edit(embed);
           
         }
         else{
           return msg.channel.send(`It must be \`${prefix}r <add/remove> <pokemon number>\``)
         }
        }
     }
    }
     });

     Pcollector.on("end", async(r, reason) => {
      if(reason == "done traded") return console.log("Confirmed")
    })
     
      
       collector.on("end", async(r, reason) => {
        if(reason == "lol") {
          cooldown.delete(message.author.id);
       cooldown.delete(user.id)
        }
       cooldown.delete(message.author.id);
       cooldown.delete(user.id)
       if(reason == "stopped"){
         cooldown.delete(message.author.id);
       cooldown.delete(user.id)
       }
     });
      async function check() {
        Pcollector.stop("done traded");
        collector.stop("done traded");
        
        let pPokemonLol = [];
        pPokemons.filter(r => r.type === "p").forEach(async (r, i) => {
          if(!userd.pokemons[r.value - 1]) return;
            await userdb.pokemons.push(userd.pokemons[r.value - 1]);
          
          let index = userd.pokemons.indexOf(r.object);
          
          if(index < 0) return;
          
          
          await userd.pokemons.splice(index, 1);
            //await uPokemons.splice(i, 1);
        });
        
        pPokemons.forEach(async (r, i) => {
          /*if(r.type == "p") {
            if(!userd.pokemons[r.value - 1]) return;
            await userdb.pokemons.push(userd.pokemons[r.value - 1]);
            await userd.pokemons.splice(r.value - 1, 1);
            await pPokemons.splice(i, 1);
          } */
          if(r.type == "c") {
            userdb.balance = userdb.balance + r.value;
            userd.balance = userd.balance - r.value
          }else
          
          if(r.type == "r") {
            userdb.redeems = userdb.redeems + r.value;
            userd.redeems = userd.redeems - r.value
          }
          
        })
        
        
        let uPokemonLol = [];
        
        uPokemons.filter(r => r.type === "p").forEach(async(r, i) => {
          if(!userdb.pokemons[r.value - 1]) return;
            await userd.pokemons.push(userdb.pokemons[r.value - 1]);
          
           let index = userdb.pokemons.indexOf(r.object);
          
          if(index < 0) return;
          
          
          await userdb.pokemons.splice(index, 1);
            //await uPokemons.splice(i, 1);
        });
        
        uPokemons.forEach(async (r, i) => {
         /* if(r.type == "p") {
            if(!userd.pokemons[r.value - 1]) return;
            await userd.pokemons.push(userdb.pokemons[r.value - 1]);
            await userdb.pokemons.splice(r.value - 1, 1);
            await uPokemons.splice(i, 1);
          } */
          if(r.type == "c") {
            userd.balance = userd.balance + r.value;
            userdb.balance = userdb.balance - r.value
          }
          
          if(r.type == "r") {
            userd.redeems = userd.redeems + r.value;
            userdb.redeems = userdb.redeems - r.value
          }
          
        }) 
        
       

        await userdb.markModified('pokemons');
        
        await userd.markModified('pokemons');
      
       cooldown.delete(message.author.id);
       cooldown.delete(user.id)
       await userdb.save()
       await userd.save()
        return message.channel.send(`Trade Confirmed :white_check_mark:`);
   
        //await User.findOneAndUpdate({id: message.author.id}, {pokemons: userdb.pokemons, redeems: userdb.redeems, balance: userdb.balance}, { new: true})
        //await User.findOneAndUpdate({id: user.id}, {pokemons: userd.pokemons, redeems: userd.redeems, balance: userd.balance}, { new: true})
        
        //await userdb.save().catch(e => e);
        //await userd.save().catch(e => e);
        
     }
     }
   });
}
   setTimeout(()=> {
     cooldown.delete(message.author.id);
       cooldown.delete(user.id)
   }, 2*60000) 
    
  }
}
