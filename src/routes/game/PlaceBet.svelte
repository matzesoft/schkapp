<script>
    import { bets } from "$lib/game/bets.js";
    export let selectedBets = [];

    function placeBet(code) {
        if (selectedBets.includes(code)) {
            selectedBets = selectedBets.filter((b) => b !== code);
        } else {
            selectedBets = [...selectedBets, code];
        }
    }
</script>

<main>
    {#each bets as bet (bet.code)}
        <label>
            <div
                class={selectedBets.includes(bet.code) ? "Bet selected" : "Bet"}
                on:click={() => placeBet(bet.code)}
            >
                <center><p class="betHead">{bet.message}</p></center>
                <p>Anzahl an Schlücken: {bet.sips}</p>
            </div>
        </label>
    {/each}
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
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .Bet {
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
