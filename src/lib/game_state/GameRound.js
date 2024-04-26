export class GameRound {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.playerCount = jsonData.playerCount;
            this.step = jsonData.step;
        } else {
            this.playerCount = 0;
            this.step = 0;
        }
    }

    toJson() {
        return JSON.stringify({
            playerCount: this.playerCount,
            step: this.step
        });
    }
}