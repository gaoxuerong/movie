var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Content = require('../models/Content');
//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    }
    next();
});
/* 用户注册 */
/*
* 注册逻辑:password username不为空
* password repassword相同
* 用户是否被注册
* 数据库查询
* */
router.post('/user/register', function(req, res, next) {
    //console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = 1;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }
        //保存信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newuserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    })
});
router.post('/user/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //判断用户名或者密码是否为空
    if(username ==''||password ==''){
        responseData.code=1;
        responseData.message='用户名或者密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中用户名和密码是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };
        let jsonInfo = JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        });
        req.cookies.set("userInfo",jsonInfo);
        res.json(responseData);
        return;
    }).catch((error)=>{
        console.log("error:"+error);
});
    //登出
    router.post('/user/logout', function(req, res) {
        req.cookies.set("userInfo",null);
        res.json(responseData);
    });
});
/*
* 获取指定文章的所有评论
* */
router.get('/comment',function (req,res) {
    var contentId = req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then(function (newContent) {
        responseData.data = newContent.comments;
        res.json(responseData);
    }).catch(function (e) {
        console.log(e);
    })
})
/*
* 评论提交
* */
router.post('/comment/post',function(req,res){
    var contentId = req.body.contentid||'';
    var postData={
        username: req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    //查找当前文章的内容信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData)
    }).catch(function (e) {
        console.log(e);
    })
})
module.exports = router;
