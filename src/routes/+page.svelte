<script>
    import {getTraindata} from '$lib/db_api/db_api.js';
    import {page} from "$app/stores";
</script>

<main>
    <h1>Schkapp</h1>

    <button on:click={getTraindata}>
        Get Traindata
    </button>

    <a href="/schkubu">
        Sag Schkubu Hallo!
    </a>
</main>

<style></style>
