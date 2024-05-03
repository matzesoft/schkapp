
<script>
    //import selectedTrain from ;
    let selectedBet = null;

    function placeBet(betID) {
        selectedBet = betID;
    }

    let bets = [{ id: 0, sips:"2" , name: "Verspätung" }, { id: 1, sips:"3" , name: "Gleiswechsel" }, { id: 2,sips:"5" , name: "Zug fällt aus" }, { id:3, sips:"500", name: "JOA im Zug rum"}];

</script>

<main>
    {#each bets as bet (bet.id)}
        <div class="Bet" on:click={() => placeBet(bet.id)}>
            <p class="betHead">Wette: {bet.name}</p>
            <p>Anzahl an Schlücken: {bet.sips}</p>
            <input type="radio" bind:group={selectedBet} value={bet.id}>
        </div>
    {/each}
    Selected Bet: {selectedBet}

</main>
<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .betHead {
        font-size: 1.5em;
        font-weight: bold;
    }
    .Bet{
        border: 2px solid #000; /* Add a border around each train */
        border-radius: 10px; /* Round the corners */
        padding: 10px; /* Add some space inside the box */
        margin-bottom: 10px; /* Add some space between the boxes */
        background-color: rgba(255, 255, 255, 0.8); /* Add a semi-transparent white background */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a shadow for a 3D effect */
    }
</style>