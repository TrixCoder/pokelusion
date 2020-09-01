const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, required: true},
  server: {type:Number, required:true},
  name: {type:String, default: 'server'},
  blacklist: {type:String, required:true}
});

module.exports = mongoose.model("server", productSchema);
