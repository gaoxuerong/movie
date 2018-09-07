let mongoose = require('mongoose');
let contentSchema = require('../schemas/contents');
let content = mongoose.model('Content',contentSchema);
module.exports = content;