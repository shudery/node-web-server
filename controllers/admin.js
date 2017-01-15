const _ = require('../lib/daguo');
const log = _.log;
const colors = require('colors')
const models = require('../models/model');

const mpostModel = models.mpostModel;
const postModel = models.postModel;

module.exports = {
    add(req, res) {
        res.render('add')
    },
    postAdd(req, res) {
        let body = req.body;
        let newData = {
            author: body.author,
            title: body.title,
            content: body.content,
            site: body.site,
            tags: body.tags,
        };
        newData.createAt = Date.now();
        mpostModel.create(newData, (err) => {
            err && log(err);
            res.redirect(303, 'admin')
        });
    },
    del(req, res) {
        let _id = req.query.id;
        !_id && res.send('ID is empty');
        mpostModel.remove({ _id }, (err) => {
            err && log(err.yellow);
            res.redirect(303, '/admin')
        })
    },
    //修改页面
    update(req, res) {
        let _id = req.query.id;
        mpostModel.find({ _id }, (err, datas) => {
            res.render('update', { datas });
        })
    },
    //处理修改的POST请求
    postUpdate(req, res) {
        let body = req.body;
        let newData = {
            author: body.author,
            title: body.title,
            content: body.content,
            site: body.site,
            tags: body.tags,
        };
        newData.createAt = Date.now();
        newData.date = new Date().toISOString().split('T')[0];
        mpostModel.update({ _id: body._id }, newData, (err) => {
            err && log(err);
            res.redirect(303, 'admin')
        });
    },
    admin(req, res) {
        mpostModel.find({}, null, { sort: { datelabel: -1 } }, (err, dbDatas) => {
            err && log(err);

            //考虑后期数据结构的变化，重新封装传递给模板的数据对象，解耦模板和数据层。
            let datas = [];
            dbDatas.forEach((dbData) => {
                let data = {};
                for (let i in dbData) {
                    data.author = dbData.author;
                    data.site = dbData.site;
                    data.title = dbData.title;
                    data.createAt = dbData.createAt;
                    data.id = dbData._id;
                };
                datas.push(data);
            });
            res.render('admin', { datas })
        });
    },
}
