const {genIV} = require("./../functions.js");
const fix = (r) => {
  var gen = r;
  if(gen[1] == ".") {
      gen = gen.substr(0, 3);
    }else if(gen[2] == ".") {
      gen = gen.substr(0, 4);
    }else if(gen[3] == ".") {
      gen = gen.substr(0, 5);
    }
  return gen;

}

var natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Docile", "Bold", "Relaxed", "Impish", "Lax", "Serious", "Timid", "Hasty", "Jolly", "Naive", "Bashful", "Modest", "Mild", "Quiet", "Rash", "Quirky", "Calm", "Gentle", "Sassy", "Careful"]


module.exports = class Pokemon {
  constructor(object, lvl, xp) {
    this.level = lvl ? lvl : 1;
    this.xp = xp ? xp : 0;
    this.name = object.name;
    this.url = object.url
    this.hp = Math.floor(Math.random() * 31);
    this.atk = Math.floor(Math.random() * 31);
    this.def = Math.floor(Math.random() * 31);
    this.spatk = Math.floor(Math.random() * 31);
    this.spdef = Math.floor(Math.random() * 31);
    this.speed = Math.floor(Math.random() * 31);
    this.moves = [];
    this.shiny = object.shiny;
    this.rarity = object.rarity;
    this.xp = 0;
    this.nature = natures[Math.floor(Math.random() * natures.length)]
    let totaliv = ((this.hp+this.atk+this.def+this.spatk+this.spdef+this.speed)/186)*100
    //const totalivs = Math.floor(Math.round(totaliv)) 
    this.totalIV = (totaliv.toFixed(2));
  }
}

