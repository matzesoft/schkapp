import {GlobalGame} from "$lib/game_state/GlobalGame.js";
import {GameRound} from "$lib/game_state/GameRound.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const globalGame = new GlobalGame(cookies.get('global_game'));
    const gameRound = globalGame.gameRound;

    console.log(gameRound.step);

    return {gameRound: gameRound.step};
}

export const actions = {

    nextRoundStep: async ({ request, cookies }) => {
        const globalGame = new GlobalGame(cookies.get('global_game'));
        const gameRound = globalGame.gameRound;

        if (gameRound.step < 2) {
            gameRound.step += 1;
        }

        console.log("New game state: " + gameRound.step);

        cookies.set('global_game', globalGame.toJson(), { path: '/' });
    },
};