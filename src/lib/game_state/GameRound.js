import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";

export class GameRound {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.playerCount = jsonData.playerCount;
            this.step = jsonData.step;
            this.trains = jsonData.trains;
        }
    }

    async createRound(trains, playerCount) {
        this.step = 0;
        this.playerCount = playerCount;

        // Store trains to use for this round
        this.trains = trains;
    }

    toJson() {
        return JSON.stringify({
            playerCount: this.playerCount,
            step: this.step,
            trains: this.trains
        });
    }
}