<script>
    export let trains = [];
    export let selectedTrain = null;

    function selectTrain(trainID) {
        selectedTrain = trainID;
    }
</script>

<main>
    {#each trains as train (train.i)}
        <div
            class={train.i === selectedTrain ? "Train selected" : "Train"}
            on:click={() => selectTrain(train.i)}
        >
            <center><p class="trainHead">Zug: {train.t} {train.n}</p></center>
            <p>{train.a} {train.d}</p>
        </div>
    {/each}
</main>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .trainHead {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .Train {
        border: 2px solid #000;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .selected {
        background-color: #2bc0e0;
    }
</style>
