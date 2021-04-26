const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const cronJob = require('./scripts/cron');
const pullAirports = require('./scripts/airports');

app.use(cors())

//use this instead of bodyparser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname + '/client/build')));
app.use('/api', require('./routes/api'));

// catch-all
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// scripts to get ready for data pulls, uncomment as needed
// pullAirports.pull();
// yelpPars.download();
// yelpPars.parse();

// refresh data in S3 bucket
cronJob.yelpcron();
cronJob.weathercron();
cronJob.flightcron();

app.listen(process.env.PORT || 5000, function() {
    console.log('Successfully connected...');
});
