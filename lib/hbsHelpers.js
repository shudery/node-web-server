const baseUrl = '';

module.exports = {
    static(name){
        return baseUrl + name;
    },
    toDateLabel(date){
    	if(typeof date !== 'number' || typeof Number(date)!== 'number'){
    		return date;
    	}
    	return  new Date(Number(date));
    	// return label[0] + ' ' + label[1].slice(0,5);
    },
};
