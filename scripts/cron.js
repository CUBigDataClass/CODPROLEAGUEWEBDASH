const cron = require('node-cron');
const request = require('request');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const airports = require('./resources/airports');
const sts = require('./resources/states');
const { STATUS_CODES } = require('http');
require('dotenv').config();

function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}


function yelpcron() {
    // const cron_qs = '0 0 0 15 * ?'; // fire 15th of every month

    const cron_qs = '0 17 * * * *'; // fire once a min
    cron.schedule(cron_qs, async function() {
        console.log('running a task every minute again');

        var responce_arr = []
        count = 0
        for (const state of sts){
            const states_origin = state.abbreviation
            const options = {
                method: 'GET',
                url: 'https://api.yelp.com/v3/businesses/search',// + 'location=' + states_origin + 'limit=1',
                qs: {
                    location: states_origin,
                    limit: '5'
                },
                headers: {
                    'Authorization': 'Bearer ' + process.env.YELP_API_KEY
                }
            }
            // console.log(options)
            request(options, function(err, res, body) {
                if (err) throw new Error(err)

                var json_obj = JSON.parse(body);
            
                for (business of json_obj.businesses){
                    
                    count = count + 1 

                    business.id = count 
                    delete (business.alias)
                    // delete (business.image_url)
                    delete (business.url)
                    delete (business.is_closed)
                    delete (business.review_count)
                    delete (business.categories)
                    delete (business.coordinates)
                    delete (business.transactions)
                    // delete (json_obj.businesses['0'].location.address1)
                    // delete (json_obj.businesses['0'].location.address2)
                    delete (business.location.address3)
                    // delete (json_obj.businesses['0'].location.city)
                    // delete (json_obj.businesses['0'].location.zip_code)
                    // delete (json_obj.businesses['0'].location.country)
                    delete (business.location.display_address)
                    // delete (json_obj.businesses['0'].location.state)
                    delete (business.display_phone)
                    delete (business.distance)
                    delete (business.total)
                    delete (business.region)

                    responce_arr.push(business)
                        
                }
            });
            await new Promise(r => setTimeout(r, 1500)); // sleeps for 1.5 sec
        }
        // write to file add to s3 
        if (responce_arr.length == 0) return;

        const res_formatted = JSON.stringify(responce_arr,null,2);
      

        fs.writeFile(path.join(__dirname, 'resources/yelpPlaces.json'), res_formatted, 'utf8', function(err) {
            if (err) throw err;
            console.log("file success");
        });

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET
        });
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: 'trip-plannerrr',
            Key: 'yelp_api.json',
            Body: res_formatted,
            ContentType: 'application/json'
        };
    
        // Uploading files to the bucket
        // s3.upload(params, function(err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`File uploaded successfully. ${data.Location}`);
        // });
        
        console.log("success");
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

// Pull flight price quotes from Skyscanner API
function flightcron() {
    const cron_qs = '0 12 * * * *'; // fire once a min
    cron.schedule(cron_qs, async function() {
        console.log('running a task every minute');
        let res_arr = [];
        let visited_airports = new Set();

        // get 6 months 
        for (let month=1; month<=1; ++month) {
            let date = new Date();
            const month_formatted = addMonths(date, month).toISOString().split('T')[0].substring(0,7);

            // prices vary both ways from airports, so getting all possible matches is required
            for (let j=0; j<airports.length; ++j) {
                for (let k=0; k<airports.length; ++k) {

                    await new Promise(r => setTimeout(r, 1500)); // sleep 1.5 sec to avoid api rate limit

                    if (airports[j].RegionId == airports[k].RegionId) continue; // ignore interstate travel quotes
                    if (visited_airports.has(airports[j].RegionId+airports[k].RegionId)) {
                        continue;
                    } else {
                        visited_airports.add(airports[j].RegionId+airports[k].RegionId);
                    }

                    const airport_origin = airports[j].PlaceId;
                    const airport_destination = airports[k].PlaceId;

                    const options = {
                        method: 'GET',
                        url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/' + 
                             airport_origin + '/' + airport_destination + '/' + month_formatted,
                        qs: {inboundpartialdate: month_formatted},
                        headers: {
                            'x-rapidapi-key': process.env.AIRLINE_API_KEY,
                            'x-rapidapi-host': process.env.AIRLINE_HOST,
                        }
                    };

                    // send request to API
                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        // cheapest flight is always at beginning
                        let body_obj = JSON.parse(body);

                        if (body_obj.errors || body_obj.Quotes.length == 0) return; // ignore when no quote is found

                        // let cheapest_quote = body_obj.Quotes[0];
                        let cheapest_quote = body_obj.Quotes.find(q => q.Direct);

                        if (typeof(cheapest_quote) === 'undefined') cheapest_quote = body_obj.Quotes[0];

                        // add airline name, i.e. 'Southwest Airlines'
                        for (const carrier of body_obj.Carriers) {
                            if (cheapest_quote.OutboundLeg.CarrierIds.includes(carrier.CarrierId)) {
                                cheapest_quote['Carrier'] = carrier.Name;
                            }
                        }

                        // clean/build response object
                        cheapest_quote['QuoteId'] = k + (month * airports.length); // new unique identifier
                        cheapest_quote['Month'] = month_formatted.substring(5,7);
                        cheapest_quote['OriginState'] = airports[j].RegionId;
                        cheapest_quote['DestinationState'] = airports[k].RegionId;
                        cheapest_quote['DepartureDate'] = cheapest_quote.OutboundLeg.DepartureDate;
                        
                        if (body_obj.Places[0].PlaceId === cheapest_quote.OutboundLeg.OriginId) {
                            cheapest_quote['OriginCity'] = body_obj.Places[0].CityName;
                            cheapest_quote['DestinationCity'] = body_obj.Places[1].CityName;
                        } else {
                            cheapest_quote['OriginCity'] = body_obj.Places[1].CityName;
                            cheapest_quote['DestinationCity'] = body_obj.Places[0].CityName;
                        }

                        delete (cheapest_quote['OutboundLeg']);
                        delete (cheapest_quote['QuoteDateTime']);

                        // format and push to response
                        res_arr.push(cheapest_quote);
                    });    
                }
                break;
            }
        }

        if (res_arr.length == 0) return;

        const res_formatted = JSON.stringify(res_arr,null,2);

        // write to local file for testing purposes
        // fs.writeFile(path.join(__dirname, 'resources/quotes.json'), res_formatted, 'utf8', function(err) {
        //     if (err) throw err;
        //     console.log("file success");
        // });

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET
        });
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: 'trip-plannerrr',
            Key: 'flight_api.json',
            Body: res_formatted,
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
}

module.exports  = { yelpcron, weathercron, flightcron }