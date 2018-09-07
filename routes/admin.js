var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Content = require('../models/Content');

router.use(function (req, res,next) {
    if(!req.userInfo.isadmin){
        res.send("sorry,只有管理员才可以进入哦！！！");
        return ;
    }
    next();
})
//后台首页
router.get('/', function(req, res, next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    })
});
//用户管理
router.get('/user', function(req, res) {
    /*
    * 从数据库读取数据
    * limit(num)限制获取数据条数
    * skip()忽略数据的条数
    * */
    var page = Number(req.query.page||1);
    var limit = 10;
    var pages = 1;
    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //最大不超过pages
        page = Math.min(page,pages);
        //最小不小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        User.find().limit(limit).skip(skip).
        then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                limit:limit,
                pages:pages,
                page:page
            })
        }).catch((error)=>{
            console.log("err:"+error);
    });
    }).catch((error)=>{
        console.log("err:"+error);
});

});
//后台管理电影分类首页
router.get('/category', function(req, res) {
    var page = Number(req.query.page||1);
    var limit = 10;
    var pages = 1;
    Category.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //最大不超过pages
        page = Math.min(page,pages);
        //最小不小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        //默认情况下随机生成的id值有时间戳，数据越新，时间戳越大，所以选择降序排列
        Category.find().sort({_id:-1}).limit(limit).skip(skip).
        then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                count:count,
                limit:limit,
                pages:pages,
                page:page
            })
        }).catch((error)=>{
            console.log("err:"+error);
    });
    }).catch((error)=>{
        console.log("err:"+error);
});
});
//分类的添加
router.get('/category_add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

//分类的保存
router.post('/category_add', function(req, res) {
    var name =  req.body.name||'';
    if(name ==""){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message:'名称不能为空',
        });
        return;
    }
    //判断数据库是否存在同名分类名称
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //数据库已经存在该分类
            res.render('admin/error',{
                userInfo: req.userInfo,
                message:'分类已经存在'
            })
            return Promise.reject();
        }else {
            //数据库不存在该分类
            return new Category({
                name:name,
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })
});
/*
* 分类的修改
* */
router.get('/category_edit',function(req,res){
    //获取要修改的信息
    var id = req.query.id||'';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    }).catch(function (err) {
        console.log("categoryerror:"+err);
    });
})
/*分类的修改保存*/
router.post('/category_edit',function (req,res) {
    var id = req.query.id||'';
    var name = req.body.name||'';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            //当用户没有做任何修改就提交的时候
            if(name==category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //要分类的名称在数据库是否存在
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    }).catch(function (err) {
        console.log("err"+err);
    })
})
//分类的删除
router.get('/category_delete',function(req,res){
    //获取要删除的分类的id
    var id = req.query.id||'';
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    }).catch(function (err) {
        console.log("categoryDeleteerror:"+err);
    });
})
//电影内容首页
router.get('/content', function(req, res) {
    var page = Number(req.query.page||1);
    var limit = 10;
    var pages = 1;
    Content.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //最大不超过pages
        page = Math.min(page,pages);
        //最小不小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        //默认情况下随机生成的id值有时间戳，数据越新，时间戳越大，所以选择降序排列
        Content.find().sort({_id:-1}).limit(limit).
        skip(skip).populate(['category','user']).then(function(contents){
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                count:count,
                limit:limit,
                pages:pages,
                page:page
            })
        }).catch((error)=>{
            console.log("err:"+error);
    });
    }).catch((error)=>{
        console.log("err:"+error);
});
});
//电影详细内容添加页面
router.get('/content_add', function(req, res) {
    Category.find().then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })
});
//电影详细内容保存
router.post('/content_add', function(req, res) {
    if(req.body.category==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'电影分类不能为空'
        })
        return;
    }
    if(req.body.title==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'电影标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    new  Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id,
        actor:req.body.actor,
        post:req.body.post,
        director:req.body.director,
        moviedate:req.body.moviedate,
        score:req.body.score,
        description:req.body.description,
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        });
    })
});
/*
* 电影详细内容的修改
* */
router.get('/content_edit',function(req,res){
    //获取要修改的信息的id
    var id = req.query.id||'';
    var categories = [];
    Category.find().sort({_id:-1}).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category').then(function (content) {
            if (!content) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '需要修改的内容不存在'
                });
                return Promise.reject();
            } else {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    content: content,
                    categories:categories
                });
            }
        }).catch(function (err) {
            console.log("contenterror:" + err);
        });
    });
})
/*
* 保存修改的电影详细内容
* */
router.post('/content_edit', function(req, res) {
    var id = req.query.id||'';
    if(req.body.category==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        })
        return;
    }
    if(req.body.title==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        user:req.userInfo._id,
        actor:req.body.actor,
        post:req.body.post,
        director:req.body.director,
        moviedate:req.body.moviedate,
        score:req.body.score,
    }).then(function (rs) {
        res.render('admin/content_edit_success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content_edit?id='+id
        });
    })
});
//电影详细内容的删除
router.get('/content_delete',function (req,res) {
    var id = req.query.id||'';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    })
})
module.exports = router;
