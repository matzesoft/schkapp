
<script>
    import { bets } from "$lib/game_state/bets.js";
    export let gameResults = [];

    function getBetName(id) {
        const bet = bets.find(bet => bet.code === id);
        return bet ? bet.message : "Unbekannte Wette";
    }
</script>

<main>
    {#each gameResults as result, index}
        <div class="Result">
            <p class="playerHead">Spieler {index+1}</p>
            <p class:positive={result.totalSips > 0} class:negative={result.totalSips <= 0}>
                {Math.abs(result.totalSips)} Schlücke {#if result.totalSips > 0}Verteilen{:else}Trinken{/if}
            </p>

            {#each result.betsResult as bet}
                <p>
                    {getBetName(bet.id)} ist {#if bet.isCorrect}richtig{:else}falsch{/if}
                </p>
            {/each}
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