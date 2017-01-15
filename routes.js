const admin = require('./controllers/admin');
const user = require('./controllers/user');
const api = require('./controllers/api');
const main = require('./controllers/main');
const methods = require('./controllers/methods');
const config = require('./lib/config');
const cfg = require('./lib/config');
const fs = require('fs');

module.exports = function(app) {
    app.use(require('cookie-parser')(config.cookieSecret));
    //postbody-parser:// parse application/x-www-form-urlencoded 
    app.use(require('body-parser').urlencoded({ extended: false }));
    // create application/json parser 
    // app.use(require('body-parser').json());

    //set start-test router
    app.use((req, res, next) => {
        //res.locals参数可以传递给视图
        res.locals.globalTestPath = (app.get('env') !== 'production' &&
            req.query.test == 1) ? '/test/global.test.js' : undefined;
        res.locals.domainUrl = "http://localhost:3000";
        next();
    });
    //set global cookie
    app.use(user.cookieSet);

    app.use(methods.startTest);
    //公共
    app.get('/', main.home);
    app.get('/article/:id', main.article);
    app.get('/tag1', main.tag1);
    app.get('/tag2', main.tag2);
    app.get('/about', main.about);
    app.get('/search', main.search);

    //登录
    app.get('/signin', user.signIn);
    app.get('/signup', user.signUp);
    app.post('/signin', user.postSignIn);
    app.post('/signup', user.postSignUp);
    app.get('/signout', user.signOut);
    app.get('/user', user.user);

    //文章取添删修
    app.get('/admin', admin.admin);
    app.get('/add', admin.add);
    app.post('/add', admin.postAdd);
    app.get('/update', admin.update);
    app.post('/update', admin.postUpdate);
    app.get('/del', admin.del);


    //API
    app.get('/api', api.zhihu);

    //根据路径直接渲染模板，如无参数处理和传递可不添加相应路由
    const autoView = {};
    app.use((req, res, next) => {
        let path = req.path.toLowerCase();
        //缓存模板
        if (autoView[path]) {
            return res.render(autoView[path]);
        };
        if (fs.existsSync(__dirname + '/views' + path.slice(0, -1) + '.hbs')) {
            autoView[path] = path.replace(/\//g, '');
            return res.render(autoView[path]);
        };
        next();
    })

    //404路由
    app.use((req, res) => {
        res.status(404);
        res.render('404');
    });
    //500路由,根据传入参数来区分400路由
    app.use((err, req, res, next) => {
        err && console.log(err)
        res.status(500);
        res.render('500');
    })

}
