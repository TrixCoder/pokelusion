const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
 id: String,
 balance: Number,
 xp: Number,
 level: Number,
 selected: Number,
 pokemons: Array,
 redeems: Number,
 badges: Array,
 levelupbtn: {type:Boolean, default:true},
 orderAlphabet: {type:Boolean, default:false},
 orderIV: {type:Boolean, default:false}
});

module.exports = mongoose.model("User", UserSchema);
