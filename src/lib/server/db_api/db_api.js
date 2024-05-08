import ApiAuthentication from './api_auth.js';
import StationHelper from './station_helper.js';
import TimetableHelper from './timetable_helper.js';
import { DB_API_CLIENT_ID, DB_API_CLIENT_SECRET } from '$env/static/private';

// getTraindata will return a List of all trains that are requested by Name

export async function getTraindata() {

    try {
        const auth = new ApiAuthentication(DB_API_CLIENT_ID, DB_API_CLIENT_SECRET);
        const stationHelper = new StationHelper();
        const station = await stationHelper.findStationsByName('Stuttgart');

        if (station && station.length <= 0) {
            console.error('Station nicht gefunden');
            return [];
        }

        const timetableHelper = new TimetableHelper(station[0], auth);

        if(Object.keys(timetableHelper).length === 0 ) {
            console.error('Timetable Helper ist leer');
            return [];
        }

        const timetable = await timetableHelper.getTimetable();

        if(timetable.length <= 0) {
            console.error('Timetable ist leer');
            return [];
        }

        return await timetableHelper.getTimetableChanges(timetable);
    } catch (error) {
        console.error(error);
    }
}


// Function to download data local just for debugging purposes
function createAndDownloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}









