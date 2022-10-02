require('dotenv').config()

api_key = process.env.TFL_API_KEY;

const axios = require('axios');

var makeGetRequest = async function (request) {
    try {
        response = await axios.get(request);
	//console.log(response.data);
	for (const result_item of response.data) {
		console.log("Destination: " + result_item.destinationName);
	        //console.log("Platform: " + result_item.platformName);
        	time_in_minutes_to_arrival = result_item.timeToStation/60;
		time_in_minutes_to_arrival = time_in_minutes_to_arrival.toFixed(0);
		console.log("Minutes to arrival: " + time_in_minutes_to_arrival);
		console.log("");
	}
    } catch (err) {
       console.error(err);
    }

}

makeGetRequest("https://api.tfl.gov.uk/Line/london-overground/Arrivals/HUBNWD?direction=inbound" + "&api_key=" + api_key); 
