
<script>
    export let trains = [];
    export let selectedTrain = null;

    function selectTrain(trainID) {
        selectedTrain = trainID;
    }

    //let trains = [{ id: 332, type:"ICE" , name: "Stuttgart - Hamburg" }, { id: 2, type:"ICE" , name: "Stuttgart - Kevin Hausen" }, { id: 3,type:"RE" , name: "Stuttgart - Jarro" }];

</script>

<main>
    {#each trains as train (train.id)}
    <div class="Train" on:click={() => selectTrain(train.id)}>
        <p class="trainHead">Zug: {train.trainType} {train.number}</p>
        <p>{train.arrivalStartStation}</p>
            <input type="radio" bind:group={selectedTrain} value={train.id}>
    </div>
    {/each}
    Selected Train: {selectedTrain}

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
    }
    .Train {
        border: 2px solid #000; /* Add a border around each train */
        border-radius: 10px; /* Round the corners */
        padding: 10px; /* Add some space inside the box */
        margin-bottom: 10px; /* Add some space between the boxes */
        background-color: rgba(255, 255, 255, 0.8); /* Add a semi-transparent white background */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a shadow for a 3D effect */
    }

</style>