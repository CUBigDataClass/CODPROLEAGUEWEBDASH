const { Client } = require('@elastic/elasticsearch');
const AWS = require('aws-sdk');
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector');

const awsConfig = new AWS.Config({
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-1'
});

const client = new Client({
    ...createAwsElasticsearchConnector(awsConfig),
    // node: 'https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com'
});

module.exports = client;
