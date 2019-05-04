var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
// mongoose.connect('mongodb://localhost/clientsDatabase');
// var db = mongoose.connection;

const cities = require('./cities.json');
const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'});


// ping the client to be sure Elasticsearch is up
client.ping({
	requestTimeout: 30000,
}, function (error) {
	// at this point, eastic search is down, please check your Elasticsearch service
	if (error) {
		console.error('Elasticsearch cluster is down!');
	} else {
		console.log('Everything is ok');
	}
});

client.indices.delete({
	index: '_all'
}, function(err, res) {

	if (err) {
		console.error(err.message);
	} else {
		console.log('Indexes have been deleted!');
	}
});

//data.js
// create a new index called scotch.io-tutorial. If the index has already been created, this function fails safely
client.indices.create({
	index: 'scotch.io-tutorial'
}, function (error, response, status) {
	if (error) {
		console.log(error);
	} else {
		console.log("created a new index", response);
	}
});

// // add a data to the index that has already been created
// client.index({
//   index: 'scotch.io-tutorial',
//   id: '1',
//   type: 'cities_list',
//   body: {
//     "country": "AD",
//     "name": "Sant Julià de Lòria",
//     "lat": "42.46372",
//     "lng": "1.49129",
//   }
// }, function(err, resp, status) {
//   console.log(resp);
// });

var bulk = [];

cities.forEach(city => {
	bulk.push({
		index: {
			_index: "scotch.io-tutorial",
			_type: "cities_list",
		}
	});
	bulk.push(city)
});

//perform bulk indexing of the data passed
client.bulk({body: bulk}, function (err, response) {
	if (err) {
		console.log("Failed Bulk operation".red, err)
	} else {
		console.log("Successfully imported %s".green, cities.length);
	}
});
//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
// 	we're connected!
	// console.log('successfully connected to mongo db')
// });

//use sessions for tracking logins
// app.use(session({
// 	secret: 'work hard',
// 	resave: true,
// 	saveUninitialized: false,
// 	store: new MongoStore({
// 		mongooseConnection: db
// 	})
// }));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
// var routes = require('./routes/router');
// app.use('/', routes);
var search = require('./routes/elastic');
app.use('/elastic', search);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
	console.log('Express app listening on port 3000');
});

module.exports = {client};