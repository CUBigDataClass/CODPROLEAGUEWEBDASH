const router = require('express').Router();
const request = require('request');
const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')
const connectionClass = require('http-aws-es');
const awsHttpClient = require('http-aws-es')
require('dotenv').config();

router.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

router.post('/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});
//TEST YELP
router.get('/yelp', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.yelp.com/v3/businesses/search',
        qs: {
            location: 'Denver',
            limit: '1',
            sort_by: 'rating'
        },
        headers: {
          'Authorization': 'Bearer ' + process.env.YELP_API_KEY
        }
    };

    // send request to API
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        // res.render(path.join(__dirname, '../client/index.ejs'), {res_arr: res_arr});
    });
});

//TEST WEATHER
router.get('/weather', (req, res) => {
    const options = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
            q: 'Moscow',
            type: 'hour',
            APPID: process.env.WEATHER_API_KEY
        }
    };

    // send request to API
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        // res.render(path.join(__dirname, '../client/index.ejs'), {res_arr: res_arr});
    });
});

//TEST ELASTIC
router.get('/elastic', (req, res) => {
    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET,
        accessKeyId: process.env.AWS_KEY_ID,
        region: process.env.AWS_REGION
    });

    var elasticClient = new elasticsearch.Client({
        host: "https://search-trip-planner-search-7ibogrjydq3fzylipyslejm3wi.us-west-1.es.amazonaws.com/",
        log: 'error',
        connectionClass: connectionClass,
        amazonES: {
            credentials: new AWS.EnvironmentCredentials('AWS'),
        }
    });
    
    elasticClient.search({
        index: 'node-test',
        type: '_doc',
        body: {
            query: {
                match: {
                    year: '2011'
                }
            }
        }
    })
    .then(res => {
        console.log("")
        console.log(res)
        console.log("below includes the response body for first element")
        console.log(res.hits.hits[0])
    })
    .catch(err => {
        console.log("err " + err);
    });
});

module.exports = router;
