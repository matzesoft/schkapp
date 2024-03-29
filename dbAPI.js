const ApiAuthentication = require('./api_auth');
const StationHelper = require('./station_helper');
const TimetableHelper = require('./timetable_helper');
const fs = require('fs');


const auth = new ApiAuthentication("5fd2b016e4dd99c7b316b1e0b0237c0e", "f51572fc813c9361325535f47c17ea2d");
const stationHelp = new StationHelper();
const station = stationHelp.findStationsByName('Stuttgart')[0];
const timetableHelper = new TimetableHelper(station, auth);
const testListTrain= [{
    stopId: '-8360927856038783083-2403291647-1',
    trainType: 'MEX',
    trainNumber: '19425',
    platform: '13',
    stations: 'Stuttgart-Bad Cannstatt|Waiblingen|Schorndorf|Urbach(b Schorndorf)|Plüderhausen|Waldhausen(b Schorndorf)|Lorch(Württ)|Schwäbisch Gmünd|Böbingen(Rems)|Mögglingen(Gmünd)|Aalen Hbf',
    departure: '2403291647',
    trainLine: '13'
  }
]

async function processTimetable() {
    try {
        // Holt den aktuellen Fahrplan
        var timetable = await timetableHelper.getTimetable();
        printTrainList("timetableJS.txt", timetable);

        // Holt die Änderungen zum Fahrplan und druckt sie
        // BITTE FIXEN DANKE
        var timetableChanges = await timetableHelper.getTimetableChanges(timetable);
        printTrainList("timetableChangesJS.txt", timetableChanges);
    } catch (error) {
        // Fängt Fehler sowohl von getTimetable als auch von getTimetableChanges auf
        console.error(error);
    }
}




function printTrainList(filename, trainList) {
    let fileContent = '';

    trainList.forEach(train => {
        // Verwendung von Template-Strings und Anpassung an die korrekten Schlüsselnamen
        fileContent += `-> ${train.trainType}:\n`;
        fileContent += `Stop ID: ${train.stopId}\n`;
        fileContent += train.tripType ? `Trip Type: ${train.tripType}\n` : '';
        fileContent += `Train Number: ${train.trainNumber}\n`;
        fileContent += train.trainLine ? `Train Line: ${train.trainLine}\n` : '';
        fileContent += `Platform: ${train.platform}\n`;
        fileContent += train.passedStations ? `Passed Stations: ${train.passedStations}\n` : '';
        fileContent += `Stations: ${train.stations}\n`;
        fileContent += train.arrival ? `Arrival: ${stringToDatetime(train.arrival)}\n` : '';
        fileContent += train.departure ? `Departure: ${stringToDatetime(train.departure)}\n` : '';

        // Der Train Changes Teil ist hier ausgelassen, da er in den Beispielobjekten nicht enthalten ist
        fileContent += '\n';
    });

    fs.writeFileSync(filename, fileContent);
}
function stringToDatetime(s) {
    if (s.length !== 10) {
        throw new Error("Der String muss genau 10 Zeichen lang sein.");
    }

    const year = parseInt(s.substring(0, 2), 10) + 2000;
    const month = parseInt(s.substring(2, 4), 10) - 1; // JS Monate starten bei 0
    const day = parseInt(s.substring(4, 6), 10);
    const hour = parseInt(s.substring(6, 8), 10);
    const minute = parseInt(s.substring(8, 10), 10);

    return new Date(year, month, day, hour, minute);
}


//MAIN

processTimetable();


