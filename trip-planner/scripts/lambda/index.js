const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const elastic_client = require('elastic_client');

exports.handler = async (event, context) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;
    // console.log(Bucket + " w/ " + Key); // Bucket is trip-plannerrr, Key is file that was updated
    
    const data = await s3.getObject({ Bucket, Key }).promise();
    
    if (Key == "flight_api.json") {
        // console.log("Raw text:\n" + data.Body.toString('ascii'));
        elastic_client.indexFlightQuote(data.Body);
    }
};