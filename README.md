# 项目简介
快速创建一个简洁，健壮的web server，目标是实现网站服务的常用模块，尝试全栈思维开发，提供一套快速构建网站服务的全能脚手架，力求突破快速，低廉，优质只能兼得其二的工程瓶颈。
运用的技术栈：node + express + handlebars + mongDB + mocha
<!--more-->
### 创建服务和基础路由

如同客户端的事件响应，当客户端输入一个url之后，server要如何响应这个事件，在express中可以通过中间件搭建各种路由，在客户端请求地址触发相应路由，返回对应的文件，入口文件app.js如下

```
const app = require('express')();
const port = process.env.port || 3000;
app.listen(port, (err) => {
    err && log('error form app.listen()')
    log(`application start listen at ${port}`)
});
app.get('/', (req, res) => {
    res.type('text/plain')
    res.send('welcome home!');
});
<!-- //404路由 -->
app.use((req, res) => {
    res.status(404);
    res.send('404 not found');
});
<!-- //500路由,根据传入参数来区分404路由 -->
app.use((err, req, res, next) => {
    res.status(500);
    res.send('500 server error');
})
```
最基本的三个路由对应了三种网页请求状态，'/'匹配响应了主页的正常请求。

### 配置模板引擎

创建默认模板目录views，再创建布局模板目录layouts，都是默认参数，目录名照用就行。
添加main.hbs到 `/views/layouts`中，hbs是handlebars的简写，记得给你使用的文本编辑器下载相应模板的插件，不然没有语法提示和补全很难过的，我用的sublime text，直接下载handlebars这个插件即可。

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>home</title>
	<script src='/js/test.js'></script>
</head>
<body>
	{{{body}}}
</body>
</html>
```

其中body会结合路由配置自动读取views下的相应模板来代替这一块内容。
在views下添加主页模板`home.hbs`，404页面模板`404.hbs`，服务器错误页面`500.hbs`，结合`main.hbs`形成一个对应页面的html文件。

在app.js中添加

```
const handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({ defaultLayout: 'main.hbs',extname: '.bhs' }));
app.set('view engine', '.hbs');
```

其中defaultLayout设置了模板的进入地址，默认为main，即上面创建的main.hbs，然后设置文件扩展名缩写为.hbs，然后就可以结合模板来为路由配置返回的文件。

```
app.get('/', (req, res) => {
    res.render('home', { nowTime: new Date() });
})
app.use((req, res) => {
    res.status(404);
    res.render('404');
});
app.use((err, req, res, next) => {
    res.status(500);
    res.render('500');
})
```
使用了render方法来调用模板，传入第一个参数即对应创建的模板文件名，第二个参数为传递对模板的配置对象，模板中通过{{nowTime}}可以获取到这个变量，视图引擎默认返回的文件就是`text/plain`，不用res.type设置，除了200状态码之外，其他状态码依然需要设置。

### 设置静态文件路径
项目目录下创建一个文件夹存放静态文件，这里用public，添加如下代码
```
app.use(express.static(__dirname + '/public'));
```
添加这段代码之后，在模板中引用的静态文件就是以/public为根目录了，比如`<img src="/img/icon.jpg">`对应查找的路径就是`/public/img/icon.jpg`

### 添加测试框架
测试系统对于一个健壮的web项目的支撑作用十分重要，提前写好测试可以大幅降低后期维护的成本。本项目使用Mocha框架和chai断言库进行测试，将这两个文件统一放到`public/vendor`中，将测试用例统一放在`public/test`目录下，在test目录中添加一个全部页面都运行的测试global.js
```
suite('Global Tests',()=>{
    test('page have a valid title:'+document.title,()=>{
        assert(document.title && document.title.toUpperCase() !== 'TODO')
    })
})
```
添加一个about页面单独运行的测试about.js
```
suite('About Page Test',()=>{
    test('contain a tag',()=>{
        assert(document.getElementsByTagName('a').length)
    })
})
```

在app.js文件中添加开启测试的方式，这里用查询参数`?test=1`来开启
```
app.use((req,res,next)=>{
    <!-- //res.locals可以传递给视图模板 -->
    res.locals.startTests = (app.get('env')!== 'production' && req.query.test === 1);
    next();
});
```
将主要逻辑放在公用模板main.hbs中
```
<link rel='stylesheet' href='/vendor/mocha.css'>
<script src='/vendor/mocha.js'></script>
<script src='/vendor/chai.js'></script>
{{#if startTests}}
    <div id="mocha"></div>
    <script>
    console.log('startTests')
    mocha.ui('tdd');
    var assert = chai.assert;
    </script>
    <script src='/test/global.js'></script>
    {{#if pageTestPath}}
        <script src='{{pageTestPath}}'></script>
    {{/if}}
    <script>mocha.run()</script>
{{/if}}
```
启动服务，访问`localhost:3000/about?test=1`，查看测试结果
![](https://raw.githubusercontent.com/shudery/shudery.github.io/master/pic/3.jpg)

在test目录下继续添加逻辑功能的单元测试unit.js，区别于页面测试，逻辑测试使用describe/it/expect来描述，结构如下
```
var mocha = require('mocha')
var expect = require('chai').expect
var log = require('../lib/daguo').log
describe('Unit Tests',()=>{
    it('log modules',()=>{
        expect(typeof log('test') === 'string')
    })
})
```

**TIPS:**
- 使用nodemon自动重启server服务，结合webpack，gulp等构建工具可以热加载刷新浏览器页面，进一步实现自动化
- 一些需要浏览器操作的测试可以通过zombie，phantomJS等框架来实现
- 在[https://travis-ci.org](https://travis-ci.org)给项目添加自动集成测试，每一次提交代码会自动运行测试代码
- express-handlebars这个模板在partials路径这里有问题，一直提示找不到对应部分的模板，换成express-hbs可解决，并且不用再配置hbs的简写后缀了

### 添加cookie
网站门户少不了需要添加用户配置，可以针对性地提供一些服务，而cookie是用户身份的凭证，为使用无状态HTTP协议的浏览器提供了识别用户的能力，接下来给网站添加登录模块的功能。
```
//set cookie-parser
app.use(require('cookie-parser')(credentials.cookieSecret));
//postbody-parser
app.use(require('body-parser').urlencoded({ extended: false }));
app.get('/login', (req, res) => {
    if (req.cookies.daguoCookie === 'string123') {
        // res.render('user', { cookie: req.cookies.daguoCookie })
        res.redirect(303, '/user')
    } else {
        res.render('login')
    }
})
app.post('/process', (req, res) => {
    if (req.xhr || req.accepts('json,html') === 'json') {
        log(req.xhr)
        res.send('process receive a xhr or json accepts')
    }
    if (req.body.user === 'user' && req.body.password === '123') {
        res.cookie('daguoCookie', 'string123')
        res.redirect(303, '/user')
            // res.render('user', { user: req.body.user, password: req.body.password })
    } else {
        res.render('error', { message: 'user name or password is error' })
    }
})
app.get('/user', (req, res) => {
    res.render('user')
})
```
添加credentials.js存储证书文件
需要添加两个功能中间件，`body-parser`和`cookie-parser`，分别用来解析request请求中的表单body和之前服务器返回的cookie，第一次登录输入硬编码的用户名和密码，下一次再登录login界面将直接跳转到user路由，渲染user页面。
login页面主要是一个登录表单:
```
<form action="/process?from=login" method="POST">
    <label for="user">user: <input type="text" name="user"></label>
    <label for="password">password: <input type="password" name="password"></label>
    <input type="submit" value="submit">
</form>
```
反复调试可以通过设置cookie的maxAge为一个较短的时间，或者用chrome工具删除cookie，也可以直接通过JS将document.cookie设置为`'{cookiename}=0'`的形式来清除cookie

### 开发前端界面
完成了一些后台逻辑之后我们需要对网站的展示部分进行设计和开发，可以结合网上流行的各种前端展示框架，比如Bootstrap，semanticUI，material-UI，等等进行开发，这些框架给我们提供了网页常用的各种组件，包括导航条，图标，按钮，表单的样式都已经有一套统一的设计，如果希望网站的展示效果区别于普通的网站，那就避免用Boostrap，因为它实在是太流行了，github上10W+的star是其他前端框架的好几倍，不是它不好，只是用久了难免有一些审美疲劳。

我在这套网站构建系统中使用的是semanticUI，它同样提供了丰富的前端组件，其次它的设计风格似乎要更有美感一些，但是它整包的体积太大了，从开发到生产要自行Build出相关样式的文件才划算。此外semanticUI的API风格是短类型名+多类型的组合，粒度更小，自由度比较高，举个栗子就是将btn-info-right的展示效果分割成三个类btn，info和right，这样可能会导致一些命名冲突的问题，但在小型项目中就不予考虑了。

由于页面设计能力有限，所以暂时先临摹一下medium网站的展示效果:
![](https://raw.githubusercontent.com/shudery/shudery.github.io/master/pic/1.jpg)
模仿效果，具体可以看github的代码:
![](https://raw.githubusercontent.com/shudery/shudery.github.io/master/pic/2.jpg)

### 邮件系统
使用nodemailer模块构建web应用的邮件server非常方便，在lib下新建mailer.js
```
const nodemailer = require('nodemailer');
module.exports = function(credentials) {
    let mailTransport = nodemailer.createTransport('smtps://' + credentials.gmail.user + '%40gmail.com:' + credentials.gmail.password + '@smtp.gmail.com');
    let from = 'node-web-server-mailer<shudery@gamil.com>';
    let masterEmail = '125153450@qq.com'
    return {
        send(subject, html, to) {
            mailTransport.sendMail({
                to: to ? to : masterEmail,
                from,
                subject,
                html,
            }, (err, info) => {
                if (err) {
                    return console.log('send email error:' + err);
                };
                console.log('send email info:' + info.response);
            });
        },
        errorSend(message, filename, exception) {
            let html = `<h1>site error:</h1>message:${message}<br>`;
            if (filename) {
                html += `filename:${filename}<br>`;
            }
            if (exception) {
                html += `exception;${exception}`;
            }
            mailTransport.sendMail({
                from,
                to: masterEmail,
                subject: 'site error',
                html,
            })
        },
    }
}
```

## 未完待续……
