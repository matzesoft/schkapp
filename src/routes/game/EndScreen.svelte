
<script>
    import { bets } from "$lib/game/bets.js";
    export let gameResults = [];

    function getBetName(id) {
        const bet = bets.find(bet => bet.code === id);
        return bet ? bet.message : "Unbekannte Wette";
    }
    console.log("Game Res: "+JSON.stringify(gameResults));

    function actualTrainChanges(playerIndex){
        let trainChanges = gameResults[playerIndex].trainMessage;
        let trainChangesString = "";
        for(let i = 0; i < trainChanges.length; i++){
            trainChangesString += getBetName(Number(trainChanges[i])) + ", ";
            if (i === trainChanges.length - 1) trainChangesString = trainChangesString.slice(0, -2);
        }
         return trainChangesString;
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
            <p>
                Der Zug hatt: {actualTrainChanges(index)}
            </p>
        </div>
    {/each}
</main>


<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    p{
        margin: 10px;
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
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .Result {
        border: 2px solid #000;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 5px;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
</style>