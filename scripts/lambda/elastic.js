const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const states = require('../resources/states.json');
require('dotenv').config();

let region = process.env.AWS_REGION;
let domain = process.env.AWS_ELASTIC_DOMAIN;

// ===== RUNNING SCRIPTS =====

// deleteIndex('flight-quotes');
// deleteIndex('yelp-places');

// for (const state of states) {
//     indexState(state);
// }

// for (const state of states) {
//     indexYelpPlaces(state);
// }

// for (const quote of quotes) {
//     indexFlightQuote(quote);
// }

// ============================

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

function indexYelpPlaces(place) {
    // console.log("in func")
    // console.log(place['id'])
    // console.log("place it is ")
    let endpoint = new AWS.Endpoint(domain);
    let request = new AWS.HttpRequest(endpoint, region);
    let index = 'yelp-places';
    let type = '_doc';
    let id = place['id'];

    request.method = 'PUT';
    request.path += index + '/' + type + '/' + id;
    request.body = JSON.stringify(place);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);
    
    let credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    let signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
    let client = new AWS.HttpClient();
    
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
