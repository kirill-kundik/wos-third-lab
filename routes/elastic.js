const express = require('express');
const router = express.Router();
const client = require('../app').client;

// GET route for reading data
router.get('/search', function (req, res, next) {
	let body = {
		size: 200,
		from: 0,
		query: {
			match: {
				name: req.query['q']
			}
		}
	};
	// perform the actual search passing in the index, the search query and the type
	client.search({index: 'scotch.io-tutorial', body: body, type: 'cities_list'})
		.then(results => {
			res.send(results.hits.hits);
		})
		.catch(err => {
			console.log(err);
			res.send([]);
		});
});

module.exports = router;