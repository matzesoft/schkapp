import { xml2js } from "xml-js";

class Message {
    constructor(id, code, message, time) {
        this.id = id;
        this.code = code;
        this.message = message;
        this.time = time;
    }
}

class Trainold {
    constructor(stop_id, trip_type, train_type, train_number, train_line, platform, passed_stations, stations, arrival, departure, train_changes) {
        this.stop_id = stop_id;
        this.trip_type = trip_type;
        this.train_type = train_type;
        this.train_number = train_number;
        this.train_line = train_line;
        this.platform = platform;
        this.passed_stations = passed_stations;
        this.stations = stations;
        this.arrival = arrival;
        this.departure = departure;
        this.train_changes = train_changes;
    }
}


export default class TimetableHelper {

    constructor(station, apiAuthentication) {
        this.station = station;
        this.apiAuthentication = apiAuthentication;
    }
    // done
    async getTimetableXML(hour = null, date = null) {
        let hourDate = new Date();
        if (hour !== null) {
            hourDate.setHours(hour, 0, 0, 0);
        }
        let dateString = date ? date.toISOString().slice(2, 10).replace(/-/g, '') : new Date().toISOString().slice(2, 10).replace(/-/g, '');
        let hourString = hourDate.getHours().toString().padStart(2, '0');

        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/${this.station.EVA_NR}/${dateString}/${hourString}`;
        const headers = this.apiAuthentication.getHeaders();

        try {
            const response = await fetch(url, { headers });
            if (response.status === 410) {
                // Versucht erneut mit dem nächsten Tag, wenn die Ressource verschwunden ist (Status 410)
                const nextDay = new Date(hourDate);
                nextDay.setDate(hourDate.getDate() + 1);
                return this.getTimetableXML(parseInt(hourString), nextDay);
            } else if (response.status === 401) {
                throw new Error("Can't request timetable because the credentials are not correct. Please make sure you are providing the correct credentials.");
            } else if (response.status !== 200) {
                throw new Error(`Can't request timetable! The request failed with the HTTP status code ${response.status}: ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    // done
    async getTimetable(hour = null) {
        // Get train data
        const timetableXML = await this.getTimetableXML(hour);

        // convert into Json
        const timetableJSON = await this.convertXMLintoJSON(timetableXML);
        const allTrainsFromStation = timetableJSON.elements[0].elements;
        const betterTrainList = []

        // Convert JSON into something readable
        allTrainsFromStation.forEach(train => {
            // Initialize the objects for this train's data
            const trainObj = {
                trainID: train.attributes.id,
                tripLabel: {},
                departure: {},
                arrival: {}
            };

            // Process each element related to the train
            train.elements.forEach(element => {
                if (element.name === "tl") {
                    // Collect train type and number
                    trainObj.tripLabel.zugArt = element.attributes.c;
                    trainObj.tripLabel.zugNummer = element.attributes.n;
                } else if (element.name === "dp") {
                    // Collect departure data
                    trainObj.departure.haltetInStation = element.attributes.ppth;
                    trainObj.departure.ankunft = this.formatDate(element.attributes.pt);
                } else if (element.name === "ar") {
                    // Collect arrival data
                    trainObj.arrival.faehrtAbStation = element.attributes.ppth;
                    trainObj.arrival.abfahrt = this.formatDate(element.attributes.pt);
                }
            });
            // After all elements of this train are processed, add to list
            betterTrainList.push(trainObj);
        });
        return betterTrainList;
    }
    // work in Progress
    async getTimetableChanges(listOfTrains) {
        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/${this.station.EVA_NR}`;
        const headers = this.apiAuthentication.getHeaders();

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`Request failed with status: ${response.status}`);

            const timetableChangesXML = await response.text();
            const timetableChangesJSON = await this.convertXMLintoJSON(timetableChangesXML);
            const allTrainsFromStationWithChanges = timetableChangesJSON.elements[0].elements;

            console.log(allTrainsFromStationWithChanges)

            allTrainsFromStationWithChanges.forEach(change => {
                if (change.attributes === listOfTrains)
                return
                }
            )
        } catch (error) {
            console.error(error);
            throw error;
        }





        /* const changedTrainPromises = trains.map(async (train) => {
            // Sie können hier das async entfernen, wenn Sie innerhalb der Funktion keine weiteren Promises benutzen.
            const changedTrain = changedTrains.find(changed => {
                //console.log(changed.attributes.id === train.stopId);
                return changed.attributes.id === train.stopId;
            });

            if (!changedTrain) {
                //console.log("No matching changed train found for stop ID:", train.stopId);
                return null; // oder anderweitig diesen Fall behandeln
            }

            return changedTrain;
        }); */
        /* 
                    // Warten auf das Auflösen aller Promises
                    Promise.all(changedTrainPromises).then((changedTrains) => {
        
                    });
        
                    // Die resultierende Liste aktualisierter Züge
                    const updatedTrainsPromises = trains.map(async (train) => {
        
        
                        const trainChanges = { messages: [] };
                        const changedTrain = changedTrains.find(changed => changed.attributes.id === train.stopId);
        
                        if (changedTrain) {
                            // Verarbeite alle Änderungen für diesen Zug asynchron
                            const changePromises = changedTrain.elements.map(async (change) => {
        
                                if (change.name === "dp" || change.name === "ar") {
                                    const changeType = change.name === "dp" ? "departure" : "arrival";
                                    if (change.attributes.ct) trainChanges[changeType] = change.attributes.ct;
                                    if (change.attributes.cpth) trainChanges[changeType === "departure" ? "stations" : "passedStations"] = change.attributes.cpth;
                                    if (change.attributes.cp) trainChanges.platform = change.attributes.cp;
                                }
        
                                if (Array.isArray(change.elements)) {
                                    const messagePromises = change.elements.map(async (msg) => {
                                        if (msg.attributes) {
                                            const resolvedMessage = await this.resolveMessageByCode(parseInt(msg.attributes.c));
                                            return new Message(
                                                msg.attributes.id,
                                                msg.attributes.c,
                                                resolvedMessage,
                                                msg.attributes.ts
                                            );
                                        }
                                    });
                                    const messages = await Promise.all(messagePromises);
                                    trainChanges.messages.push(...messages.filter(msg => msg !== undefined));
                                }
                            });
        
                            await Promise.all(changePromises);
                            train.trainChanges = trainChanges;
                            return train;
                        }
        
                        return null;
                    });
        
                    const updatedTrains = await Promise.all(updatedTrainsPromises);
                    return updatedTrains.filter(train => train !== null); */
    }
    // done
    async convertXMLintoJSON(xmlText) {
        const options = {
            compact: false,
            ignoreComment: true,
            spaces: 4
        };

        const jsonResult = xml2js(xmlText, options);
        return jsonResult
    }
    // done
    async resolveMessageByCode(code) {
        try {
            const response = await fetch('./db_api/static/message_codes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const messageCodes = await response.json();

            // searching code from json
            const codeObject = messageCodes.find(codeObject => codeObject.code === code);
            return codeObject ? codeObject.message : 'Unbekannte Nachricht';
        } catch (error) {
            console.error("Fehler beim Laden der Nachrichtencodes:", error);
            return 'Fehler beim Abrufen der Nachricht';
        }
    }
    // done
    formatDate(s) {
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
}
