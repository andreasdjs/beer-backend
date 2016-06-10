'use strict';

var express = require('express');
var users  = require('../models/models');
var router = express.Router();
var modules = require('../modules/modules');
var fs = require('fs');

/*****************************************************/
/* ...
/*****************************************************/

function insertMatches () {

	users.ratedBeerModel.find().lean().exec({}, function(err, data) {

		if (err) {
			console.log(err.message);
		}
		/* Sort */
//		data.sort(sortFloatNumber);
//		data.reverse();
//		data = data.slice(0,200); // limit
//		console.log(data);
//		res.json({ matchingBeer : data });
	var ratedBeer = data;
	//console.log(ratedBeer);
	ratedBeer.map((el) => {
		delete el._id;
	});

	users.matchingBeerModel.find().lean().exec({}, function(err, data) {

//	users.matchingBeerModel.find({}, function(err, data) {
		if (err) {
			console.log(err.message);
		}
		var matchingIds = data;
//		console.log(ratedBeer);
//		console.log(matchingIds);
			matchingIds.forEach( (el) => {
				if (el.artikelId.length !== 0) {
	//				console.log(el.id);
	//				console.log(el.artikelId);
					el.artikelId.forEach( (artikelid) => {
	//					console.log(artikelid);
						ratedBeer.map( (rel) => {
	//						console.log(el.id);
							if (el.id == rel.id) {
								rel.matchingIds.push(artikelid);
							}
							delete rel._id;
						});
					});
				}
				delete el._id;
			});

			var write = JSON.stringify(ratedBeer);
	//  	var write = JSON.stringify(beerAssortment);

		    fs.writeFile('./data/ratedBeerMatched.txt', write, (err) => {
		      if (err) throw err;
		      console.log('Rated beer including matching written.');
		    })

		}); 
	}); 
};

insertMatches();


/*****************************************************/
/* CORS - cross origin access control middlesware
/*****************************************************/

router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


/*****************************************************/
/* Sort rating function reversed
/*****************************************************/

function sortFloatNumber(a,b) {
    return parseFloat(b.rating) - parseFloat(a.rating);
}

/*****************************************************/
/** Get available beer
/*****************************************************/


router.get('/availableBeer', function(req, res) {
	console.log("Requesting Systembolaget beer.");

	users.systembolagetBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		var sBeer = data;

		users.ratedMatchedBeerModel.find({}, function(err, data) {
			if (err) {
				return res.status(500).json({ message: err.message });
			}

			/* Matching  */

			var outData = modules.matchBeer(sBeer, data);

	//		data = data.slice(0,100); // limit to 100
			res.json({ availableBeer : outData });
		}); 

	}); 
});


/*****************************************************/
/** Get Matching beer from Systembolaget
/*****************************************************/


router.get('/systembolagetMatchedBeer', function(req, res) {
	console.log("Requesting matching beer.");

	users.ratedMatchedBeerModel.find().lean().exec({}, function(err, data) {
//	users.ratedMatchedBeerModel.find({}, function(err, data) {
//	users.ratedMatchedBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}

		/* Sort */
		data.sort(sortFloatNumber);

//		console.log(data);

		var hata = data.filter( (el) => {
//			console.log(el.matchingIds.length);
			if (el.matchingIds.length !== 0) {
//				console.log("mjau");
				return el;
			}
		});

//		hata = hata.slice(0,2); // limit

		console.log(hata.length);
		console.log(hata);

		res.json({ systembolagetMatchedBeer : hata });
	}); 
});


/*****************************************************/
/** Get local store articles
/*****************************************************/

router.get('/localStoreBeer', function(req, res) {
	console.log("Requesting local store beer.");

	users.localStoreArticleModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		res.json({ localStoreBeer : data });
	}); 
});

/*****************************************************/
/** Get Rated Matched Beer available in Local Store
/*****************************************************/

router.get('/ratedMatchedBeerLocalStore', function(req, res) {

	console.log("Requesting rated matched beer available in local store.");

	users.ratedMatchedBeerModel.find().lean().exec({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
//		data.sort(sortFloatNumber);
//		data.reverse();
//		data = data.slice(0,200); // limit
//		res.json({ ratedMatchedBeer : data });
		var ratedMatchedBeer = data;

		users.localStoreArticleModel.find().lean().exec({}, function(err, data) {
			if (err) {
				return res.status(500).json({ message: err.message });
			}
			var localStoreBeer = { "localStoreBeer" : data };

			console.log(data);
			var articles = data.map( (el) => {
				return el.ArtikelNr;
			});
			var articles = articles[0];
//			console.log(articles);

			var locals = ratedMatchedBeer.map( (lel) => {
				if(lel.matchingIds.length > 0) {
//					console.log(lel.matchingIds);
					lel.matchingIds.forEach( (id) => {
						console.log(id);
						articles.forEach( (findmatch) => {
							if (findmatch == id) {
								console.log("match!");
							}
						});
					});
				}
			});

			res.json({ localStoreBeer : data });
		}); 
	}); 
});


/*****************************************************/
/** Get Matching beer
/*****************************************************/

router.get('/ratedMatchedBeer', function(req, res) {
	console.log("Requesting matching beer.");

	users.ratedMatchedBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		/* Sort */
//		data.sort(sortFloatNumber);
//		data.reverse();
//		data = data.slice(0,200); // limit
		res.json({ ratedMatchedBeer : data });
	}); 
});



/*****************************************************/
/** Get Matching beer
/*****************************************************/

router.get('/matchingBeer', function(req, res) {
	console.log("Requesting matching beer.");

	users.matchingBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		/* Sort */
//		data.sort(sortFloatNumber);
//		data.reverse();
//		data = data.slice(0,200); // limit
		res.json({ matchingBeer : data });
	}); 
});


/*****************************************************/
/** Get systembolaget beer
/*****************************************************/

router.get('/systembolagetBeer', function(req, res) {
	console.log("Requesting Systembolaget beer.");

	users.systembolagetBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		/* Sort */
//		data.sort(sortFloatNumber);
//		data.reverse();
//		data = data.slice(0,200); // limit
		res.json({ systembolagetBeer : data });
	}); 
});

/*****************************************************/
/** Get rated beer
/*****************************************************/

router.get('/ratedBeer', function(req, res) {
	console.log("Requesting rated beer.");

	users.ratedBeerModel.find({}, function(err, data) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		/* Sort */
		data.sort(sortFloatNumber);
		/* Only above 3 */
		var data = data.filter( (el) => {
			if (parseFloat(el.rating) > 2.5) {
				return el;
			}
		});
		console.log(data.length);
//		data.reverse();
//		data = data.slice(0,100); // limit to 100
		res.json({ ratedBeer : data });
	}); 
});

module.exports = router;

