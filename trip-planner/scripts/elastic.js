// const { Client } = require('@elastic/elasticsearch');
const AWS = require('aws-sdk');
require('dotenv').config();
// const createAwsElasticsearchConnector = require('aws-elasticsearch-connector');

// const awsConfig = new AWS.Config({
//     // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
//     accessKeyId: process.env.AWS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET,
//     region: process.env.AWS_REGION
// });

// const client = new Client({
//     ...createAwsElasticsearchConnector(awsConfig),
//     // node: 'https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com'
// });

// module.exports = client;

var region = process.env.AWS_REGION; // e.g. us-west-1
var domain = process.env.AWS_ELASTIC_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
var index = 'node-test';
var type = '_doc';
var id = '1';
var json = {
  "title": "Moneyball",
  "director": "Bennett Miller",
  "year": "2011"
}

indexDocument(json);

function indexDocument(document) {   // index yelp 
    var endpoint = new AWS.Endpoint(domain);
    // console.log(endpoint)
    var request = new AWS.HttpRequest(endpoint, region);
    // console.log(request)
    request.method = 'PUT';
    request.path += index + '/' + type + '/' + id;
    request.body = JSON.stringify(document);
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