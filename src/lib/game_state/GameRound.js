export class GameRound {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.step = jsonData.step;
        } else {
            this.step = 0;
        }
    }

    toJson() {
        return JSON.stringify({
            step: this.step
        });
    }
}