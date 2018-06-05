var express = require('express');

var app = express()
var n = 0;
	
	app.get('/',function(req,res){
		console.log('have a request.'+n)
		res.send('i got you.')
		n++;
	})
	app.listen('8066',()=>{
		console.log('server start.')
	})