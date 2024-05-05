<script>
    import "./styles.css";

    const appName = "Schkapp";
</script>

<main>
    <div class="background">
        <div class="top-bar">
            <h1 style="color: #2BC0E0">Schkapp</h1>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</main>

<style>
    .content {
        padding-top: 50px;
    }
    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: -1;
        background-image: url("/src/lib/img/party-hintergrund.jpg");
        background-size: cover;
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
        height: 50px;
        background-color: #3d3c3c;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .top-bar h1 {
        letter-spacing: 5px;
        color: white;
        text-shadow:
            -2px 0 black,
            0 2px black,
            2px 0 black,
            0 -2px black;
    }
</style>
