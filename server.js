// Require dependencies
var express = require('express');
var mongoose = require('mongoose');

// Create server
var app = express();
var port = 3000;
app.listen(port, function(){
    console.log('Connect success');
});

var Feed = require('./api/models/Feed');

// Connect database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Shipvn');

// Route
var routes = require('./api/routes/FeedRoutes');
routes(app);

