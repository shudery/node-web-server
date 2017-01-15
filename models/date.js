const mongoose = require('mongoose');

const dateSchema = mongoose.Schema({
	name: String,
	id: Number,
});

dateSchema.methods.getName = function(){
	return this.name.toUpperCase();
};

const siteDate = mongoose.model('siteDate',dateSchema);

module.exports = siteDate;

