const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const _DB =require('./db');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

app.set('port', process.env.PORT || 3000);

app.use('/data', require('./controllers/data_plain'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/graph.html');
});
app.get('/qt', function (req, res) {
  res.sendFile(__dirname + '/qt.html');
});
app.get('/sales-focust', function (req, res) {
  res.sendFile(__dirname + '/sf.html');
});
if(!module.parent){
	app.listen(app.get('port'));
	console.log("server listening on port " + app.get('port'));
}
