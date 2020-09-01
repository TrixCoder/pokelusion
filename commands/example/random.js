const {randomNumber, genIV} = require("./../../functions.js");

module.exports = {
  name: "random",
  run: async(client, message, args) => {
    if(!args[0]) return;
    if(!args[1]) return;
    /*var gen = `${randomNumber(0, 100)}`;
    if(gen[1] == ".") {
      gen = gen.substr(0, 3);
    }else if(gen[2] == ".") {
      gen = gen.substr(0, 4);
    }else if(gen[3] == ".") {
      gen = gen.substr(0, 5);
    } */
    message.channel.send(genIV(args[0], args[1]));
  }
}