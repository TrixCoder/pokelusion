const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, required: true},
  userid: {type:Number, required:true},
  name: {type:String, default: 'user'},
  blacklist: {type:String, required:true}
});

module.exports = mongoose.model("user", productSchema);
