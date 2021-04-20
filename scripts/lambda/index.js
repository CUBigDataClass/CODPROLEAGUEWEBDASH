const AWS = require('aws-sdk');
// const s3 = new AWS.S3()
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET
});
const elastic_client = require('elastic.js');

// exports.handler = async (event, context) => {
//     const Bucket = event.Records[0].s3.bucket.name;
//     const Key = event.Records[0].s3.object.key;
//     // console.log(Bucket + " w/ " + Key); // Bucket is trip-plannerrr, Key is file that was updated
    
//     const data = await s3.getObject({ Bucket, Key }).promise();
    
//     if (Key == "flight_api.json") {
//         // console.log("Raw text:\n" + data.Body.toString('ascii'));
//         elastic_client.indexFlightQuote(data.Body);
//     }
//     else if (Key == "yelp_api.json") {
//         elastic_client.indexYelpPlaces(data.Body);
//     }
// };


exports.handler = async (event, context) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;

    console.log(Bucket + " w/ " + Key); // Bucket is trip-plannerrr, Key is file that was updated
    
    const data = await s3.getObject({ Bucket, Key }).promise();
    res = []
    if (Key == "flight_api.json") {
        // console.log("Raw text:\n" + data.Body.toString('ascii'));
        for (const quote_doc of data.Body) {
            elastic_client.indexFlightQuote(quote_doc);
        }
    } 
    else if (Key == "yelp_api.json"){
        console.log("Raw text:\n" + data.Body.toString('ascii'));
        const w = JSON.parse(data.Body.toString('utf-8'))
        for (const yelp_doc of w) {
            elastic_client.indexYelpPlaces(yelp_doc);
         
        }
    }
    else if (Key == "weather_api.json"){
        console.log("Raw text:\n" + data.Body.toString('ascii'));
        const w = JSON.parse(data.Body.toString('utf-8'))
        for (const yelp_doc of w) {
            elastic_client.indexYelpPlaces(yelp_doc);
         
        }
    }
};