var prepage=5;
var page=1;
var pages = 0;
var comments=[];
//提交评论
$('#messageBtn').on('click',function(){
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#messageContent').val(),
        },
        success:function(responseData){
            $('#messageContent').val('');
            comments=responseData.data.comments.reverse();
            renderComment();
        }

    });
});
//每次加载时获取文章下的所有评论
$.ajax({
    type:'get',
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val()
    },
    success:function(responseData){
        comments = responseData.data.reverse()
        renderComment();

    }
});

$('.pager').delegate('a','click',function(){
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
    renderComment();
})

function renderComment(){
    $('.messageCount').html(comments.length);
     pages = Math.max(Math.ceil(comments.length/prepage),1);
    var start=Math.max(0,(page-1)*prepage);
    var end=Math.min(start+prepage,comments.length);
    var $lis = $('.pager li');
    $lis.eq(1).html(`${page}/${pages}`);
    if(page<=1){
        page=1;
        $lis.eq(0).html(`<span>没有上一页了</span>`);
    }else {
        $lis.eq(0).html(`<a href="javascript:;">上一页</a>`);
    }
    if(page>=pages){
        page=pages;
        $lis.eq(2).html(`<span>没有下一页了</span>`);
    }else {
        $lis.eq(2).html(`<a href="javascript:;">下一页</a>`);
    }
    if(comments.length==0){
        $(".messageList").html(`<div class="messageBox"><p>还没有评论</p></div>`);
    }else {
        var html = '';
        for(var i=start;i<end;i++){
            html+=`<div class="messageBox">
            <p class="name clear">
            <span class="fl">${comments[i].username}</span>
            <span class="fr">${formatDate(comments[i].postTime)}</span>
            </p>
            <p>${comments[i].content}</p>
        </div>`
        }
        $(".messageList").html(html);
    }
}
//格式化日期
function formatDate(d){
    var date1=new Date(d);
    var CurrentDate = "";
   //初始化时间
    var Year= date1.getFullYear();//ie火狐下都可以
    var Month= date1.getMonth()+1;
    var Day = date1.getDate();
    var Hours = date1.getHours();
    var Minutes = date1.getMinutes();
    var Seconds = date1.getSeconds();
    CurrentDate += Year + "年";
    Month >= 10 ? (CurrentDate += Month + "月"):(CurrentDate += "0" + Month + "月");
    Day >= 10 ? (CurrentDate += Day +"日 "):(CurrentDate += "0" + Day+"日 ");
    Hours>=10 ? (CurrentDate += Hours +"："):(CurrentDate += "0"+Hours +"：");
    Minutes>=10 ? (CurrentDate += Minutes +"："):(CurrentDate += "0"+Minutes +"：");
    Seconds>=10 ? (CurrentDate += Seconds):(CurrentDate += "0"+Seconds);
    return CurrentDate;
}
//在评论处点击登录按钮
$(function(){
    let $btnLogin = $('#btnLogin');
    $btnLogin.on('click',function(){
        window.location.href="../";
    })
});
