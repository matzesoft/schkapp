<script>
    import "./styles.css";

    const appName = "Schkapp";
</script>

<div class="app">
    <header>
        <h1>Schkapp</h1>
    </header>

    <main>
        <slot/>
    </main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 70px;
        background-color: #3d3c3c;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    header h1 {
        letter-spacing: 5px;
        color: #2BC0E0;
        text-shadow: -2px 0 black,
        0 2px black,
        2px 0 black,
        0 -2px black;
    }

    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        box-sizing: border-box;
        margin: 90px auto 0;

        background-color: rgba(250, 250, 250, 0.9);
        border-radius: 25px;
    }
</style>
