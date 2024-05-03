import {GameRound} from "$lib/game_state/GameRound.js";
import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";
import {getTraindata} from "$lib/server/db_api/db_api.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const gameRound = new GameRound(cookies.get('game_round'));
    const schkubitrains = new Schkubitrains(cookies.get('trains'));

    /// gameRound.step is undefined if no gameRound has started yet
    if (gameRound.step === undefined) {
        const trains = await schkubitrains.getTrainArray();
        await gameRound.createRound(trains, 4);
    }

    return { step: gameRound.step, trains: gameRound.trains };
}

export const actions = {

    nextRoundStep: async ({ request, cookies }) => {
        const gameRound = new GameRound(cookies.get('game_round'));
        const dataFromPage = await request.formData();
        const selectedTrain = (dataFromPage.get('selectedTrainFromPlayer'));
        console.log(selectedTrain);
        console.log(dataFromPage);
        if (gameRound.step < 2) {
            gameRound.step += 1;
        }
        //TODO: If klick on "next", game state allways undefined
        console.log("New game state: " + gameRound.step);

        cookies.set('game_round', gameRound.toJson(), { path: '/' });
    },
};