require('dotenv').config()

api_key = process.env.TFL_API_KEY;

const axios = require('axios');

var makeGetRequest = async function (request) {
    try {
        response = await axios.get(request);
        console.log(response.data);
    } catch (err) {
       console.error(err);
    }

}

makeGetRequest("https://api.tfl.gov.uk/Line/london-overground/Arrivals/HUBNWD?direction=inbound" + "&api_key=" + api_key) 
