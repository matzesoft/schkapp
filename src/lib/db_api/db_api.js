import ApiAuthentication from './api_auth.js';
import StationHelper from './station_helper.js';
import TimetableHelper from './timetable_helper.js';

// getTraindata will return a List of all trains that are requestet by Name

export async function getTraindata() {

    try {
        const auth = new ApiAuthentication("5fd2b016e4dd99c7b316b1e0b0237c0e", "f51572fc813c9361325535f47c17ea2d");
        const stationHelper = new StationHelper();
        const station = await stationHelper.findStationsByName('Stuttgart');

        if (station && station.length <= 0) {
            console.error('Station nicht gefunden');
            return [];
        };

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

        const timetableChanges = await timetableHelper.getTimetableChanges(timetable);

        console.log(timetableChanges)
        return timetableChanges;

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









