<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import SelectTrains from "./SelectTrains.svelte";
    import PlaceBet from "./PlaceBet.svelte";
    import EndScreen from "./EndScreen.svelte";
    let plyers = [{ id: 0, name: "Kevin" }, { id: 1, name: "Sven"}, { id: 2, name: "EEMA"}];
    $: gameStep = 0;
    $: currentPlayer = plyers[gameStep].name;

    let y;
    function nextStep() {
        gameStep++;
        if(gameStep > 2) {
            gameStep = 0;
        }
    }
    function SelectTrain() {gameStep = 0;}
    function placeBet() {gameStep = 1;}
    function resultScreen() {gameStep = 2;}

</script>

<svelte:window bind:scrollY={y} />

<div id="scroll-content">
<main>

    {#if gameStep === 0}
        //TODO ADD PLAYER
        <h3>Current Player: {currentPlayer}</h3>
        <SelectTrains />
    {:else if gameStep === 1}
        <h3>Current Player: {currentPlayer}</h3>
        <PlaceBet />
    {:else if gameStep === 2}
        <h1>GAME OVER!</h1>
        <EndScreen />
    {:else}
        <h1>Unknown game Status</h1>
    {/if}
    <button class="center-button" on:click={nextStep}>NEXT!</button>
</main>
</div>

<!-- Zum Debuggen nützlich
<button on:click={SelectTrain}>Züge Auswählen</button>
<button on:click={placeBet}>Wette Plazieren</button>
<button on:click={resultScreen}>Ergebnisse</button>
-->

<div>{@html data.text}</div>

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