require('dotenv').config()

api_key = process.env.TFL_API_KEY;

const axios = require('axios');

var makeGetRequest = async function (request) {
    try {
        response = await axios.get(request);
	//console.log(response.data);
	for (const result_item of response.data) {
		console.log("Destination: " + result_item.destinationName);
	        console.log("Platform: " + result_item.platformName);
        	console.log("Expected Arrival: " + result_item.expectedArrival);
        	console.log("Time to station: " + result_item.timeToStation);
		console.log("\n");
	}
    } catch (err) {
       console.error(err);
    }

}

makeGetRequest("https://api.tfl.gov.uk/Line/london-overground/Arrivals/HUBNWD?direction=inbound" + "&api_key=" + api_key); 
