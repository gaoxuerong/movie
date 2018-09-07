# movie
（思沃影院）
## 如何使用
1.首先初次下载完需要安装依赖：
```
  npm install
```
2.然后将文件夹db中的json文件导入自己电脑中的mongodb数据库：
```
2.1启动数据库，开启服务
2.2然后打开cmd切换到bin下输入命令mongoimport --db twmovie --collection users --file F:\expressdemo\movie\db\users.json --type=json
当users导入成功后，接着输入mongoimport --db twmovie --collection contents --file F:\expressdemo\movie\db\contents.json --type=json导入contents
接着输入mongoimport --db twmovie --collection categories --file F:\expressdemo\movie\db\categories.json --type=json导入categories
[其中twmovie是数据库的名字; users、categories、contents是Collection的名字;F:\expressdemo\movie\db\categories.json是json文件所在的目录]
```
3.启动项目
```
npm start或者在bin目录下运行www来启动
```
4.访问
```
浏览器输入localhost:3000
```
5.提示
```
注册的只是非管理员;用户名不支持中文;管理员信息是"用户名:gxr;密码:123"
```
