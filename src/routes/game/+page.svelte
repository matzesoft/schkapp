<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import SelectTrains from "./SelectTrains.svelte";
    import PlaceBet from "./PlaceBet.svelte";
    import EndScreen from "./EndScreen.svelte";
    $: gameStep = 0;

    function SelectTrain() {
        gameStep = 0;
    }
    function placeBet() {
        gameStep = 1;
    }
    function resultScreen() {
        gameStep = 2;
    }

</script>

<main>
    <h3>Game</h3>

    {#if gameStep === 0}
        <SelectTrains />
    {:else if gameStep === 1}
        <PlaceBet />
    {:else if gameStep === 2}
        <EndScreen />
    {:else}
        <h2>Unknown game Status</h2>
    {/if}

</main>

<button on:click={SelectTrain}>Züge Auswählen</button>
<button on:click={placeBet}>Wette Plazieren</button>
<button on:click={resultScreen}>Ergebnisse</button>
<div>{@html data.text}</div>

<style>
    main{
        background-color: rgba(250, 250, 250, 0.9);
        padding: 10px;
    }
</style>