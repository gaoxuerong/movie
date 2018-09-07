var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var Cookies = require('cookies');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require('ejs');
var admin = require('./routes/admin');
var api = require('./routes/api');
var main = require('./routes/main');
var app = express();
var User = require('./models/user')
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    //解析登录用户的cookie信息
    req.userInfo ={};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isadmin = Boolean(userInfo.isadmin);
                next();
            })

        } catch (e){
            console.log('err:'+e);
            next();
        }
    }else{
        next();
    }
})
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', main);
app.use('/api', api);
app.use('/admin', admin);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
