const router = require('express').Router();
const request = require('request');
const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const awsHttpClient = require('http-aws-es');
const redisClient = require('../scripts/redisClient');

//TEST ELASTIC FLIGHT SEARCH 
router.get('/search/flight', async (req, res) => {
    // check redis before searching elasticsearch
    const key = 'flight_key_' + req.query.from + '_' + req.query.to;
    const reply = await redisClient.getQuery(key);

    if (reply) {
        res.status(201).json(JSON.parse(reply));
        return;
    }

    // Begin request to elasticsearch service
    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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

    // Parse attributes for searching
    const sep_from = req.query.from.split(',');
    const sep_to = req.query.to.split(',');

    const from_city = sep_from[0];
    const from_state = sep_from[1];
    const to_city = sep_to[0];
    const to_state = sep_to[1];

    // Match query to specific price quotes based on origin/destination
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
            redisClient.setQuery('flight_key_' + req.query.from + '_' + req.query.to, JSON.stringify(hits));

            res.status(201).send(hits);
        }
    })
    .catch(err => {
        console.log("err " + err);
    });
});


// endpoint for yelp
router.get('/search/yelp', async (req, res) => {

    const key = 'yelp_key_' + req.query.location;
    const reply = await redisClient.getQuery(key);

    if (reply) {
        res.status(201).json(JSON.parse(reply));
        return;
    }

    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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
    // match query by state
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
        redisClient.setQuery('yelp_key_' + req.query.location, JSON.stringify(result.hits.hits));
        res.status(201).json(result.hits.hits);
    }
    })
    .catch(err => {
        console.log("err " + err);
    });
});

// weather endpoint for search 
router.get('/search/weather', async (req, res) => {
    const key = 'weather_key_' + req.query.city + req.query.region;
    const reply = await redisClient.getQuery(key);

    // if (reply) {
    //     res.status(201).json(JSON.parse(reply));
    //     return;
    // }

    AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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

    // match query by city and state 
    elasticClient.search({
        index: 'weather-index',
        type: '_doc',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                city: {
                                    query: req.query.city,
                                    fuzziness: "AUTO"
                                }
                            }
                        },
                        {
                            match: {
                                state: {
                                    query: req.query.region,
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
        let search_results = result.hits.hits[0]._source
        redisClient.setQuery('weather_key_' + req.query.city + req.query.region, JSON.stringify(search_results));
        res.status(201).json(search_results);
    }
    })
    .catch(err => {
        console.log("err " + err);
    });
});

module.exports = router;
