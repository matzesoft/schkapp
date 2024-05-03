import {chooseBetStep, choosePlayerCountStep, chooseTrainStep, resultsStep} from "$lib/constants.js";

export class GameRound {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.playerCount = jsonData.pC;
            this.step = jsonData.s;
            this.trains = jsonData.t;
            this.currentPlayer = jsonData.cP;
            this.selectedBets = jsonData.sB;
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
        this.selectedBets[this.currentPlayer] = { trainId: trainId, bets: [] };
        this.setStep(chooseBetStep);
    }

    setSelectedBetsForCurrentPlayer(bets) {
        this.selectedBets[this.currentPlayer].bets = bets;

        if (this.currentPlayer === this.playerCount-1) {
            this.setStep(resultsStep);
        } else {
            this.setStep(chooseTrainStep);
            this.currentPlayer += 1;
        }
    }

    toJson() {
        return JSON.stringify({
            pC: this.playerCount,
            s: this.step,
            t: this.trains,
            cP: this.currentPlayer,
            sB: this.selectedBets
        });
    }
}