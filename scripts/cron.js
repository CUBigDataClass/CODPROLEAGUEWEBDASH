const cron = require('node-cron');
const request = require('request');
const AWS = require('aws-sdk');
const airports = require('./resources/airports');
const states = require('./resources/states');

if (process.env.ENVIRONMENT === 'development') {  
    require('dotenv').config();  
}  

function addMonths(date, months) {
    let d = date.getDate();
    date.setMonth(date.getMonth() + months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}
function tempConvert(k){
    let ret =  ((k - 273.15)*1.8)+32
    return ret | 0
}

function timeConvert(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function yelpcron() {
    const cron_qs = '0 0 0 15 * *'; // fire 15th of every month
    cron.schedule(cron_qs, async function() {
        let response_arr = []
        count = 0
        for (const state of states){
            const options = {
                method: 'GET',
                url: 'https://api.yelp.com/v3/businesses/search',// + 'location=' + states_origin + 'limit=1',
                qs: {
                    location: state.abbreviation,
                    limit: '5'
                },
                headers: {
                    'Authorization': 'Bearer ' + process.env.YELP_API_KEY
                }
            }

            request(options, function(err, res, body) {
                if (err) throw new Error(err)

                let json_obj = JSON.parse(body);
            
                // clean object before appending
                for (business of json_obj.businesses){
                    
                    count = count + 1 

                    business.id = count 
                    delete (business.alias)
                    delete (business.is_closed)
                    delete (business.review_count)
                    delete (business.categories)
                    delete (business.coordinates)
                    delete (business.transactions)
                    delete (business.location.address3)
                    delete (business.location.display_address)
                    delete (business.display_phone)
                    delete (business.distance)
                    delete (business.total)
                    delete (business.region)

                    response_arr.push(business)
                }
            });
            await new Promise(r => setTimeout(r, 1500)); // sleeps for 1.5 sec
        }

        // write to file add to s3 
        if (response_arr.length == 0) return;

        const res_formatted = JSON.stringify(response_arr,null,2);

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
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });
    });
}

// MAKE CHANGES TO MAKE IT WORK
function weathercron() {
    const cron_qs = '0 0 0 15 * *'; // fire 15th of every month
    cron.schedule(cron_qs, async function() {
        let date = new Date();
        let first_day = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let last_day = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        let unix_from = first_day.getTime() / 1000
        let unix_to = last_day.getTime() / 1000

        let response_arr = []
        let count = 0

        for (const city of cit){
            const options = {
                method: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather',
                qs: {
                    q: city.name,
                    type: 'hour',
                    start: unix_from,
                    end: unix_to,
                    APPID: process.env.WEATHER_API_KEY
                }
            };
    
            // send request to API
            request(options, function (error, response, body) {
                let res_obj =  {}
                if (error) throw new Error(error);
                else{
                    let json_obj = JSON.parse(body);
                    res_obj = {
                        "id": count, "description": json_obj.weather[0].description,
                        "temp": tempConvert(json_obj.main.temp), "temp_min":  tempConvert(json_obj.main.temp_min), "temp_max":  tempConvert(json_obj.main.temp_max), 
                        "humidity": json_obj.main.humidity, "sunrise": timeConvert(json_obj.sys.sunrise),"sunset": timeConvert(json_obj.sys.sunset),
                        "state": city.usps,"city": json_obj.name
                    }

                    response_arr.push(res_obj)                
                }
                count += 1
            });
            await new Promise(r => setTimeout(r, 1500)); // sleeps for 1.5 sec
        }
        
        if (response_arr.length == 0) return;

        const res_formatted = JSON.stringify(response_arr,null,2);
    
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET
        });

        // Setting up S3 upload parameters
        const params = {
            Bucket: 'trip-plannerrr',
            Key: 'weather_api.json',
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

// Pull flight price quotes from Skyscanner API
function flightcron() {
    const cron_qs = '0 0 0 15 * *'; // fire 15th of every month
    cron.schedule(cron_qs, async function() {
        console.log('running a task every minute');
        let res_arr = [];
        let visited_airports = new Set();

        // get 1 month out for now 
        for (let month=1; month<=1; ++month) {
            let date = new Date();
            const month_formatted = addMonths(date, month).toISOString().split('T')[0].substring(0,7);
            let id = 1;

            // prices lety both ways from airports, so getting all possible matches is required
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
                        cheapest_quote['QuoteId'] = id;
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
                        id+=1;
                    });    
                }
            }
        }

        if (res_arr.length == 0) return;

        const res_formatted = JSON.stringify(res_arr,null,2);

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
