'use strict';

var fs = require('fs');


/*****************************************************/
/* Sort rating function
/*****************************************************/

function sortFloatNumber(a,b) {
    return parseFloat(b.rating) - parseFloat(a.rating);
}


/*****************************************************/
/* Likely matches
/*****************************************************/


function matchBeer(sBeer, uBeer) {

	var beerMatches = [];

	uBeer.forEach( (el) => {
		sBeer.forEach ( (sel) => {
			if (
				el.name.toUpperCase() === sel.name.toUpperCase() ||
				el.name.toUpperCase() === sel.name2.toUpperCase() && el.brewery.toUpperCase() === sel.name.toUpperCase() ||
				el.name.toUpperCase() === sel.name.toUpperCase() + sel.name2.toUpperCase()
				) {
				if (sel.name2 !== "") {
//					console.log(sel.name2);
					if (sel.name2 === "Pale Ale") {
						console.log(el.name);
						console.log(sel.name);
						console.log(sel.name2);
						console.log(sel.brewery);
						console.log(el.brewery);
					}
				}

//				if (parseInt(el.rating) > 2.5) {
					beerMatches.push({ 
						"artikelId" : sel.artikelId,
						"name1" : sel.name,
						"name2" : sel.name2,
						"id" : el.id,
						"name" : el.name,
						"brewery" : el.brewery,
						"sbrewery" : sel.brewery,
						"rating" : el.rating,
						"price" : sel.price,
						"volumeInMl" : sel.volumeInMl
					});
//				}
			}
		});
	});

	console.log("Number of available beer: " + beerMatches.length);

	beerMatches.sort(sortFloatNumber);

	return beerMatches;

}


function initialWriteBeers() {
  var fileReadStream = fs.createReadStream('./data/assortment.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	var obj = JSON.parse(data);

  	/* Filter out everything except beer */
	var beerOnly = obj.artiklar.artikel.filter( (filterObj) => {
		return filterObj.Varugrupp === "Öl"
	})

	var beerAssortment = { "systembolaget" : { "beer": beerOnly }};

	/* Show beer count */
	console.log("Systembolaget beers: " + beerAssortment.systembolaget.beer.length);


	var newCleanObj = [];

	beerAssortment.systembolaget.beer.forEach((el) => {

		var newVolume = Math.floor(parseFloat(el.Volymiml)).toString();
	/*	var liter = (Math.floor(parseFloat(el.Volymiml)) ) / 1000;
		liter.toString;*/

		newCleanObj.push({
			"artikelId" : el.nr,
//			"artikelId" : el.Artikelid,
			"name" : el.Namn,
			"name2" : el.Namn2,
			"brewery" : el.Producent,
			"price" : el.Prisinklmoms,
			"volumeInMl" : newVolume
		});

//		console.log(newVolume);
//		console.log(el.Volymiml);
//		console.log(el.brewery_name);
//		console.log(el.beer_name);
//		console.log(el.rating_score);
	});


	var beerAssortment = { "systembolaget" : { "beer": newCleanObj }};

  	var write = JSON.stringify(newCleanObj);
//  	var write = JSON.stringify(beerAssortment);

    fs.writeFile('./data/beerClean.txt', write, (err) => {
      if (err) throw err;
      console.log('Systembolaget beers written.');
    })

  })
}



function readRatedBeer(callback) {
  var fileReadStream = fs.createReadStream('./data/ratedBeer.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {

  		  // console.log(data);

      var obj = JSON.parse(data);
      callback(obj); // Send object back
  });
}


function initialWriteRatedBeers() {
  var fileReadStream = fs.createReadStream('./data/ratedBeer.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	var obj = JSON.parse(data);

	var ratedBeerClean = { "ratedBeer" : { "beer": obj }}

	
	/* Beer count */

	console.log("Rated Beer: " + ratedBeerClean.ratedBeer.beer.length);

	/* Remove objects without score */

	var filteredObj = ratedBeerClean.ratedBeer.beer.filter( (el) => {
	    return el.rating_score !== "";
	});

	var ratedBeerClean = { "ratedBeer" : { "beer": filteredObj }}

	console.log("Rated Beer (empty ratings filtered out): " + ratedBeerClean.ratedBeer.beer.length);

	/* Sort */

	ratedBeerClean.ratedBeer.beer.sort(function(a, b) {
	    return parseFloat(a.rating_score) - parseFloat(b.rating_score);
	});

	/* Reverse order (high -> low) */

	ratedBeerClean.ratedBeer.beer.reverse(); 

//	console.log(ratedBeerClean.ratedBeer.beer);

	/* Make cleaner new object */

	var newCleanObj = [];

	ratedBeerClean.ratedBeer.beer.forEach((el) => {

//		console.log(el.beer_url);

	// remove URL and get "hidden" id
	var beerId = el.beer_url.replace("https:\/\/untappd.com\/beer\/", "");

//	console.log(beerId);

		newCleanObj.push({
			"id" : beerId,
			"beerAbv" : el.beer_abv,
			"name" : el.beer_name,
			"brewery" : el.brewery_name,
			"rating" : el.rating_score,
			"matchingIds" : []
		});

	});



/* 
	Duplicate ratings of beer was found, to remove duplicates:
	http://stackoverflow.com/questions/12551635/jquery-remove-duplicates-from-an-array-of-strings
*/
/*
var thelist=["ball_1","ball_13","ball_23","ball_1"], 
    thelistunique = thelist.filter(
                 function(a){if (!this[a]) {this[a] = 1; return a;}},
                 {}
                );
*/
//=> thelistunique = ["ball_1", "ball_13", "ball_23"]
// console.log(thelistunique);

	var newUniqueObj = newCleanObj.filter(
         function(a){if (!this[a.id]) {this[a.id] = 1; return a;}},
         {}
		); 

	console.log("Unique rated beer: " + newUniqueObj.length);


/***********************************************/
/* Run write of empty matches.txt once         */
/***********************************************/

/*
	var idArr = newUniqueObj.map( (el => {
		return { "id" : el.id, "artikelId" : [] };
	}));

  	var writeId = JSON.stringify(idArr);

  	console.log(idArr);

    fs.writeFile('./data/matches.txt', writeId, (err) => {
      if (err) throw err;
      console.log('Id list written.');
    });
*/

/***********************************************/

	//  console.log(newCleanObj);

	var ratedBeerClean = { "ratedBeer" : { "beer": newUniqueObj }}

//  	var write = JSON.stringify(ratedBeerClean);
  	var write = JSON.stringify(newUniqueObj);

    fs.writeFile('./data/ratedBeerClean.txt', write, (err) => {
      if (err) throw err;
      console.log('Rated beers written.');
    });
  });
}



function initialWriteMatches() {
  var fileReadStream = fs.createReadStream('./data/matches.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	var obj = JSON.parse(data);
//  	console.log(data);

/* Flatten ids using spread*/

		var newBeerMatch = obj.map(beer => {
		    return beer.artikelId;
		});

		var newBeerMatchMerged = [].concat(...newBeerMatch);
//		console.log(newBeerMatchMerged);

/* End flatten ids */

//	var matchingIdsObj = [];

	var matchingIdsObj = newBeerMatchMerged.map( (el) => {
		return { "sId" : el };
	});
//	console.log(matchingIdsObj);

  	var write = JSON.stringify(matchingIdsObj);
//  	var write = JSON.stringify(newBeerMatchMerged);

    fs.writeFile('./data/matchingIds.txt', write, (err) => {
      if (err) throw err;
      console.log('Matching ids written.');
    }) 

  });

}

function initialWriteLocalStore() {
  var fileReadStream = fs.createReadStream('./data/store.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	var store = JSON.parse(data);

	// Karl Johansgatan: "Nr": "1415",
	// console.log(store.ButikOmbud);

	var localStore = store.filter((obj) => {
  		return obj.Nr === "1415";
	});

//	console.log(localStore);

  	var write = JSON.stringify(localStore);

    fs.writeFile('./data/storeLocal.txt', write, (err) => {
      if (err) throw err;
      console.log('Systembolaget local store written.');
    });
  });
}


function initialWriteLocalArticleStore() {
  var fileReadStream = fs.createReadStream('./data/storeArticle.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	var store = JSON.parse(data);
//  	console.log(data);

// Karl Johansgatan: "Nr": "1415",

//  	console.log(store.ButikOmbud);

//   "_ButikNr": "1415"


	var localArticleStore = store.filter((obj) => {
  		return obj._ButikNr === "1415";
	});

//	console.log(localArticleStore);

  	var write = JSON.stringify(localArticleStore);

    fs.writeFile('./data/storeArticleLocal.txt', write, (err) => {
      if (err) throw err;
      console.log('Systembolaget local article store written.');
    });
  });
}

module.exports.initialWriteLocalArticleStore = initialWriteLocalArticleStore;
module.exports.initialWriteLocalStore = initialWriteLocalStore;
module.exports.initialWriteMatches = initialWriteMatches;

module.exports.readRatedBeer = readRatedBeer;
module.exports.matchBeer = matchBeer;

module.exports.initialWriteBeers = initialWriteBeers;
module.exports.initialWriteRatedBeers = initialWriteRatedBeers;







