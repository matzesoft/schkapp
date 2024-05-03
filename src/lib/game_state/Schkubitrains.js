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
            console.log("Fetched trains after Cut: ", this.trains);
            this.gameRoundStartTime = new Date();
        }
        if(this.hasTenMinutesPassed()){
            this.trains = await getTraindata();
            this.gameRoundStartTime = new Date();
            //TODO um Trains kümmern, die nicht verarbeitet werden können
        }else {
            this.trains.splice(0, trainsPerRoundCount);
        }
        return this.trains;
    }

    transformTrainData(train){
        let arrivalStartStation = typeof train.arrival.vonIrgendwoNachStation === 'string'
            ? train.arrival.vonIrgendwoNachStation.split('|')[0] + " -> Stuttgart-HBF"
            : null;

        let departureEndStation = typeof train.departure.abStationNachIrgendwo === 'string'
            ? "Stuttgart-HBF -> " + train.departure.abStationNachIrgendwo.split('|').pop()
            : null;

        let test = JSON.stringify(train.trainChanges?.arrival.ankunftNachricht);

        let message = train.trainChanges?.arrival.ankunftNachricht;

        //if message === undefined {

        for (let i = 0; i < message.length; i++) {
            console.log(message[i].message);
        }




        return{
            id: train.trainID,
            number: train.tripLabel.zugNummer,
            trainType: train.tripLabel.zugArt,
            arrivalStartStation: arrivalStartStation,
            departureEndStation: departureEndStation,
            message: message,
            test : test
            //arrivalTime: arrivalTime,
            //departureTime: departureTime,
            //newArrivalTime: train.trainChanges?.arrival.neueAnkunftszeit,
            //newDepartureTime: train.trainChanges?.departure.neueAbfahrtsZeit,
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