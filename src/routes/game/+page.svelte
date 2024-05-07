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
                <div class="title">
                    <h3>Wähle die Anzahl an Spielern:</h3>
                </div>
                <input
                    name="playerCount"
                    type="hidden"
                    value={playerCountFromComponent}
                />
                <PlayerCount bind:count={playerCountFromComponent} />
            {:else if gameStep === chooseTrainStep}
                <div class="title">
                    <h3>Spieler {currentPlayer + 1} wähle ein Zug</h3>
                </div>
                <input
                    name="selectedTrainFromPlayer"
                    disabled={selectedTrainFromComponent == null}
                    type="hidden"
                    value={selectedTrainFromComponent}
                />
                <SelectTrains
                    {trains}
                    bind:selectedTrain={selectedTrainFromComponent}
                />
            {:else if gameStep === chooseBetStep}
                <div class="title">
                    <h3>Spieler {currentPlayer + 1} wähle deine Wette</h3>
                </div>
                <input
                    name="selectedBetsFromPlayer"
                    disabled={selectedBetsFromComponent == null}
                    type="hidden"
                    value={selectedBetsFromComponent}
                />
                <PlaceBet bind:selectedBets={selectedBetsFromComponent} />
            {:else if gameStep === resultsStep}
                <div class="title">
                    <h3>Ergebnisse</h3>
                </div>
                <EndScreen {gameResults} />
            {:else}
                <h1>Unknown game Status</h1>
            {/if}
            <button class="center-button" disabled={(gameStep === chooseTrainStep && selectedTrainFromComponent == null) || (gameStep === chooseBetStep && selectedBetsFromComponent.length === 0)}>NEXT!</button>
        </form>
    </main>
</div>

<style>
    #scroll-content {
        overflow-y: auto;
        height: 85vh;
        /*padding-bottom: 103vh; */
    }
    .title {
        letter-spacing: 1px;
        padding-top: 5px;
        justify-content: center;
        display: flex;
    }
</style>
