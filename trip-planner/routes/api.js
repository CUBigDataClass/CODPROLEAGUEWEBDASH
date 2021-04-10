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
    // console.log(req.body);
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

//TEST ELASTIC flight 
router.get('/search/flight', (req, res) => {
    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET,
        accessKeyId: process.env.AWS_KEY_ID,
        region: process.env.AWS_REGION
    });

    let elasticClient = new elasticsearch.Client({
        host: "https://search-trip-planner-search-7ibogrjydq3fzylipyslejm3wi.us-west-1.es.amazonaws.com/",
        log: 'error',
        connectionClass: connectionClass,
        amazonES: {
            credentials: new AWS.EnvironmentCredentials('AWS'),
        }
    });

    const sep_from = req.query.from.split(',');
    const sep_to = req.query.to.split(',');

    const from_city = sep_from[0];
    const from_state = sep_from[1];
    const to_city = sep_to[0];
    const to_state = sep_to[1];

    // match to specific price quotes based on origin/destination
    elasticClient.search({
        index: 'flight-quotes',
        type: '_doc',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                OriginCity: {
                                    query: from_city,
                                    fuzziness: "AUTO"
                                }
                            }
                        },
                        {
                            match: {
                                OriginState: {
                                    query: from_state,
                                    fuzziness: "AUTO"
                                }
                            }
                        },
                        {
                            match: {
                                DestinationCity: {
                                    query: to_city,
                                    fuzziness: "AUTO"
                                }
                            }
                        },
                        {
                            match: {
                                DestinationState: {
                                    query: to_state,
                                    fuzziness: "AUTO"
                                }
                            }
                        }
                    ]
                }
            }
        }
    })
    .then(result => {
        if (result.hits.hits.length === 0) {
            res.sendStatus(404);
        } else {
            let hits = Array.from(result.hits.hits, h => h._source);
            res.status(201).send(hits);
        }
    })
    .catch(err => {
        console.log("err " + err);
    });
});


router.get('/search/yelp', (req, res) => {
    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET,
        accessKeyId: process.env.AWS_KEY_ID,
        region: process.env.AWS_REGION
    });

    let elasticClient = new elasticsearch.Client({
        host: "https://search-trip-planner-search-7ibogrjydq3fzylipyslejm3wi.us-west-1.es.amazonaws.com/",
        log: 'error',
        connectionClass: connectionClass,
        amazonES: {
            credentials: new AWS.EnvironmentCredentials('AWS'),
        }
    });

      elasticClient.search({
          index: 'yelp-places',
          type: '_doc',
          body: {
            query: {
                match: {
                  "location.state": {
                    query: req.query.location,
                    fuzziness: "AUTO"
                  }
                }
            }
        }
      })
      .then(result => {
        if (result.hits.hits.length === 0) {
            res.sendStatus(404);
        } else {
            // let hits = Array.from(result.hits.hits, h => h._source);
            res.status(201).send(result.hits.hits);
        }
    })
    .catch(err => {
        console.log("err " + err);
    });

    
});

module.exports = router;
