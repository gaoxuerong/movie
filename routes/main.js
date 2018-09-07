var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Content = require('../models/Content');
var  data;
var temp;
var datas = {};
/*
* 获取通用信息
* */
router.use(function (req,res,next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
})
/* 系统默认首页 */
router.get('/', function(req, res, next) {
    data.category = req.query.category||'';
    data.page = Number(req.query.page || 1),
        data.limit = 8,
        data.count=0,
        data.pages = 1
    var where = {};
    if (data.category){
        where.category = data.category;
    }
    Content.where(where).count().then(function (count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //最大不超过pages
        data.page = Math.min(data.page,data.pages);
        //最小不小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        return  Content.where(where).find().sort({addTime:-1}).limit(data.limit).
        skip(skip).populate(['category','user']);
    }).then(function (articles) {
        data.articles = articles;
        res.render('index', data);
    })
});

//文章详情页
router.get('/view', function(req, res) {
    data.page = Number(req.query.page || 1),
        data.limit = 5,
        data.count=0,
        data.pages = 1
    var where = {};
    data.category = req.query.category||'';
    var contentId = req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        data.content = content;
        content.view = (content.view)+1;
        data.post = content.post;
        data.moviedate = content.moviedate.toLocaleString();
        data.director = content.director;
        data.score = content.score;
        data.description = content.description;
        content.save();
    });
    Content.where(where).count().then(function (count) {
        return  Content.where(where).find().sort({addTime:-1}).limit(0).
        skip(0).populate(['category','user']);
    }).then(function (articles) {
        data.articles = articles;
    }).then(function (){
        Content.find({
            category:data.content.category
        }).then(function (category) {
            data.category = category;
            res.render('view', data);
        })
    })
});
//搜索页
router.post('/main/search', function(req, res) {
    var where = {};
    var contentname = req.body.contentname||'';
    if(contentname ==''){
        Content.findOne({
            title:contentname
        }).then(function () {
            res.render('index_error',datas);
        });
    }else {
        Content.findOne({
            title:contentname
        }).then(function (content) {
            data.content = content;
        }).then(function () {
            if(data.content) {
                Content.findOne({
                    _id: data.content.id
                }).then(function (content) {
                    data.view = (content.view) + 1;
                    data.post = content.post;
                    data.moviedate = content.moviedate.toLocaleString();
                    data.director = content.director;
                    data.score = content.score;
                    data.description = content.description;
                    content.save();
                });
                Content.where(where).count().then(function (count) {
                    return Content.where(where).find().sort({addTime: -1}).limit(0).skip(0).populate(['category', 'user']);
                }).then(function (articles) {
                    data.articles = articles;
                }).then(function () {
                    Content.find({
                        category: data.content.category
                    }).then(function (category) {
                        data.category = category;
                        res.render('detail', data);
                    })
                })
            } else {
                res.render('index_error',datas);
            }
            });
    }
});
module.exports = router;

