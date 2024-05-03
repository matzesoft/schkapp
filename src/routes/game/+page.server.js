import {GameRound} from "$lib/game_state/GameRound.js";
import {Schkubitrains} from "$lib/game_state/Schkubitrains.js";
import {chooseBetStep, choosePlayerCountStep, chooseTrainStep, resultsStep} from "$lib/constants.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const gameRound = new GameRound(cookies.get('game_round'));
    const schkubitrains = new Schkubitrains(cookies.get('trains'));
    const trains = await schkubitrains.getTrainArray();

    /// gameRound.step is undefined if no gameRound has started yet
    if (gameRound.step === undefined) {
        const trains = await schkubitrains.getTrainArray();
        await gameRound.createRound(trains);
    }

    cookies.set('game_round', gameRound.toJson(), { path: '/' });
    //cookies.set('schkubitrains', schkubitrains.toJson(), { path: '/' });
    return { step: gameRound.step, trains: gameRound.trains, currentPlayer: gameRound.currentPlayer };
}

export const actions = {

    nextRoundStep: async ({ request, cookies }) => {
        const gameRound = new GameRound(cookies.get('game_round'));
        const dataFromPage = await request.formData();
  

        switch (gameRound.step) {
            case choosePlayerCountStep:
                gameRound.setPlayerCount(dataFromPage.get('playerCount')); // TODO: Get player count from page
                
                break;
            case chooseTrainStep:
                gameRound.setSelectedTrainForCurrentPlayer(dataFromPage.get('selectedTrainFromPlayer'));
                break;
            case chooseBetStep:
                gameRound.setSelectedBetForCurrentPlayer(dataFromPage.get('selectedBetFromPlayer'));
                break;
            case resultsStep:
                // TODO: DO SOMETHING
                break;
        }
        
        cookies.set('game_round', gameRound.toJson(), { path: '/' });
    },
};
