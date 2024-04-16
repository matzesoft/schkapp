import ApiAuthentication from './api_auth.js';
import StationHelper from './station_helper.js';
import TimetableHelper from './timetable_helper.js';

export async function getTraindata() {
    
    try {
        const auth = new ApiAuthentication("5fd2b016e4dd99c7b316b1e0b0237c0e", "f51572fc813c9361325535f47c17ea2d");
        const stationHelp = new StationHelper();
        const station = await stationHelp.findStationsByName('Stuttgart');
        
        if(station){
            const timetableHelper = new TimetableHelper(station[0], auth);
            
            const timetable = await timetableHelper.getTimetable();
            
            const timetableChanges = await timetableHelper.getTimetableChanges(timetable);
            console.log(timetableChanges)
        } else {
            console.error('Station nicht gefunden')
        }
        
        
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
        "Abfahrt": train.departure ? (train.departure) : '-',
        "Reiseart": train.tripType ?? 'Unbekannt',
        "Zuglinie": train.trainLine ?? '-',
        "Änderungen": train.trainChanges?.messages?.length > 0 ?
            train.trainChanges.messages.map((message, msgIndex) => ({
                [`Nachricht Nr. ${msgIndex + 1}`]: {
                    "code": message.code ?? '-',
                    "message": message.message ?? '-',
                    "time": message.time ? (message.time) : '-'
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







