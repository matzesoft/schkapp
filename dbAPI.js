import ApiAuthentication from './api_auth.js';
import StationHelper from './station_helper.js';
import TimetableHelper from './timetable_helper.js';



async function processTimetable() {
    try {
        // Holt den aktuellen Fahrplan
        const auth = new ApiAuthentication("5fd2b016e4dd99c7b316b1e0b0237c0e", "f51572fc813c9361325535f47c17ea2d");
        const stationHelp = new StationHelper();
        const station = await stationHelp.findStationsByName('Berlin');
        const timetableHelper = new TimetableHelper(station[0], auth);
        const timetable = await timetableHelper.getTimetable(); 
              
        // Holt die Änderungen zum Fahrplan und druckt sie
        // Funktioniert nicht guck timetable_helper.js
        var timetableChanges = await timetableHelper.getTimetableChanges(timetable);
        console.log(printTrainDetailsAsJSONSafe(timetableChanges))
    } catch (error) {
        console.error(error);
    }
}

function printTrainDetailsAsJSONSafe(data) {
    const result = data.map(train => ({
        "StopId": train.stopId ?? '-',
        "Zugtyp": train.trainType ?? '-',
        "Zugnummer": train.trainNumber ?? '-',
        "Plattform": train.platform ?? '-',
        "Stationen": train.stations ? train.stations.split('|').join(', ') : '-',
        "Abfahrt": train.departure ? new Date(parseInt(train.departure)).toLocaleString() : '-',
        "Reiseart": train.tripType ?? 'Unbekannt',
        "Zuglinie": train.trainLine ?? '-',
        "Änderungen": train.trainChanges?.messages?.length > 0 ?
            train.trainChanges.messages.map((message, msgIndex) => ({
                [`Nachricht Nr. ${msgIndex + 1}`]: {
                    "code": message.code ?? '-',
                    "message": message.message ?? '-',
                    "time": message.time ? new Date(parseInt(message.time)).toLocaleString() : '-'
                }
            })) : [{"Keine": "-"}]
    }));

    return JSON.stringify(result, null, 2);
}

//Funktion wenn man daten downloaden will 
function createAndDownloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//Datum konverter
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

// Test Button welcher das processTimetable() startet
document.getElementById('helloButton').addEventListener('click', async () => {
    try {
        await processTimetable();
    } catch (error) {
        console.error('Fehler beim Abrufen des Fahrplans:', error);
    }
});




