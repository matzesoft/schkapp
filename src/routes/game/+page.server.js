import {GameRound} from "$lib/game_state/GameRound.js";
import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";
import {getTraindata} from "$lib/db_api/db_api.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const gameRound = new GameRound(cookies.get('game_round'));
    const schkubitrains = new Schkubitrains(cookies.get('trains'));

    if (gameRound.step === undefined) {
        // TODO: Load trains from API and get player count
       //gameRound.createRound(trains, 4);
    }

    console.log(getTraindata());
    //schkubitrains.updateTrainArray();
    console.log(gameRound.step);

    return {gameRound: gameRound.step};
}

export const actions = {

    nextRoundStep: async ({ request, cookies }) => {
        const gameRound = new GameRound(cookies.get('game_round'));

        if (gameRound.step < 2) {
            gameRound.step += 1;
        }

        console.log("New game state: " + gameRound.step);

        cookies.set('game_round', gameRound.toJson(), { path: '/' });
    },
};