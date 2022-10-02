require('dotenv').config()
api_key = process.env.TFL_API_KEY;
const axios = require('axios');

var findUpcomingTrains= async function (departing_station_id, inbound_or_outbound, number_of_trains_to_return) {
    try {
	request = "https://api.tfl.gov.uk/Line/london-overground/Arrivals/" + departing_station_id + "?direction=" + inbound_or_outbound + "&api_key=" + api_key;
        response = await axios.get(request);
        //console.log(response.data);
        number_of_trains_returned = 0;
        for (const result_item of response.data) {
                number_of_trains_returned++;
                if (number_of_trains_returned <= number_of_trains_to_return ) {
                        console.log("Destination: " + result_item.destinationName);
                        //console.log("Platform: " + result_item.platformName);
                        time_in_minutes_to_arrival = result_item.timeToStation/60;
                        time_in_minutes_to_arrival = time_in_minutes_to_arrival.toFixed(0);
                        console.log("Minutes to arrival: " + time_in_minutes_to_arrival);
                        console.log("");
                }
        }
    } catch (err) {
       console.error(err);
    }
}

var findDisruptionfromStation = async function (departing_station_id) {
	try {
		request = "https://api.tfl.gov.uk/StopPoint/" + departing_station_id  + "/Disruption";
		//request = "https://api.tfl.gov.uk/StopPoint/HUBNWD/Disruption" + "&api_key=" + api_key; // replaced by above, as for some reason appending the API key to the URL returns a 404
		response = await axios.get(request);
		if (response.data.length == 0) {
			console.log("No disruption\n");
		} else {
			console.log("There's disruption from this station: ");
			console.log(response.data);
		}
	}
	catch (err) {
		console.error(err)
	}
}

findDisruptionfromStation("HUBNWD");
findUpcomingTrains("HUBNWD", "inbound", 2);
