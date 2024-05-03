import {getTraindata} from "$lib/server/db_api/db_api.js";

export const trainsPerRoundCount = 5;

export class Schkubitrains {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);
            this.trains = jsonData.trains;
        } else {
            this.trains = [];
        }
    }

    hasTenMinutesPassed() {
        let currentTime = new Date();
        let timeDifference = currentTime - this.gameRoundStartTime; // This will be in milliseconds
        let tenMinutesInMilliseconds = 10 * 60 * 1000;
        return (timeDifference >= tenMinutesInMilliseconds);
    }

    async updateTrainArray() {
        if (this.trains.length === 0) {
            let fetchedTrains = await getTraindata();
            //console.log("Fetched trains before transformation: ", fetchedTrains);
            this.trains = fetchedTrains.map(this.transformTrainData);
           // console.log("Fetched trains after Cut: ", this.trains);
            this.gameRoundStartTime = new Date();
        }
        if (this.hasTenMinutesPassed()) {
            this.trains = await getTraindata();
            this.gameRoundStartTime = new Date();
            //TODO um Trains kümmern, die nicht verarbeitet werden können
        } else {
            this.trains.splice(0, trainsPerRoundCount);
        }
        return this.trains;
    }

    transformTrainData(train){
        // Create start and end stations strings
        let arrivalStartStation = typeof train.arrival.vonIrgendwoNachStation === 'string'
            ? train.arrival.vonIrgendwoNachStation.split('|')[0] + " -> Stuttgart-HBF"
            : null;

        let departureEndStation = typeof train.departure.abStationNachIrgendwo === 'string'
            ? "Stuttgart-HBF -> " + train.departure.abStationNachIrgendwo.split('|').pop()
            : null;

        // Create messageCodes array
        let arrivalMessages = train.trainChanges?.arrival.ankunftNachricht;
        let departureMessages = train.trainChanges?.departure.abfahrtNachricht;
        let messageCodes = [];

        if (arrivalMessages !== undefined && departureMessages !== undefined) {
            let messages = train.trainChanges?.arrival.ankunftNachricht.concat(train.trainChanges?.departure.abfahrtNachricht);

            for (let i = 0; i < messages.length; i++) {
                if (messages[i] !== undefined) {
                    messageCodes.push(messages[i].message);
                }
            }
        }

        // Return transformed train object
        return {
            i: train.trainID,
            n: train.tripLabel.zugNummer,
            t: train.tripLabel.zugArt,
            a: arrivalStartStation,
            d: departureEndStation,
            m: messageCodes,
        };
    }

    async getTrainArray() {
        await this.updateTrainArray();
        return this.trains.slice(0, trainsPerRoundCount);
    }

    toJson() {
        return JSON.stringify(this);
    }
}