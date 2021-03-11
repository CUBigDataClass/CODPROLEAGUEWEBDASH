
const AWS = require('aws-sdk');


const s3 = new AWS.S3()
// {
//     accessKeyId: process.env.AWS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET
// });

exports.handler = async function(event) {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  const data = await s3.getObject({ Bucket, Key }).promise();
  console.log("Raw text:\n" + data.Body.toString('ascii'));

  return s3.listBuckets().promise();
}