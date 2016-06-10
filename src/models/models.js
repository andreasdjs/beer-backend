'use strict';

var mongoose = require('mongoose');
require('../database');

/*****************************************************/
/** Local store article numbers (id)
/*****************************************************/

var localStoreArticleSchema = new mongoose.Schema({
	ArtikelNr: [],
	_ButikNr: String
}, { versionKey: false }); 

var localStoreArticleModel = mongoose.model('Localstorearticle', localStoreArticleSchema);

/*****************************************************/
/** Matching ids
/*****************************************************/

var matchingBeerSchema = new mongoose.Schema({
	id: String,
	artikelId: []
}, { versionKey: false }); 

var matchingBeerModel = mongoose.model('Matchingbeer', matchingBeerSchema);

/*****************************************************/
/** Mathced Rated beer
/*****************************************************/

var ratedMatchedBeerSchema = new mongoose.Schema({
	id: String,
	name: String,
	brewery: String,
	beerAbv: String,
	rating: String,
	matchingIds: []
}, { versionKey: false }); 

var ratedMatchedBeerModel = mongoose.model('Ratedmatchedbeer', ratedMatchedBeerSchema);

/*****************************************************/
/** Rated beer
/*****************************************************/

/* force collection
var UserInfo = new Schema({
  username : String,
  password : String 
}, { collection: 'userinfo' });
*/

var ratedBeerSchema = new mongoose.Schema({
	id: String,
	name: String,
	brewery: String,
	rating: String
}, { versionKey: false }); 

var ratedBeerModel = mongoose.model('Ratedbeer', ratedBeerSchema);

/*****************************************************/
/** Systembolaget beer
/*****************************************************/

var systembolagetBeerSchema = new mongoose.Schema({
	artikelId: String,
	name: String,
	name2: String,
	brewery: String,
	price: String,
	volumeInMl: String
}, { versionKey: false }); 

var systembolagetBeerModel = mongoose.model('systembolagetbeer', systembolagetBeerSchema);

/*****************************************************/
/** Exports 
/*****************************************************/

module.exports.localStoreArticleModel = localStoreArticleModel;
module.exports.ratedMatchedBeerModel = ratedMatchedBeerModel;
module.exports.matchingBeerModel = matchingBeerModel;
module.exports.ratedBeerModel = ratedBeerModel;
module.exports.systembolagetBeerModel = systembolagetBeerModel;



