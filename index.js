require('dotenv').config()
api_key = process.env.TFL_API_KEY;
const axios = require('axios');

// const fs = require('fs');

// TODO take the lie-id as an input to the function, so that instead of only allowing people to query against london-overground, they can query against any line

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

var countNumberofOccurencesinArray = function(array, target) {
        count = 0;
        array.forEach(element => {
                if (element == target){
                        count++;
                }
        });
        return count;
}

var countNumberofOccurencesin0thElementofArrayItems = function(array, target) { // instead of iterating through an array of strings, as per countNumberofOccurencesinArray, we're iterating through an array of lists, and checking the 0th item of each list against the target
        count = 0;
        array.forEach(element => {
                if (element[0] == target){
                        count++;
                }
        });
        return count;
}

var findStopPointsforGivenMode = async function (mode) {
	try {
		request = "https://api.tfl.gov.uk/StopPoint/Mode/" + mode; // as elsewhere, providing the API key causes trouble, so omit it.
		response = await axios.get(request);
		// console.log(response.data.stopPoints);
		array_to_return = [];
		for (individual_station of response.data.stopPoints){
			if (countNumberofOccurencesin0thElementofArrayItems(array_to_return, individual_station.commonName) == 0 ) { // if this station is not already in our list
				array_to_return.push([individual_station.commonName, individual_station.id, individual_station.modes]);
			}
		}
		//console.log(array_to_return);
		return array_to_return;
	} catch (err) {
		console.error(err);
	}
	
}

var give_list_of_stoppoint_info = async function (mode){
	list_of_stoppoints = await findStopPointsforGivenMode(mode);	
	//console.log(list_of_stoppoints)
	return list_of_stoppoints;
}

var give_all_lists_of_stoppoint_info_across_the_three_modes = async function () {
	list_of_stoppoints = [];
	tube_stoppoints_to_add = await findStopPointsforGivenMode("tube");	
	for (item of tube_stoppoints_to_add) {
		list_of_stoppoints.push(item);
	}
	overground_stoppoints_to_add = await findStopPointsforGivenMode("overground");	
	for (item of overground_stoppoints_to_add) {
		if (countNumberofOccurencesin0thElementofArrayItems(list_of_stoppoints, item[0]) == 0){ // if this station name is not present already`
			list_of_stoppoints.push(item);
		}
	}
	elizabeth_line_stoppoints_to_add = await findStopPointsforGivenMode("elizabeth-line");	
	for (item of elizabeth_line_stoppoints_to_add) {
		if (countNumberofOccurencesin0thElementofArrayItems(list_of_stoppoints, item[0]) == 0){ // if this station name is not present already`
			list_of_stoppoints.push(item);
		}
	}
	list_of_stoppoints.sort();
	
	//console.log(list_of_stoppoints);
	//for (line of list_of_stoppoints){
	//	console.log(line)
	//}
	return list_of_stoppoints;
}

var findDisruptiontomyJourney = async function () {
	await findDisruptionfromStation("HUBNWD");
	await findUpcomingTrains("HUBNWD", "inbound", 2, 15);
}	

var writeDatatoDisk = async function (content_to_write) {
	const createCsvWriter = require('csv-writer').createArrayCsvWriter;
	const csvWriter = createCsvWriter({
		header: ['Station', 'id', 'modes'],
		path: 'latest_station_data.csv'
	});
	csvWriter.writeRecords(content_to_write)
		.then(() => {
			console.log('latest_station_data.csv written');
		});
}

var findAllStopPointsandWritetoDisk = async function () {
	list_of_stoppoints_to_store = await give_all_lists_of_stoppoint_info_across_the_three_modes();
	writeDatatoDisk(list_of_stoppoints_to_store);	
}

//findDisruptiontomyJourney();

findAllStopPointsandWritetoDisk();