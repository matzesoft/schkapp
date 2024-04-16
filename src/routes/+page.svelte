<script>
    import {getTraindata} from '$lib/db_api/db_api.js';
</script>

<main>
    <button on:click={getTraindata}>
        Get Traindata
    </button>

    <button>
        <a href="/game">
            Zum Spiel
        </a>
    </button>

    <button>
        <a href="/about">
            Zu About
        </a>
    </button>
</main>

<style></style>
