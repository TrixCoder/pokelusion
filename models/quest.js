const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  user: {type:String, required:true},
  name: {type:String, default: 'quest'},
  doing: {type:String, required:true},
  done: {type:Array, required: true},
  status: {type:Boolean, default: false}
});

module.exports = mongoose.model("quest", productSchema);
