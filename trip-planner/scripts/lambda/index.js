
const AWS = require('aws-sdk');


const s3 = new AWS.S3()
// {
//     accessKeyId: process.env.AWS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET
// });

exports.handler = async function(event) {
  return s3.listBuckets().promise()
}