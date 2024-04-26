<script>
    import './styles.css';

    const appName = 'Schkapp';
</script>

<main>
    <div class="background">
        <div class="top-bar">
            <h1>Schkapp</h1>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</main>

<style>
    .content {
        padding-top: 50px; /* This should be equal to the height of the top bar */
    }
    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh; /* Cover the full viewport height */
        width: 100vw; /* Cover the full viewport width */
        z-index: -1; /* Keep the background behind other content */
        background-image: url("/src/lib/img/party-hintergrund.jpg");
        background-size: cover; /* Ensure the image covers the entire element */
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        filter: brightness(0.9);
    }
    .top-bar {
        position: fixed;
        top: 20px;
        left: 0;
        width: 100vw;
        height: 50px; /* Adjust the height as needed */
        background-color: darkgray;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1; /* Ensure the bar is above other content */
    }

    .top-bar h1 {
        color: white;
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }
</style>
