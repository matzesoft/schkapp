<script>
    /** @type {import('./$types').PageData} */
    import SelectTrains from "./SelectTrains.svelte";
    import PlaceBet from "./PlaceBet.svelte";
    import EndScreen from "./EndScreen.svelte";
    import {choosePlayerCountStep, chooseTrainStep, chooseBetStep, resultsStep} from "$lib/constants.js";

    export let data;
    $: gameStep = data.step;
    $: currentPlayer = data.currentPlayer;
    $: trains = data.trains;
    let selectetTrain = null;

    let y;
    function SelectTrain() {gameStep = 0;}
    function placeBet() {gameStep = 1;}
    function resultScreen() {gameStep = 2;}

</script>

<svelte:window bind:scrollY={y} />

<div id="scroll-content">
<main>

    {#if gameStep === choosePlayerCountStep}
        <h3>ChoosePlayerCount</h3>
    {:else if gameStep === chooseTrainStep}
        //TODO ADD PLAYER
        <h3>Current Player: {currentPlayer}</h3>
        <SelectTrains {trains} bind:selectedTrain={selectetTrain}/>
    {:else if gameStep === chooseBetStep}
        <h3>Current Player: {currentPlayer}</h3>
        <PlaceBet />
    {:else if gameStep === resultsStep}
        <h1>GAME OVER!</h1>
        <EndScreen />
    {:else}
        <h1>Unknown game Status</h1>
    {/if}
    <form method="POST" action="?/nextRoundStep">
        <input name="selectedTrainFromPlayer" disabled={selectetTrain == null} type="hidden" value={selectetTrain} />
        <button class="center-button">NEXT!</button>
    </form>
</main>
</div>

<div>{@html "Server data.step:" +data.step }</div>

<style>
    #scroll-content{
        overflow-y: auto;
        height: 90vh;
    }
    main{
        background-color: rgba(250, 250, 250, 0.9);
        padding: 5px;
    }
</style>