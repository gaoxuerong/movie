var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//电影内容的表结构
var contentSchema = new mongoose.Schema({
    //关联字段-内容分类的id
    category:{
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //分类标题
    title: String,
    //关联字段-用户id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //添加时间
    addTime:{
      type:Date,
        default:new Date()
    },
    //阅读量
    view:{
      type:Number,
      default:0
    },
    //海报
    post:{
        type:String,
        default:''
    },
    //评分
    score:{
        type:Number,
        default:0
    },
    //上映时间
    moviedate:{
        type:Date,
        default:new Date()
    },
    director:{
        type:String,
        default:''
    },
    //简介
    description:{
        type:String,
        default:''
    },
    //演员
    actor:{
        type:String,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
});
module.exports = contentSchema;
