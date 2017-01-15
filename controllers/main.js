const _ = require('../lib/daguo');
const log = _.log;
const colors = require('colors')
const models = require('../models/model');
const hbsHelpers = require('../lib/hbsHelpers');
const superagent = require('superagent');

const mpostModel = models.mpostModel;
const postModel = models.postModel;
const zhihuModel = models.zhihuModel;


module.exports = {
    search(req, res) {
        res.locals.search = req.query.search;
        res.redirect(303, 'home');
    },
    article(req, res) {
        let _id = req.params.id;
        !_id && res.send('ID is empty!');
        zhihuModel.findOne({ _id }, (err, dbData) => {
            err && log(err);
            let data = {};
            if (dbData) {
                //知乎403解决方案：https://images.weserv.nl/?url=pic{{}}
                data.content = dbData.content.replace(/<noscript>.*?<\/noscript>/gi, '').replace(/<img[\s\S]*?data-actualsrc="https:\/\/pic([\s\S]*?)">/gi, '<img src="https://images.weserv.nl/?url=pic$1">');
                data.title = dbData.title.split(' - ')[0];
                data.link = dbData.link;
                data.author = dbData.author || '佚名';
                data.site = dbData.site;
                data.createAt = dbData.publishAt.split(' ')[1];
            } else {
                data.content = 'dbData is false';
            }

            res.render('article', { data });
        })
    },

    home(req, res) {
        zhihuModel.count((err, count) => {
            err && log(err);
            let condition = res.locals.search ? { title: res.locals.search } : {
                $where: models.findRandom(10, count)
            }
            zhihuModel.find(condition, (err, dbDatas) => {
                // postModel.find({}, null, { sort: { createAt: -1 }, limit: 5 }, (err, dbDatas) => {
                err && log(err);
                let datas = [];
                dbDatas.forEach((dbData) => {
                    let data = {};
                    for (let i in dbData) {
                        data.author = dbData.author || '佚名';
                        data.site = dbData.site;
                        data.title = dbData.title.split(' - ')[0] + (/<img.*?>/.test(dbData.content)?'':'<无图>');
                        data.content = dbData.content;
                        data.createAt = dbData.publishAt.split(' ')[1];
                        data.id = dbData._id;
                        data.rank = dbData.id;
                        data.star = dbData.star;
                        // if (/<img.*?>/.test(dbData.content))
                        // 	data.img = "<img src=÷'https://images.weserv.nl/?url=pic" + dbData.content.match(/<img.*?data-actualsrc="https:\/\/pic(.*?)".*?>/)[1] + "' style='width:520px;height:200px;'";
                    };
                    datas.push(data);
                });
                res.render('home', { datas, count: 0, pageTitle: 'DiDiBugBug' })
            });
        })
    },
    about(req, res) {
        //传入测试文件路径
        res.render('about', { pageTestPath: hbsHelpers.static('/test/about.test.js') });
    },
    tag2(req, res) {
        postModel.find({ site: 'xitu' }, null, { sort: { datelabel: -1 }, limit: 5 }, (err, dbDatas) => {
            err && log(err);
            let datas = [];
            dbDatas.forEach((dbData) => {
                let data = {};
                for (let i in dbData) {
                    data.author = dbData.author;
                    data.site = dbData.site;
                    data.title = dbData.title;
                    data.content = dbData.content;
                    data.createAt = dbData.createAt;
                    data.id = dbData._id;
                };
                datas.push(data);
            });
            res.render('home', { datas, count: 1 })
        });
    },
    tag1(req, res) {
        postModel.find({ site: 'segmentfault' }, null, { sort: { datelabel: -1 }, limit: 5 }, (err, dbDatas) => {
            err && log(err);
            let datas = [];
            dbDatas.forEach((dbData) => {
                let data = {};
                for (let i in dbData) {
                    data.author = dbData.author;
                    data.site = dbData.site;
                    data.title = dbData.title;
                    data.content = dbData.content;
                    data.createAt = dbData.createAt;
                    data.id = dbData._id;
                };
                datas.push(data);
            });
            res.render('home', { datas, count: 0 })
        });
    },

}
