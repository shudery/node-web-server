//登录模块
const _ = require('../lib/daguo');
const log = _.log;
const colors = require('colors')
const md5 = require('md5');
const config = require('../lib/config');
const models = require('../models/model');
const userModel = models.userModel;

module.exports = {
    //请求一旦挂上正确的cookie，模板全局都能获得。
    cookieSet(req, res, next) {
        userModel.findOne({ username: req.cookies.user, password: req.cookies.pwd }, (err, data) => {
            if (data) {
                res.locals.cookie = req.cookies.user;
            }
            next();
        });
    },

    signIn(req, res) {
        userModel.findOne({ username: req.cookies.user, password: req.cookies.pwd }, (err, data) => {
            if (data) {
                res.redirect(303, '/user');
            } else {
                //如果是sign up成功后跳转过来的，添加提示
                if (req.headers.referer === res.locals.domainUrl + '/signup') {
                    res.render('signin', { info: 'sign up success, now you can sign in!' })
                } else {
                    res.render('signin');
                }

            }
        });
    },

    signUp(req, res) {
        //已经有cookie了就不给注册。
        req.cookies.user && res.redirect(303, '/user');
        res.render('signup');
    },

    postSignIn(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        //DB找得到给请求挂上cookie，找不到给提示。
        userModel.findOne({ username, password: md5(password) }, (err, data) => {
            err && log(err);
            if (data) {
                res.cookie('user', username);
                res.cookie('pwd', md5(password));
                res.redirect(303, '/user');
            } else {
                res.render('signin', { error: 'username or password is error' });
            }
        });
    },

    postSignUp(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        //注册名不重复则存储数据并跳转到登录页。
        userModel.findOne({ username }, (err, data) => {
            err && log(err);
            //null or [];
            if (data) {
                res.render('signup', { error: 'username already exist!' });
            } else {
                var data = {
                    username: username,
                    password: md5(password),
                };
                userModel.create(data, (err) => {
                    err && log(err);
                    res.redirect(303, '/signin');
                });
            }
        });
    },
    //登出清空cookie
    signOut(req, res) {
        res.cookie('user', '');
        res.cookie('pwd', '');
        res.redirect(303, '/signin');
    },

    // process(req, res) {
    //     if (req.xhr || req.accepts('json,html') === 'json') {
    //         log(req.xhr);
    //         res.send('process receive a xhr or json accepts');
    //     }
    // },

    user(req, res) {
        //找不到数据跳的登录页
        userModel.findOne({ username: req.cookies.user, password: req.cookies.pwd }, (err, data) => {
            if (data) {
                res.render('user', data)
            } else {
                res.redirect(303, '/signin');
            }
        });
    },
}
