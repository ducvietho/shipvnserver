// Require dependencies
var express = require('express');
var mongoose = require('mongoose');

// Create server
var app = express();
var port = process.env.PORT||3000;
app.listen(port, function(){
    console.log('Connect success');
});

var Feed = require('./api/models/Feed');

// Connect database
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Shipvn');
mongoose.connect('mongodb://shipvn:shipvn123456789@ds133192.mlab.com:33192/shipvn');

// Route
var routes = require('./api/routes/FeedRoutes');
routes(app);

