const cron = require('node-cron');
const request = require('request');
const AWS = require('aws-sdk');
require('dotenv').config();

function yelpcron() {
    // const cron_qs = '0 0 0 15 * ?'; // fire 15th of every month
    const cron_qs = '0 * * * * *'; // fire once a min
    cron.schedule(cron_qs, function() {
        console.log('running a task every minute again');
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
            
            console.log("HERE" + typeof(body));
            console.log("!!!" + body);
    
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET
            });
        
            // Setting up S3 upload parameters
            const params = {
                Bucket: 'trip-plannerrr',
                Key: 'yelp_api.json',
                Body: body,
                ContentType: 'application/json'
            };
        
            // Uploading files to the bucket
            
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        });
    });
}


function weathercron() {
    const cron_qs = '0 * * * * *'; // fire once a min
    cron.schedule(cron_qs, function() {
        console.log('running a task every minute');
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
        
            console.log("HERE" + typeof(body));
            console.log("!!!" + body);


            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET
            });
        
            // Setting up S3 upload parameters
            const params = {
                Bucket: 'trip-plannerrr',
                Key: 'weather_api.json',
                Body: body,
                ContentType: 'application/json'
            };
        
            // Uploading files to the bucket
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        });
    });
}

module.exports = { yelpcron, weathercron }
