const express = require('express');
const colors = require('colors');
const daguo = require('./lib/daguo.js');
const hbsHelpers = require('./lib/hbsHelpers.js');
const config = require('./lib/config');
const routes = require('./routes');
    log = daguo.log;
//inject module
const app = express();

// require('./lib/mailer.js')();
// mlab的数据库服务非常慢
const mongoose = require('mongoose');
const db = (process.env.NODE_ENV === 'production') ? config.mongo.proConString : config.mongo.devConString;
mongoose.connect(db);

//set template engine
var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layouts/main',
}));
//set template's helper 
hbs.registerHelper('static', (name) => hbsHelpers.static(name));
hbs.registerHelper('toDateLabel', (name) => hbsHelpers.toDateLabel(name));

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
// app.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

routes(app);

//listen to port
const port = app.get('port') || 3000;
app.listen(port, (err) => {
    err && log('error form app.listen()')
    log(`application start listen at http://localhost:${port}\nexpress start in ${app.get('env')}`.blue)
});

