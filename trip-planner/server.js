const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cronJob = require('./scripts/cron');

//use this instead of bodyparser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

// refresh data in S3 bucket
cronJob.yelpcron();

app.listen(port, () => console.log(`Listening on port ${port}`));