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
    
      elasticClient.search({
          index: 'flight-quotes',
          type: '_doc',
          body: {
              query: {
                  multi_match: {
                      query: req.query.loc,
                      fields: [ "OriginState", "OriginCity" ],
                      fuzziness: "AUTO"
                  }
              }
          }
      })
      .then(result => {
          let options_arr = [];
          let options_set = new Set();
          for (hit of result.hits.hits){
            
            let loc = hit._source['OriginCity'] + ', ' + hit._source['OriginState'];
            
            if (!options_set.has(loc)) { 
                let option = {};
                option['value'] = loc;
                option['label'] = loc;
                options_arr.push(option);
                options_set.add(loc);
            }

        }

        res.status(201).send(options_arr);
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

    // res.status(201).send("YEEEE");
        // console.log("YEEEEEEE")
        // console.log(JSON.stringify(req.query.location,null,2))
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
        //   let options_arr = [];
        //   let options_set = new Set();
        //   for (hit of result.hits.hits){
        
        //     let loc = hit._source['name'] + ', ' + hit._source.location['state'];
            
        //     if (!options_set.has(loc)) { 
        //         let option = {};
        //         option['value'] = loc;
        //         option['label'] = loc;
        //         options_arr.push(option);
        //         options_set.add(loc);
        //     }
        res.status(201).send(result.hits.hits);

        
        // console.log(result.hits.hits)
        // // console.log(body)
        // // console.log(options_arr)
        // res.status(201).send(result.hits.hits);
    })
    .catch(err => {
        console.log("err " + err);
    });
});

// router.post('/test', (req, res) => {
//     // console.log(req.body);
//     res.send(
//         "HEllo it is working"
//     );
// });

module.exports = router;
