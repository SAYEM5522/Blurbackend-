const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const AppsumoCode = new Schema({
  code: {
    type: String,
    required: true
  },
  turn:{
    type:Number
  }
});

// Create the model
const Appsumo = mongoose.model('AppsumoCode', AppsumoCode);

module.exports = Appsumo;
