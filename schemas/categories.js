var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//分类的表结构
var categoriesSchema = new mongoose.Schema({
    name: String
});
module.exports = categoriesSchema;
