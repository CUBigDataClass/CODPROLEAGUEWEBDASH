// Load all airports from main cities into resources/airports.json
const request = require('request');
const fs = require('fs');
const path = require('path');
const cities = require('./resources/cities');
const codes = require('./resources/iatacodes');
require('dotenv').config();

async function pull() {
    const code_lookup = new Set(codes.PopAirports.IataCodes);
    var has_set = new Set();
    var res_arr = [];

    for (const city of cities) {
        const options = {
            method: 'GET',
            url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/',
            qs: {query: city.name},
            headers: {
              'x-rapidapi-key': process.env.AIRLINE_API_KEY,
              'x-rapidapi-host': process.env.AIRLINE_HOST,
              useQueryString: true
            }
          };
    
        // send request to API
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const body_obj = JSON.parse(body);

            for (const airport of body_obj.Places) {
                if (airport.PlaceId[3] != '-') continue; // follows specific IATA format
                if (!has_set.has(airport.PlaceId.substr(0,3)) && // hasn't already been selected
                    code_lookup.has(airport.PlaceId.substr(0,3)) && // is a popular airport
                    airport.CountryName == 'United States') {
                        res_arr.push(airport);
                }
            }
        });

        await new Promise(r => setTimeout(r, 1300)); // sleep 1.3 sec to avoid api rate limit
    };

    const result = JSON.stringify(res_arr,null,2);

    fs.writeFile(path.join(__dirname, 'resources/airports.json'), result, 'utf8', function(err) {
        if (err) throw err;
        console.log("file success");
    });
}

module.exports = { pull }