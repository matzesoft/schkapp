import {GameRound} from "$lib/game_state/GameRound.js";
import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";
import {getTraindata} from "$lib/server/db_api/db_api.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const gameRound = new GameRound(cookies.get('game_round'));
    const schkubitrains = new Schkubitrains(cookies.get('trains'));

    if (gameRound.step === undefined) {
        // TODO: Load trains from API and get player count
        const trains = await schkubitrains.getTrainArray();
        await gameRound.createRound(trains, 4);
    }

    //console.log(await getTraindata());
    const trains = await schkubitrains.getTrainArray();
    console.log("SchkubiTrains Ausgabe in page.server:" + trains);

    return { gameRound };
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