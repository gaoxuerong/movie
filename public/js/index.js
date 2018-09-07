$(function(){
    let $loginBox = $('#loginBox');
    let $registerBox = $('#registerBox');

    let  $loginoutBtn = $('#loginoutBtn');
    let  $username = $('.username');
    let  $password = $('.password');
    let  $repassword = $('.repassword');
    //切换到注册面板
    $loginBox.find('a').on('click',function(){
        $loginBox.hide();
        $registerBox.show();
    });
    //切换到登陆面板
    $registerBox.find('a').on('click',function(){
        $loginBox.show();
        $registerBox.hide();
    });
    //注册
    $registerBox.find('button').on('click',function(){
        if($.trim($username.val())===''){
            $registerBox.find('#register_bottom').html(`用户名不能为空`);
            $registerBox.find('.username').val(``);
            $registerBox.find('.password').val(``);
            $registerBox.find('.repassword').val(``);
        }else if($.trim($password.val())===''){
            $registerBox.find('#register_bottom').html(`密码不能为空`);
            $registerBox.find('.username').val(``);
            $registerBox.find('.password').val(``);
            $registerBox.find('.repassword').val(``);
        }else if($password.val()!=$repassword.val()){
            $registerBox.find('#register_bottom').html(`两次密码不一致`);
            $registerBox.find('.username').val(``);
            $registerBox.find('.password').val(``);
            $registerBox.find('.repassword').val(``);
        }else{
            $.ajax({
            type:'post',
            url:'api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                $registerBox.find('#register_bottom').html(result.message);
                //注册成功
                if(!result.code){
                    //注册成功
                    window.location.reload();

                }
            }
        })
        }

    })
    //登陆
    $loginBox.find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val(),
            },
            dataType:'json',
            success:function(result){
                $loginBox.find('#login_bottom').html(result.message);

                //注册成功
                if(!result.code){
                    //登录成功
                    window.location.reload();

                }
            }
        })
    });
    //登出
    $loginoutBtn.on('click',function(){
        $.ajax({
            type:'post',
            url:'api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
})