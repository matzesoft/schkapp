# Schkapp
Schkapp is a drinking game build with Vite, SvelteKit and the DeutscheBahn Timetable API. It was part of a student project at the DHBW Stuttgart.
Visit [schkapp.pages.dev](https://schkapp.pages.dev) to play. If you want to learn more about the project itself keep reading.

#### Contents
* The Game
* Run the project
* How it was build
* Have fun


## The Game

### Idea
Bets are placed on train delay justifications. A delay justification could be, for example,
"Delay of a preceding train" or "Construction work".

Trains on which bets are placed are queried live from the German Railway and contain real
events.

It's a drinking game; if guessed correctly, sips can be distributed to other players. If guessed
wrongly, one must drink themselves.

#### Goal
Get hammered.

### Sequence of a Round
#### 1. Bet
Each player in turn selects a train and its corresponding bets.
A total of 5 trains are available, which should currently arrive at the chosen station.
For the train, bets are placed on events like "Delay from previous journey", "Police investigation", or
"Construction work".
For each event, there is a set number of sips one can distribute if the event occurs.
Likewise, there is a set number of sips one must drink if the event does not occur.

#### 2. Evaluation of the Bet
For each player, the number of sips they can distribute or must drink is calculated as follows:
Sip distribution count correct guessed events - Sip drinking count incorrectly guessed events =
Sip count
Negative sip count -> Drink sips
Positive sip count -> Distribute sips

#### Penalties
Anyone who googles delays must funnel a beer.

### How do the trains and delay reasons come about?
At the start of the round, all trains that should arrive at the selected station at the current time are queried from the
German Railway. Five random ones are then selected from these trains.
The corresponding delay reasons of the trains are stored.
The trains and delay reasons do not change once the round has started.
Additionally, it is ensured that if several rounds are played within a short period, the same
trains cannot occur again.

### End of Game
When hammered.

## Run the project
To run the project you need your own Deutsche Bahn Timetable API Keys. You can request them here: [developers.deutschebahn.com](https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables).
After you got your keys, paste them inside the `.env_template` file and rename it to `.env`.

After that you can just run `npm run dev`.


## How it was build

### DB Timetables API
Schkapp is using the Deutsche Bahn Timetable API, which is free to use for anyone via the [DB APIs Marketplace](https://developers.deutschebahn.com/db-api-marketplace/apis/).
Under [`src/lib/server/db_api`](https://github.com/matzesoft/schkapp/tree/main/src/lib/server/db_api) you can find the wrapper which is used in Schkapp to call the API. The wrapper is inspired by the [`deutsche_bahn_api`](https://github.com/Tutorialwork/deutsche_bahn_api) written in python.

### Game state & logic
The game state and logic can be found under [`src/lib/game`](https://github.com/matzesoft/schkapp/tree/main/src/lib/game). Game logic is processed on the server, handeled via SvelteKit.

* `constants.js` stores variables defining basic game behaviour like max amount of players or the max trains per round.

* `bets.js` stores delay reasons you can bet on with the corresponding code and message from the Deutsch Bahn.

* `GameRounds.js` handles the game state and logic of each round. It stores information like count of players and the selected bets and trains of the players. It also calculates the sips every player has to drink or can distribute.

* `Schkubitrains.js` stores the last query of trains. This makes sure that you don't play with the same trains, when playing multiple rounds in a short period of time. Schkubitrains cycles through the last stored trains and always gives you five new trains with which you haven't played with yet.

### Routes
Schkapp contains of three routes:
* `/` - Startpage with links to the other two routes.
* `/game` - Where the magic happens, the game.
* `/how-to-play` - Information on how to play the game.

### Hosting
Schkapp is hosted using [Cloudflare pages](https://pages.cloudflare.com) and the [SvelteKit Cloudflare adapter](https://kit.svelte.dev/docs/adapter-cloudflare). Cloudflare automatically executes `vite build` and deploys to [schkapp.pages.dev](https://schkapp.pages.dev).

## Have fun
Schkapp was build to have fun, so stop coding and take a break 🍻 If you are a nerdy enough to keep coding, you can open an issue or send an email if you have any question or suggestions.
