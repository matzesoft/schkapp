<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import SelectTrains from "./SelectTrains.svelte";
    import PlaceBet from "./PlaceBet.svelte";
    import EndScreen from "./EndScreen.svelte";
    $: gameStep = 0;
    let y;
    function SelectTrain() {gameStep = 0;}
    function placeBet() {gameStep = 1;}
    function resultScreen() {gameStep = 2;}

</script>
<svelte:window bind:scrollY={y} />

<div id="scroll-content">
<main>
    <h3>//TODO: ADD PLAYER Game</h3>

    {#if gameStep === 0}
        <SelectTrains />
    {:else if gameStep === 1}
        <PlaceBet />
    {:else if gameStep === 2}
        <EndScreen />
    {:else}
        <h1>Unknown game Status</h1>
    {/if}

</main>
</div>

//TODO: NEXT BUTTON ADD AND CENTER IT
<button on:click={SelectTrain}>Züge Auswählen</button>
<button on:click={placeBet}>Wette Plazieren</button>
<button on:click={resultScreen}>Ergebnisse</button>
<div>{@html data.text}</div>

<style>
    #scroll-content{
        overflow-y: auto;
        height: 90vh;
    }
    main{
        background-color: rgba(250, 250, 250, 0.9);
        padding: 10px;
    }
</style>