const { xml2js } = require('xml-js');

class Message {
    constructor(id, code, message, time) {
        this.id = id;
        this.code = code;
        this.message = message;
        this.time = time;
    }
    
}

class TimetableHelper {

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
        const trains = xmlResult.elements[0].elements; // Annahme über die Struktur des XML

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
            const result = xml2js(xmlText, { compact: false, ignoreComment: true, spaces: 4 });
            const changedTrains = result.elements[0].elements;
    
            // Die resultierende Liste aktualisierter Züge
            const updatedTrains = trains.map(train => {
                let foundTrain = null;
                const trainChanges = { messages: [] };
    
                // Finde den geänderten Zug, der mit dem aktuellen Zug übereinstimmt
                const changedTrain = changedTrains.find(changed => changed.attributes.id === train.stopId);
                
                if (changedTrain) {
                    foundTrain = train; // Wir haben den Zug gefunden, also verwenden wir das Originalobjekt
    
                    // Gehe durch alle Änderungen für diesen Zug
                    changedTrain.elements.forEach(change => {
                        if (change.name === "dp" || change.name === "ar") {
                            // Ihre vorhandene Logik für "dp" und "ar"
                            const changeType = change.name === "dp" ? "departure" : "arrival";
                            if (change.attributes.ct) trainChanges[changeType] = change.attributes.ct;
                            if (change.attributes.cpth) trainChanges[changeType === "departure" ? "stations" : "passedStations"] = change.attributes.cpth;
                            if (change.attributes.cp) trainChanges.platform = change.attributes.cp;
                        }
                        console.log(change.elements)
                        // Prüfen, ob das 'change'-Element untergeordnete 'elements' enthält und dies ein Array ist
                        if (Array.isArray(change.elements)) {
                            change.elements.forEach(msg => {
                                if (msg.name === "msg") {
                                    // Verwenden der Message-Klasse für jede Nachricht
                                    const newMessage = new Message(
                                        msg.attributes.id,
                                        msg.attributes.c,
                                        this.resolveMessageByCode(parseInt(msg.attributes.c)),
                                        msg.attributes.ts
                                    );
                                    trainChanges.messages.push(newMessage);
                                }
                            });
                        }
                    });
                    
    
                    // Füge die gesammelten Änderungen zum gefundenen Zug hinzu
                    foundTrain.trainChanges = trainChanges;
                }
    
                return foundTrain;
            }).filter(train => train !== null); // Filtere Züge ohne Änderungen aus
    
            return updatedTrains;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    resolveMessageByCode(code) {
        // Pfad zur JSON-Datei, angenommen sie liegt im Verzeichnis "static" relativ zur aktuellen Datei
        const filePath = path.join(__dirname, 'static', 'message_codes.json');
    
        // Synchrones Lesen der JSON-Datei
        const jsonRaw = fs.readFileSync(filePath, { encoding: 'utf8' });
        const messageCodes = JSON.parse(jsonRaw);
    
        // Suche nach dem entsprechenden Code-Objekt
        const codeObject = messageCodes.find(codeObject => codeObject.code === code);
        return codeObject ? codeObject.message : 'Unbekannte Nachricht'; // Gibt eine Standardnachricht zurück, falls der Code nicht gefunden wurde
    }
}

module.exports = TimetableHelper;