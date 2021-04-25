# Trip Planner :airplane:
[![Build Status](https://travis-ci.com/CUBigDataClass/Trip-Planner.svg?branch=dev)](https://travis-ci.com/CUBigDataClass/Trip-Planner)

Trip Planner is the web based application that allows users to plan their trip according to their destination.
All you have to do is enter the desired location into the search bar and we will take care of the rest.
Trip Planner is connected to multiple APIs to help us provide you with the best information.
You enter the destination and we will provide with the cheapest flight tickets, a weather report, and things to do.  
  
**Hosted on [Heroku](https://trip-ahead.herokuapp.com)**
  
## To Run Project Locally

### From Terminal  
`git clone git@github.com:CUBigDataClass/Trip-Planner.git` to clone project  
`cd Trip-Planner` to go to root level  
  
### Setup Environment Variables 
  
  PORT (optional, defaults to 5000)  
  YELP_API_KEY  
  WEATHER_API_KEY  
    * From OpenWeatherMap, Historical Weather Data Key
  AIRLINE_API_KEY  
    * From RapidAPI, Skyscanner API
  AIRLINE_HOST  
    * Skyscanner RapidAPI host url
  AWS_ACCESS_KEY_ID  
  AWS_SECRET_ACCESS_KEY  
  AWS_REGION  
  AWS_ELASTIC_DOMAIN  
  REDIS_URL  
    * Locally we used `brew install redis` & `redis-server`

### From Terminal  
  * `npm run build` from root level directory to build client
  * `npm install` to refresh package-lock.json in root level directory
  * Clear processes running on ports 3000 and 5000 (If port specified, ignore latter)
  * `npm run dev` and it will concurrently run create-react-app app and nodeJS server instance 
