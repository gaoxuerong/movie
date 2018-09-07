let mongoose = require('mongoose');
let userSchema = require('../schemas/users');
let User = mongoose.model('User',userSchema);
module.exports = User;