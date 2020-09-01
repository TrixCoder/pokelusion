const {MessageAttachment} = require("discord.js")
const randomNumber = (min, max) => {
    const t = Math.random() * (max - min) + min;
  return t.toFixed(2);
}

module.exports = {
  attach: async(client, url) => {
    let name = `PokelusionSpawn.jpg`
    if(url.endsWith(".gif")) name = `PokelusionSpawn.gif`
        const attachment = new MessageAttachment(url, name);
    const r = await client.channels.cache.get("724462918204391456").send(attachment)
      return r.attachments.first().attachment
},
  randomNumber: randomNumber,
  genIV: (min, max) => {
    var gen = `${randomNumber(min, max)}`;
    if(gen[1] == ".") {
      gen = gen.substr(0, 3);
    }else if(gen[2] == ".") {
      gen = gen.substr(0, 4);
    }else if(gen[3] == ".") {
      gen = gen.substr(0, 5);
    }
    return gen;
  
},
   getlength: (number) => {
      return number.toString().length;
    }
}