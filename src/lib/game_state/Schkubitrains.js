import {getTraindata} from "$lib/server/db_api/db_api.js";
import {trainsPerRoundCount} from "$lib/constants.js";

export class Schkubitrains {
    static cookieName = 'schkubitrains';

    constructor(cookies = undefined) {
        this.trains = [];

        if (cookies) {
            if (cookies.get(Schkubitrains.cookieName)) {
                let jsonData = JSON.parse(cookies.get(Schkubitrains.cookieName));
                this.gameRoundStartTime = jsonData.gRST;
            }

            let trainId = 0;
            while (cookies.get(Schkubitrains.cookieName + trainId)) {
                let train = JSON.parse(cookies.get(Schkubitrains.cookieName + trainId));
                this.trains.push(train);
                trainId += 1;
            }
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
            this.trains = fetchedTrains.map((train, index) => this.transformTrainData(train, index));
            this.gameRoundStartTime = new Date();
            //console.log(this.trains);
        }
        if (this.hasTenMinutesPassed()) {
            this.trains = await getTraindata();
            this.gameRoundStartTime = new Date();
        } else {
            this.trains.splice(0, trainsPerRoundCount);
        }
        return this.trains;
    }

    transformTrainData(train, inderIndex){
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

        return {
            i: inderIndex,
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

    // Stores each train in a separate cookie
    storeInCookies(cookies) {
        let jsonData = JSON.stringify({ gRST: this.gameRoundStartTime });
        cookies.set(Schkubitrains.cookieName, jsonData, { path: '/' });

        for (let i = 0; i < this.trains.length; i++) {
            let schkubitrain = JSON.stringify(this.trains[i]);
            cookies.set(Schkubitrains.cookieName + i, schkubitrain, { path: '/' });
        }
    }
}