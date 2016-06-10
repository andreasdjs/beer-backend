'use strict';

var mongoose = require('mongoose');

//var url = "mongodb://localhost/newanimalsDB";
var url = "mongodb://localhost/newskills";

//mongoose.connect('mongodb://localhost/newanimalsDB', function(err) {
mongoose.connect(url, function(err) {
  if (err) {
    console.log('Failed connecting to MongoDB!');
  } else {
    console.log('Successfully connected to MongoDB at: ' + url);
  }
});

