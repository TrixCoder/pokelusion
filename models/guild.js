const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
 id: String,
 prefix: String,
 spawnchannel: String,
 disabledChannels: Array,
 spawnbtn: Boolean,
 levelupchannel: String,
 levelupbtn: Boolean
});

module.exports = mongoose.model("Guild", GuildSchema);