const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
const cronJob = require('./scripts/cron');
const pullAirports = require('./scripts/airports');
const yelpPars = require('./scripts/yelp_parser')

app.use(cors())

//use this instead of bodyparser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

// refresh data in S3 bucket

// cronJob.yelpcron();
// cronJob.weathercron();
// cronJob.flightcron();
// pullAirports.pull();
// yelpPars.download();
// yelpPars.parse();

app.listen(port, () => console.log(`Listening on port ${port}`));
