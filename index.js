// variables
var express = require('express');
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var mongoDriver = require('./config/database').driver;

var app = express();

app.use(morgan('dev'))
	.use(express.static('public'))
	.use(cookieParser()) // read cookies (needed for auth)
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }));

// start server
var server = app.listen(port, function() {
	console.log('Sever running at localhost:' + port);
	//initDB();
});

// routes
require('./routes/api')(app);


function initDB(){
	var db = mongoose.connect(mongoDriver);
}

