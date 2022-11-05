import { Stop , Position } from './types';

const MBTA = require('../node_modules/mbta-client/index.js');
const API_KEY = '7226f7ee55514c019819bac6eacdaad9';
const mbta = new MBTA(API_KEY);


function _compareDates(a: Date, b: Date): Date {
    // compares two Date objects and returns the lowest of the two
    if (a.getTime() > b.getTime()) {
        return b
    } else if (a.getTime() < b.getTime()) {
        return a
    } else {
        return b
    }
}


async function fetchStops(name: string) {
    return await mbta.fetchStopsByRoute(name)
        .then((response: Stop[]) => {
            let stops: Set<string> = new Set([]);
            response.map(response_item  => {
                stops.add(response_item.id);
            })
            return stops
        })
}


async function _fetchNextTrainTime(stop_id: string, direction_id: number) {
    const handleResponse = (res?: any) => {
        // filter for upcoming train times that have a valid timestamp
        var times = res.data.map((d: any) => {
            if (d.attributes.arrival_time != null) {
                var timestamp = new Date(d.attributes.arrival_time);

                if (timestamp.getTime() > Date.now()) {
                    return timestamp
                }
            }
        }).filter((d: any) => d != null);

        // find the soonest arriving train predicted to be arriving
        var nearestArrival = null;
        for (var timestamp of times) {
            if (nearestArrival != null) {
                nearestArrival = _compareDates(timestamp, nearestArrival);
            } else {
                nearestArrival = timestamp;
            }
        }

        // returns the soonest arriving train timestamp (returns 'null' if station unavailable)
        return nearestArrival
    }

    return await mbta.fetchPredictions({stop: stop_id, sort:"arrival_time", limit:10, direction_id:direction_id}).then((res?: any) => handleResponse(res));
}

async function fetchStopData(ref: Position) {
    // Make a request for next train times for the currently selected stop for both directions and assign the promises
    const responseA = _fetchNextTrainTime(ref.name, 0);
    const responseB = _fetchNextTrainTime(ref.name, 1);

    // Make a request for the current selected stops full stop info and assign the promise
    const responseC = mbta.fetchStops({id:ref.name});
    
    // Set default output to prevent type errors within other components
    var result = {right: null, left: null, name: null};

    // Once all three promises are fulfilled, assign the result
    result = await Promise.all([responseA, responseB, responseC]).then(res => {
        return {
            right: res[0],
            left: res[1],
            name: res[2].data[0].attributes.name
        }
    })

    // If the Promise is unable to be fulfilled, the output will be the default result
    return result
}

export { fetchStops , fetchStopData };