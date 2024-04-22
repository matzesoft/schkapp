
<script>
    $: trainID = 1;

    function incrementTrainID() {
        trainID++;
        if (trainID > 3) {
            trainID = 1;
        }
    }
    let trains = [{ id: 332, type:"ICE" , name: "Stuttgart - Hamburg" }, { id: 2, type:"ICE" , name: "Stuttgart - Kevin Hausen" }, { id: 3,type:"RE" , name: "Stuttgart - Jarro" }];

    function addTrain() {
        const newTrainId = trains.length + 1;
        const newTrainName = `Train ${newTrainId}`;
        trains = [...trains, { id: newTrainId, name: newTrainName }];
    }
</script>

<main>
    {#each trains as train (train.id)}
    <div class="Train">
        <p class="trainHead">Zug: {train.type} {train.id}</p>
        <p>{train.name}</p>
    </div>
    {/each}

    <button on:click={addTrain}>Add Train</button>
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .trainHead {
        font-weight: bold;
    }
</style>