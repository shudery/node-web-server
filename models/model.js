const honey = require('./honey');
const user = require('./user');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const mpostModel = mongoose.model('server', new mongoose.Schema(honey));
const postModel = mongoose.model('posts', new mongoose.Schema(honey));
const zhihuModel = mongoose.model('zhihubest999', new mongoose.Schema(honey));
const userModel = mongoose.model('user', new mongoose.Schema(user));

function findRandom(num,count) {
    let arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(Math.floor(Math.random() * count));
    }
    return '[' + arr + '].indexOf(this.id) !== -1';
};
module.exports = {
	mongoose,
	postModel,
	mpostModel,
	zhihuModel,
	userModel,
	findRandom,
}