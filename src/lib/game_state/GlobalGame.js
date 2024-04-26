import {GameRound} from "$lib/game_state/GameRound.js";

export class GlobalGame {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.gameRound = new GameRound(jsonData.gameRound);
        } else {
            this.gameRound = new GameRound();
        }
    }

    toJson() {
        return JSON.stringify({
            gameRound: this.gameRound.toJson(),
        });
    }
}