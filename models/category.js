let mongoose = require('mongoose');
let categoriesSchema = require('../schemas/categories');
let Category = mongoose.model('Category',categoriesSchema);
module.exports = Category;