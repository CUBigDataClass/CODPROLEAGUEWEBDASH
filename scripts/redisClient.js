const redis = require("redis");
const util = require('util');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

//production redis url
let redis_url = process.env.REDIS_URL;
if (process.env.ENVIRONMENT === 'development') {  
    require('dotenv').config();  
    redis_url = "redis://127.0.0.1"; 
}  

const redisClient = redis.createClient(redis_url);
redisClient.on("error", function(error) {
    console.error("REDIS [ERROR] " + error);
});

function redisQuery(key) {
    return new Promise((resolve, reject) => {
        redisClient.getAsync(key).then(function(reply) {
            resolve(reply);
        })
        .catch(err => reject(err));
    });
}

module.exports = { redisQuery };
