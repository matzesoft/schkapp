<script>
    import { bets } from "$lib/game_state/bets.js";
    export let selectedBets = [];

    function placeBet(code) {
        if (selectedBets.includes(code)) {
            selectedBets.pop(code);
        } else {
            selectedBets.push(code);
        }
        console.log(selectedBets);
    }
</script>

<main>
    {#each bets as bet (bet.code)}
        <div class="Bet" on:click={() => placeBet(bet.code)}>
            <p class="betHead">{bet.message}</p>
            <p>Anzahl an Schlücken: {bet.sips}</p>
            <input type="checkbox" bind:group={selectedBets} value={bet.code} />
        </div>
    {/each}
    Selected Bet: {selectedBets}
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
    .Bet {
        border: 2px solid #000; /* Add a border around each train */
        border-radius: 10px; /* Round the corners */
        padding: 3px; /* Add some space inside the box */
        margin-bottom: 10px; /* Add some space between the boxes */
        background-color: rgba(
            255,
            255,
            255,
            0.8
        ); /* Add a semi-transparent white background */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a shadow for a 3D effect */
    }
</style>
