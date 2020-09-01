const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
 id: String,
 pokemon: Object,
 price: Number
});

module.exports = mongoose.model("Market", GuildSchema);