const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
require('dotenv').config();
const states = require('../resources/states.json');
const quotes = require('../resources/quotes.json');

let region = process.env.AWS_REGION;
let domain = process.env.AWS_ELASTIC_DOMAIN;
let json = {
    "QuoteId": 5,
    "MinPrice": 155,
    "Direct": false,
    "Carrier": "jetBlue",
    "OriginCity": "New York",
    "OriginState": "NY",
    "DestinationCity": "Chicago",
    "DestinationState": "IL"
};

// var json2 = [{
//     "id": 200,
//     "name": "Mysttik Masaala",
//     "rating": 4.5,
//     "price": "$",
//     "location": {
//         "address1": "399 Park Ave",
//         "address2": "Corner of 54th street",
//         "city": "New York",
//         "zip_code": "10022",
//         "country": "US",
//         "state": "NY"
//     },
//     "phone": "+19173063128"
// },
// {
//     "id": 201,
//     "name": "Mysttik Masaala",
//     "rating": 4.5,
//     "price": "$",
//     "location": {
//         "address1": "399 Park Ave",
//         "address2": "Corner of 54th street",
//         "city": "New York",
//         "zip_code": "10022",
//         "country": "US",
//         "state": "NY"
//     },
//     "phone": "+19173063128"
// }
// ]

indexFlightQuote(json);
for (const state of states) {
    indexState(state);
}

function indexState(doc) {
    let endpoint = new AWS.Endpoint(domain);
    let request = new AWS.HttpRequest(endpoint, region);

    let index = 'states';
    let type = '_doc';
    let id = doc.id;

    request.method = 'PUT';
    request.path += index + '/' + type + '/' + id;
    request.body = JSON.stringify(doc);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);

    let credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET;

    let signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    let client = new AWS.HttpClient();
    client.handleRequest(request, null, function(response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        let responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function (_) {
            console.log('Response body: ' + responseBody);
        });
        }, function(error) {
        console.log('Error: ' + error);
    });
}


// deleteIndex('flight-quotes');

// for (const quote of quotes) {
//     indexFlightQuote(quote);
// }

function deleteIndex(index) {
    let endpoint = new AWS.Endpoint(domain);
    let request = new AWS.HttpRequest(endpoint, region);

    request.method = 'DELETE';
    request.path += index;
    request.headers['host'] = domain;


    let credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET;

    let signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    let client = new AWS.HttpClient();
    client.handleRequest(request, null, function(response) {
        let responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function (chunk) {
            console.log('Response body: ' + responseBody);
        });
        }, function(error) {
        console.log('Error: ' + error);
    });
}

function indexFlightQuote(quote) {
    let endpoint = new AWS.Endpoint(domain);
    let request = new AWS.HttpRequest(endpoint, region);

    let index = 'flight-quotes';
    let type = '_doc';
    let id = quote['QuoteId'];

    request.method = 'PUT';
    request.path += index + '/' + type + '/' + id;
    request.body = JSON.stringify(quote);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);

    let credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET;

    let signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    let client = new AWS.HttpClient();
    client.handleRequest(request, null, function(response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        let responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function (chunk) {
            console.log('Response body: ' + responseBody);
        });
        }, function(error) {
        console.log('Error: ' + error);
    });
}

// for (const state of json2) {
//     indexYelpPlaces(state);
// }




// for (const state of states){
//     indexYelpPlaces(state)
// }

// deleteIndex('yelp-places');

function indexYelpPlaces(place) {
    // console.log("in func")
    // console.log(place['id'])
    // console.log("place it is ")
    var endpoint = new AWS.Endpoint(domain);
    var request = new AWS.HttpRequest(endpoint, region);
    var index = 'yelp-places';
    var type = '_doc';
    var id = place['id'];

    request.method = 'PUT';
    request.path += index + '/' + type + '/' + id;
    request.body = JSON.stringify(place);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);
    
    var credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    var signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
    var client = new AWS.HttpClient();
    
    return new Promise((resolve, reject) => {
        client.handleRequest(request, null,
            response => {
                console.log("INSIDE")
                const { statusCode, statusMessage, headers } = response;
                let body = '';
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    const data = {
                        statusCode,
                        statusMessage,
                        headers
                    };
                    console.log('Response body: ' + JSON.stringify(data));
                    if (body) {
                        data.body = body;
                    }
                    resolve(data);
                });
            },
            err => {
                console.log("ERR: " + err);
                reject(err);
            });
    });
    
}

module.exports = { indexFlightQuote, indexYelpPlaces };
