<script>
    import {getTraindata} from '$lib/db_api/db_api.js';
</script>

<main>

    <button class="game-buttons" on:click={getTraindata}>
        Get Traindata
    </button>

    <button class="game-buttons">
        <a href="/game">
            Zum Spiel
        </a>
    </button>

    <button class="game-buttons">
        <a href="/about">
            Zu About
        </a>
    </button>
</main>

<style>
    .game-buttons{
        margin-top: 20px;
        background-color: royalblue;
        border: none;
        color: white;
        padding: 10px 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
    }
</style>
