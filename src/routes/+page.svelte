<script>
    import {getTraindata} from '$lib/db_api/db_api.js';
</script>

<main>
    <h1>Schkapp</h1>

    <button on:click={getTraindata}>
        Get Traindata
    </button>
</main>

<style></style>
