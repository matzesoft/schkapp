import {GameRound} from "$lib/game_state/GameRound.js";
import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";
import {chooseBetStep, choosePlayerCountStep, chooseTrainStep, resultsStep} from "$lib/constants.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const gameRound = new GameRound(cookies.get('game_round'));

    /// gameRound.step is undefined if no gameRound has started yet
    if (gameRound.step === undefined) {
        const schkubitrains = new Schkubitrains(cookies);
        const trains = await schkubitrains.getTrainArray();
        schkubitrains.storeInCookies(cookies);

        await gameRound.createRound(trains);
    }

    cookies.set('game_round', gameRound.toJson(), { path: '/' });
    return { step: gameRound.step, trains: gameRound.trains, currentPlayer: gameRound.currentPlayer };
}

export const actions = {

    nextRoundStep: async ({ request, cookies }) => {
        const gameRound = new GameRound(cookies.get('game_round'));
        const dataFromPage = await request.formData();
        console.log(dataFromPage);

        switch (gameRound.step) {
            case choosePlayerCountStep:
                gameRound.setPlayerCount(dataFromPage.get('playerCount'));
                break;
            case chooseTrainStep:
                gameRound.setSelectedTrainForCurrentPlayer(dataFromPage.get('selectedTrainFromPlayer'));
                break;
            case chooseBetStep:
                const bets = dataFromPage.get('selectedBetsFromPlayer').split(',').map(Number);
                gameRound.setSelectedBetsForCurrentPlayer(bets); // TODO: Add the actual bets from the page
                break;
            case resultsStep:
                // TODO: DO SOMETHING
                break;
        }
        
        cookies.set('game_round', gameRound.toJson(), { path: '/' });
    },
};
