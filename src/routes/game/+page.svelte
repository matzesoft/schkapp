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
    } from "$lib/constants.js";

    export let data;
    $: gameStep = data.step;
    $: currentPlayer = data.currentPlayer;
    $: trains = data.trains;
    let selectedTrainFromComponent = null;
    let selectedBetsFromComponent = [];

    let y;
    function SelectTrain() {
        gameStep = 0;
    }
    function placeBet() {
        gameStep = 1;
    }
    function resultScreen() {
        gameStep = 2;
    }

    let number = 1;

    function validateNumber(value) {
        const num = parseInt(value);
        if (num >= 1 && num <= 7) {
            number = num;
        }
    }
</script>

<svelte:window bind:scrollY={y} />

<div id="scroll-content">
    <main>
        <form method="POST" action="?/nextRoundStep">
            {#if gameStep === choosePlayerCountStep}
                <h3>ChoosePlayerCount</h3>
                <!-- Eingabefeld für die Zahl -->
                <input
                    name="playerCount"	
                    type="number"
                    min="1"
                    max="10"
                    bind:value={number}
                    on:input={(event) => validateNumber(event.target.value)}
                />

                <!-- Ausgabe der eingegebenen Zahl -->
                <p>Die eingegebene Zahl ist: {number}</p>

            {:else if gameStep === chooseTrainStep}
                //TODO ADD PLAYER
                <h3>Current Player: {currentPlayer}</h3>
                <input
                    name="selectedTrainFromPlayer"
                    disabled={selectedTrainFromComponent == null}
                    type="hidden"
                    value={selectedTrainFromComponent}
                />
                <SelectTrains {trains} bind:selectedTrain={selectedTrainFromComponent} />

            {:else if gameStep === chooseBetStep}
                <h3>Current Player: {currentPlayer}</h3>
                <input
                    name="selectedBetsFromPlayer"
                    
                    disabled={selectedBetsFromComponent == null}
                    type="hidden"
                    value={selectedBetsFromComponent}
                />
                <PlaceBet bind:selectedBets={selectedBetsFromComponent} />

            {:else if gameStep === resultsStep}
                <h1>GAME OVER!</h1>
                <EndScreen />
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
