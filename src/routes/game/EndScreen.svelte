
<script>
    export let gameResults = [];

    //let players = [{ id: 0, sips:"2", betWasCorrect:true, name: "EEMA" }, { id: 1, sips:"4", betWasCorrect:false , name: "Robert" }, { id: 2,sips:"5", betWasCorrect:true , name: "Tomas die Lokomotive" }, { id:3, sips:"500", betWasCorrect:false, name: "Schkuwu"}];
    //function validateIfPlayerneedsToDrink() {
        // players.forEach(player => {
        //     if (player.sips > 0) {
        //         player.sips -= 1;
        //         if (player.sips === 0) {
        //             console.log(player.name + " hat ausgetrunken");
        //         }
        //     }
        // });

    //}
</script>

<main>
    {#each gameResults as result, index}
        <div class="Result">
            <p class="playerHead">Player: {index}</p>
<!--            <p class:positive={result.} class:negative={!result.betWasCorrect}>-->
<!--                {result.sips} Schlücke {#if result.betWasCorrect === true}Verteilen{:else}Trinken{/if}-->
<!--            </p>-->
        </div>
    {/each}
</main>


<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .positive {
        color: limegreen;
        font-weight: bold;
    }
    .negative {
        color: red;
        font-weight: bold;
    }

    .playerHead {
        font-size: 1.5em;
        font-weight: bold;
    }
    .Result {
        border: 2px solid #000; /* Add a border around each train */
        border-radius: 10px; /* Round the corners */
        padding: 10px; /* Add some space inside the box */
        margin-bottom: 10px; /* Add some space between the boxes */
        background-color: rgba(255, 255, 255, 0.8); /* Add a semi-transparent white background */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Add a shadow for a 3D effect */
    }
</style>