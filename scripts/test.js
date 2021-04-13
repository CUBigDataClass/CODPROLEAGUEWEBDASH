const quotes = require('./resources/quotes');

if (process.env.ENVIRONMENT === 'development') {  
    require('dotenv').config();  
}  

var AWS = require('aws-sdk');
var region = process.env.AWS_REGION;
var domain = process.env.AWS_ELASTIC_DOMAIN;
var index = 'quotes';
var type = '_doc';


function indexFlightQuote(quote) {
    var endpoint = new AWS.Endpoint(domain);
    var request = new AWS.HttpRequest(endpoint, region);

    request.method = 'PUT';
    request.path += index + '/' + type + '/' + quote['QuoteId'];
    request.body = JSON.stringify(quote);
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    // Content-Length is only needed for DELETE requests that include a request
    // body, but including it for all requests doesn't seem to hurt anything.
    request.headers['Content-Length'] = Buffer.byteLength(request.body);
    
    var credentials = new AWS.EnvironmentCredentials('AWS');
    credentials.accessKeyId = process.env.AWS_KEY_ID;
    credentials.secretAccessKey = process.env.AWS_SECRET;

    var signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());

    var client = new AWS.HttpClient();
    client.handleRequest(request, null, function(response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        var responseBody = '';
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

module.exports = { indexFlightQuote };
