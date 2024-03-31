import 'https://unpkg.com/xml-js/dist/xml-js.min.js';

class Message {
    constructor(id, code, message, time) {
        this.id = id;
        this.code = code;
        this.message = message;
        this.time = time;
    }
}

export default class TimetableHelper {

    constructor(station, apiAuthentication) {
        this.station = station;
        this.apiAuthentication = apiAuthentication;
    }

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

    async getTimetable(hour = null) {
        const trainList = [];
        const xmlText = await this.getTimetableXML(hour);
        const xmlResult = xml2js(xmlText, { compact: false, spaces: 4 });
        const trains = xmlResult.elements[0].elements;

        trains.forEach(train => {
            let tripLabelObject = null;
            let arrivalObject = null;
            let departureObject = null;

            train.elements.forEach(trainDetail => {
                if (trainDetail.name === "tl") {
                    tripLabelObject = trainDetail.attributes;
                } else if (trainDetail.name === "dp") {
                    departureObject = trainDetail.attributes;
                } else if (trainDetail.name === "ar") {
                    arrivalObject = trainDetail.attributes;
                }
            });

            if (!departureObject) {
                // Ankunft ohne Abfahrt, weiter zum nächsten Zug
                return;
            }

            const trainObject = {
                stopId: train.attributes.id,
                trainType: tripLabelObject.c,
                trainNumber: tripLabelObject.n,
                platform: departureObject.pp,
                stations: departureObject.ppth,
                departure: departureObject.pt,
            };

            if ("f" in tripLabelObject) {
                trainObject.tripType = tripLabelObject.f;
            }

            if ("l" in departureObject) {
                trainObject.trainLine = departureObject.l;
            }

            if (arrivalObject) {
                trainObject.passedStations = arrivalObject.ppth;
                trainObject.arrival = arrivalObject.pt;
            }

            trainList.push(trainObject);
        });

        return trainList;
    }

    // BITTE FIXEN DANKE
    async getTimetableChanges(trains) {
        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/${this.station.EVA_NR}`;
        const headers = this.apiAuthentication.getHeaders();
    
        try {
            const response = await fetch(url, { headers });
            const xmlText = await response.text();
    
            if (!response.ok) throw new Error(`Request failed with status: ${response.status}`);
    
            // Konvertiere XML in ein JavaScript-Objekt
            const result = await xml2js(xmlText, { compact: false, ignoreComment: true, spaces: 4 });
            const changedTrains = result.elements[0].elements;
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
    
                    // Füge die gesammelten Änderungen zum gefundenen Zug hinzu
                    train.trainChanges = trainChanges;
                    return train;
                }
    
                return null;
            });
    
            const updatedTrains = await Promise.all(updatedTrainsPromises);
            return updatedTrains.filter(train => train !== null);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    

    async resolveMessageByCode(code) {
        try {
            const response = await fetch('./db_api/static/message_codes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const messageCodes = await response.json();

            // Suche nach dem entsprechenden Code-Objekt
            const codeObject = messageCodes.find(codeObject => codeObject.code === code);
            return codeObject ? codeObject.message : 'Unbekannte Nachricht';
        } catch (error) {
            console.error("Fehler beim Laden der Nachrichtencodes:", error);
            return 'Fehler beim Abrufen der Nachricht';
        }
    }
}
