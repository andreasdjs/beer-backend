'use strict';

var express = require('express');
var parser = require('body-parser');
var router = require('./api');
var router = require('./api');
var modules = require('./modules/modules'); // get functions


var app = express();

require('./database');

app.use('/', express.static('public'));
app.use(parser.json());

/* */

modules.initialWriteBeers();

modules.initialWriteRatedBeers();

modules.initialWriteMatches();

modules.initialWriteLocalStore();

modules.initialWriteLocalArticleStore();

/*
modules.readRatedBeer(pushContent);

function pushContent(obj){
	var myBeer = { "myBeer" : obj };
}

*/


app.use('/api', router);

app.listen(3000, function() {
    console.log("The server is running on port 3000!");
});