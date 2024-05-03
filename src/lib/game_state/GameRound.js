import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";

export class GameRound {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.playerCount = jsonData.playerCount;
            this.step = jsonData.step;
            this.trains = jsonData.trains;
            this.currentPlayer = jsonData.currentPlayer;
            this.selectedBets = jsonData.selectedBets;
        }
    }

    async createRound(trains) {
        this.step = 0;
        this.currentPlayer = 0;
        this.trains = trains;
        this.selectedBets = [];
    }

    setPlayerCount(playerCount) {
        this.playerCount = playerCount;
    }

    setSelectedTrain(trainId) {
        this.selectedBets[this.currentPlayer] = { trainId : trainId };
    }

    toJson() {
        return JSON.stringify(this);
    }
}