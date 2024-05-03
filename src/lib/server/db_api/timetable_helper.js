import { xml2js } from "xml-js";
import { message_codes } from "./static/message_codes";

export default class TimetableHelper {

    constructor(station, apiAuthentication) {
        this.station = station;
        this.apiAuthentication = apiAuthentication;
    }

    /* getTimetableXML asks DB API for the timetable for the current time and date
    DB API will return a XML file with the timetable */
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

    // getTimetable will start getTimetableXML and convert the XML into JSON
    async getTimetable(hour = null) {

        // Get train data
        const timetableXML = await this.getTimetableXML(hour);

        // convert into Json
        const timetableJSON = await this.convertXMLintoJSON(timetableXML);
        const allTrainsFromStation = timetableJSON.elements[0].elements;
        const betterTrainList = []

        // Convert JSON into something readable
        allTrainsFromStation.forEach(train => {
            // Initialize the objects for this trains data
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
                    trainObj.departure.abStationNachIrgendwo = element.attributes.ppth;
                    trainObj.departure.abfahrtAbStation = this.formatDate(element.attributes.pt);
                } else if (element.name === "ar") {
                    // Collect arrival data
                    trainObj.arrival.vonIrgendwoNachStation = element.attributes.ppth;
                    trainObj.arrival.ankunftInStation = this.formatDate(element.attributes.pt);
                }
            });
            // After all elements of this train are processed add to list
            betterTrainList.push(trainObj);
        });
        return betterTrainList;
    }

    /* getTimetableChanges gets from the API the changes for the current Station
    Compares the Changes with the current Trains and merges them */
    async getTimetableChanges(listOfTrains) {
        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/${this.station.EVA_NR}`;
        const headers = this.apiAuthentication.getHeaders();
        const changesTrainList = []

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`Request failed with status: ${response.status}`);
            const timetableChangesXML = await response.text();
            const timetableChangesJSON = await this.convertXMLintoJSON(timetableChangesXML);
            const allTrainsFromStationWithChanges = timetableChangesJSON.elements[0].elements;

            // create a idMap so its faster to merge 
            let trainIdMap = listOfTrains.reduce((acc, obj) => {
                acc[obj.trainID] = obj;
                return acc;
            }, {});    

            // Collecting from API specifig Changes and push it into a changesTrainList
            allTrainsFromStationWithChanges.forEach(train => {
                const changesObj = {
                    trainID: train.attributes.id,
                    changeMessage: {},
                    departure: {},
                    arrival: {}
                };
                
                train.elements?.forEach(async element => {
                    if (element.name === "m") {
                        changesObj.changeMessage.info = element.attributes.cat;
                    } else if (element.name === "dp") { 
                        changesObj.departure.neueAbfahrtsZeit = element.attributes?.ct ? this.formatDate(element.attributes.ct) : {};
                        changesObj.departure.abfahrtNachricht = await this.messageResolver(element.elements);
                    } else if (element.name === "ar") {
                        changesObj.arrival.neueAnkunftszeit = element.attributes?.ct ? this.formatDate(element.attributes.ct) : {};
                        changesObj.arrival.ankunftNachricht = await this.messageResolver(element.elements);
                    }

                })
                changesTrainList.push(changesObj);
                }
            )
            // compare current Trains with the changesTrainList and merge the changes into the normal Train
            changesTrainList.forEach(element => {
                let id = element.trainID;
                if (trainIdMap.hasOwnProperty(id)) {
                    trainIdMap[id].trainChanges = element;
                }
            });
            return listOfTrains;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Converts XML into JSON
    async convertXMLintoJSON(xmlText) {
        const options = {
            compact: false,
            ignoreComment: true,
            spaces: 4
        };

        const jsonResult = xml2js(xmlText, options);
        return jsonResult
    }

    async resolveMessageByCode(code) {
        try {
            // searching code from json
            const codeObject = message_codes.find(codeObject => codeObject.code == code);
            return codeObject ? codeObject.message : 'Unbekannte Nachricht';
        } catch (error) {
            console.error("Fehler beim Laden der Nachrichtencodes:", error);
            return 'Fehler beim Abrufen der Nachricht';
        }
    }
    // Convfer the date into a readable format
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
    // Overall resolver for the messages by using the resolveMessageByCode and formatDate
    async messageResolver(messageList){
        const betterMessageList = []

        messageList?.forEach(async element => {
            const betterMessageObj = {}
            
            betterMessageObj.message = element.attributes.c;
            
            betterMessageObj.randomTime = this.formatDate(element.attributes.ts);
            betterMessageList.push(betterMessageObj);
        })
        return betterMessageList


    }
}
