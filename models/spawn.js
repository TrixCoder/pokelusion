const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
  name: {type:String, default: 'Spawn'},
  id: {type:String, required:true},
  pokemon: {type:Object, required:true},
  channel: {type: String, required: true},
  pokename: {type: String, required: true}
});

module.exports = mongoose.model("Spawn", GuildSchema);
