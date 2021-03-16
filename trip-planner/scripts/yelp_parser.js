const AWS = require('aws-sdk');
const request = require('request');

const bucket = 'trip-plannerrr';


function download(){ // fethcing data from s3 bucket
   const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET

   });

   var params = {
      Bucket: bucket, 
      Key: "yelp_api.json",
      // OutputSerialization: {
      //    JSON: {
      //      RecordDelimiter: ','
      //    }
      //  }
   }
   s3.getObject(params, function (err, data) { // getting json and deleting unnecessary  attributes 

      if (err) {
          console.log(err);
      } 
      else {

         const json_obj = JSON.parse(data.Body.toString('utf-8'))
         
         delete (json_obj.businesses['0'].id)
         delete (json_obj.businesses['0'].alias)
         delete (json_obj.businesses['0'].image_url)
         delete (json_obj.businesses['0'].url)
         delete (json_obj.businesses['0'].is_closed)
         delete (json_obj.businesses['0'].review_count)
         delete (json_obj.businesses['0'].categories)
         delete (json_obj.businesses['0'].coordinates)
         delete (json_obj.businesses['0'].transactions)
         delete (json_obj.businesses['0'].location.address1)
         delete (json_obj.businesses['0'].location.address2)
         delete (json_obj.businesses['0'].location.address3)
         delete (json_obj.businesses['0'].location.city)
         delete (json_obj.businesses['0'].location.zip_code)
         delete (json_obj.businesses['0'].location.country)
         // delete (json_obj.businesses['0'].location.display_address)
         delete (json_obj.businesses['0'].location.state)
         delete (json_obj.businesses['0'].display_phone)
         delete (json_obj.businesses['0'].distance)
         delete (json_obj.total)
         delete (json_obj.region)

         console.log(JSON.stringify(json_obj))

      }
     
  })
};


 module.exports = { 
   download
};