//userSchema
const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true,match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  firstname: { type: String, required: true, minlength: 3 },
  lastname: { type: String, required: true, minlength: 3 },
  username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin :{
    type:Boolean,
    default:false,
  },
});
  

const User = mongoose.model('User', userSchema);

module.exports = User;
 