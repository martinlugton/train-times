require('dotenv').config()
api_key = process.env.TFL_API_KEY;
const axios = require('axios');

var findUpcomingTrains= async function (departing_station_id, inbound_or_outbound, number_of_trains_to_return, length_of_walk_to_station) {
    try {
	request = "https://api.tfl.gov.uk/Line/london-overground/Arrivals/" + departing_station_id + "?direction=" + inbound_or_outbound + "&api_key=" + api_key;
        response = await axios.get(request);
        //console.log(response.data);
        number_of_trains_returned = 0;
        for (const result_item of response.data) {
		time_in_minutes_to_arrival = result_item.timeToStation/60;
                time_in_minutes_to_arrival = time_in_minutes_to_arrival.toFixed(0);
                if ((number_of_trains_returned < number_of_trains_to_return) && (time_in_minutes_to_arrival > length_of_walk_to_station)) {
                        console.log(result_item.destinationName + " in " + time_in_minutes_to_arrival + " minutes\n");
                        //console.log("Platform: " + result_item.platformName);
			number_of_trains_returned++;
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
		} else { // TODO check that this loop references the data returned correctly
			console.log("There's disruption from this station: ");
			console.log(response.data);
			console.log("Name: " + response.data[0].commonName);
			console.log("Description: " + response.data[0].description);
			console.log("Type: " + response.data[0].type);
			console.log("Mode: " + response.data[0].mode);
			console.log("Appearance: " + response.data[0].appearance);
			console.log("Additional information: " + response.data[0].additionalInformation);
		}
	}
	catch (err) {
		console.error(err)
	}
}

var findDisruptiontomyJourney = async function () {
	await findDisruptionfromStation("HUBNWD");
	await findUpcomingTrains("HUBNWD", "inbound", 2, 15);

}	

findDisruptiontomyJourney();
