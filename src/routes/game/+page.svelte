<script>
    /** @type {import('./$types').PageData} */
    import SelectTrains from "./SelectTrains.svelte";
    import PlaceBet from "./PlaceBet.svelte";
    import EndScreen from "./EndScreen.svelte";
    import {
        choosePlayerCountStep,
        chooseTrainStep,
        chooseBetStep,
        resultsStep,
    } from "$lib/game/constants.js";
    import PlayerCount from "./PlayerCount.svelte";

    export let data;
    $: gameStep = data.step;
    $: currentPlayer = data.currentPlayer;
    $: trains = data.trains;
    $: gameResults = data.results;

    let playerCountFromComponent = 1;
    let selectedTrainFromComponent = null;
    let selectedBetsFromComponent = [];

    let y;
</script>

<svelte:window bind:scrollY={y} />

<div id="scroll-content">
    <main>
        <form method="POST" action="?/nextRoundStep">
            {#if gameStep === choosePlayerCountStep}
                <h3>Wähle die Anzahl an Spielern:</h3>
                <input
                        name="playerCount"
                        type="hidden"
                        value={playerCountFromComponent}
                />
                <PlayerCount bind:count={playerCountFromComponent}/>

            {:else if gameStep === chooseTrainStep}
                <h3>Current Player: {currentPlayer + 1}</h3>
                <input
                    name="selectedTrainFromPlayer"
                    disabled={selectedTrainFromComponent == null}
                    type="hidden"
                    value={selectedTrainFromComponent}
                />
                <SelectTrains {trains} bind:selectedTrain={selectedTrainFromComponent} />

            {:else if gameStep === chooseBetStep}
                <h3>Current Player: {currentPlayer + 1}</h3>
                <input
                    name="selectedBetsFromPlayer"
                    
                    disabled={selectedBetsFromComponent == null}
                    type="hidden"
                    value={selectedBetsFromComponent}
                />
                <PlaceBet bind:selectedBets={selectedBetsFromComponent} />

            {:else if gameStep === resultsStep}
                <EndScreen {gameResults}/>

            {:else}
                <h1>Unknown game Status</h1>
            {/if}
            <button class="center-button">NEXT!</button>
        </form>
    </main>
</div>

<div>{@html "Server data.step:" + data.step}</div>

<style>
    #scroll-content {
        overflow-y: auto;
        height: 90vh;
    }
    main {
        background-color: rgba(250, 250, 250, 0.9);
        padding: 5px;
    }
</style>
