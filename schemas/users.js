var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/twmovie',{useMongoClient: true});

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    //是否是管理员
    isadmin:{
        type:Boolean,
        default:false
    }
});
module.exports = UserSchema;
