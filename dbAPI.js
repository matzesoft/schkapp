import ApiAuthentication from './db_api/api_auth.js';
import StationHelper from './db_api/station_helper.js';
import TimetableHelper from './db_api/timetable_helper.js';

async function getTraindata() {
    try {
        const auth = new ApiAuthentication("5fd2b016e4dd99c7b316b1e0b0237c0e", "f51572fc813c9361325535f47c17ea2d");
        const stationHelp = new StationHelper();
        const station = await stationHelp.findStationsByName('Stuttgart Hbf');
        const timetableHelper = new TimetableHelper(station[0], auth);
        const timetable = await timetableHelper.getTimetable();
        var timetableChanges = await timetableHelper.getTimetableChanges(timetable);
        console.log(printTrainDetailsAsJSON(timetableChanges))
    } catch (error) {
        console.error(error);
    }
}

function printTrainDetailsAsJSON(data) {
    const result = data.map(train => ({
        "StopId": train.stopId ?? '-',
        "Zugtyp": train.trainType ?? '-',
        "Zugnummer": train.trainNumber ?? '-',
        "Plattform": train.platform ?? '-',
        "Stationen": train.stations ? train.stations.split('|').join(', ') : '-',
        "Abfahrt": train.departure ? formatDate(train.departure) : '-',
        "Reiseart": train.tripType ?? 'Unbekannt',
        "Zuglinie": train.trainLine ?? '-',
        "Änderungen": train.trainChanges?.messages?.length > 0 ?
            train.trainChanges.messages.map((message, msgIndex) => ({
                [`Nachricht Nr. ${msgIndex + 1}`]: {
                    "code": message.code ?? '-',
                    "message": message.message ?? '-',
                    "time": message.time ? formatDate(message.time) : '-'
                }
            })) : [{"Keine": "-"}]
    }));

    return JSON.stringify(result, null, 2);
}
function printTrainMessagesAsJSON(data) {
    const result = data.map(train => ({
        "Messages": train.trainChanges?.messages?.length > 0 ?
            train.trainChanges.messages.map(message => message.message ?? '-') : ["Keine Nachrichten"]
    }));

    return JSON.stringify(result, null, 2);
}



// Func to download data local
function createAndDownloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Date converter
function formatDate(s) {
    if (s.length !== 10) {
        throw new Error("Der String muss genau 10 Zeichen lang sein.");
    }

    const year = parseInt(s.substring(0, 2), 10) + 2000;
    const month = parseInt(s.substring(2, 4), 10) - 1;
    const day = parseInt(s.substring(4, 6), 10);
    const hour = parseInt(s.substring(6, 8), 10);
    const minute = parseInt(s.substring(8, 10), 10);

    return new Date(year, month, day, hour, minute).toLocaleString();
}

// Button to test functions
document.getElementById('helloButton').addEventListener('click', async () => {
    try {
        await getTraindata();
    } catch (error) {
        console.error('Fehler beim Abrufen des Fahrplans:', error);
    }
});




