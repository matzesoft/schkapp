import {chooseBetStep, choosePlayerCountStep, chooseTrainStep, resultsStep} from "$lib/constants.js";

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
        this.setStep(choosePlayerCountStep);
        this.currentPlayer = 0;
        this.trains = trains;
        this.selectedBets = [];

        console.log(this.currentPlayer);
    }

    setStep(step) {
        if (step < 0 || step > 3) {
            throw new Error("Invalid step");
        }
        this.step = step;
    }

    setPlayerCount(playerCount) {
        if (playerCount < 1 && playerCount > 10) {
            throw new Error("Invalid player count");
        }
        this.playerCount = playerCount;
        this.setStep(chooseTrainStep);
    }

    setSelectedTrainForCurrentPlayer(trainId) {
        this.selectedBets[this.currentPlayer] = { trainId : trainId };
        this.setStep(chooseBetStep);
    }

    setSelectedBetForCurrentPlayer(bet) {
        // TODO: Add bet to bets array
        //this.selectedBets[this.currentPlayer] = bet;

        if (this.currentPlayer === this.playerCount-1) {
            this.setStep(resultsStep);
        } else {
            this.setStep(chooseTrainStep);
            this.currentPlayer += 1;
        }
    }

    toJson() {
        return JSON.stringify(this);
    }
}