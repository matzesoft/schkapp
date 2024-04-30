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
        if(this.hasTenMinutesPassed()){
            this.trains = await getTraindata();
            this.gameRoundStartTime = new Date();
            console.log(this.trains[0].trainID);
            //TODO um Trains kümmern, die nicht verarbeitet werden können
        }else {
            trains.splice(0, trainsPerRoundCount);
        }

        return this.trains;
    }

    getTrainArray() {
        this.updateTrainArray()
        let firstFiveTrains = this.trains.slice(0, trainsPerRoundCount);
        return firstFiveTrains;
    }




    toJson() {
        return JSON.stringify({
            playerCount: this.playerCount,
            step: this.step
        });
    }
}