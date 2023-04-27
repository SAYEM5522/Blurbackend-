const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});

// Create the model
const User = mongoose.model('User', UserSchema);

module.exports = User;

// geAUpi2sSPs0Civh