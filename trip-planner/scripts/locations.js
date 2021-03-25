// Load all airports from main cities into resources/airports.json
const fs = require('fs');
const path = require('path');
const states = require('./resources/states');
const airports = require('./resources/airports');
require('dotenv').config();

cleanStates();

function cleanStates() {

    for (const state of states) {
        state.cities = []; // clear out cities
    }

    for (const state of states) {
        objIndex = airports.findIndex((a => a.RegionId == state.abbreviation));
        if (objIndex != -1) {
          state.cities.push(airports[objIndex].CityName);
        }
    }

    const result = JSON.stringify(states,null,2);

    fs.writeFile(path.join(__dirname, 'resources/states.json'), result, 'utf8', function(err) {
        if (err) throw err;
        console.log("file success");
    });
}

// module.exports = { pull }
