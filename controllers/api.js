const models = require('../models/model.js')
const zhihuModel = models.zhihuModel;

module.exports = {

    zhihu(req, res) {
        let num = +req.query.num || 10;

        zhihuModel.find({ $where: models.findRandom(num) }, (err, dbDatas) => {
            err && log(err);
            (!dbDatas || !dbDatas.length) && res.send('no result')
            let obj = {
                size: num,
                src: dbDatas[0].site,
                datas: [],
            };
            dbDatas.forEach((dbData) => {
                let data = {};
                for (let i in dbData) {
                    data.id = dbData.id;
                    data.star = dbData.star;
                    data.author = dbData.author;
                    data.title = dbData.title;
                    data.link = dbData.link;
                    data.publishAt = dbData.publishAt.split(' ')[1];
                    data.createAt = dbData.createAt;
                    // data.content = dbData.content;
                };
                obj.datas.push(data);
            });
            res.json(obj);
        });
    },
}
