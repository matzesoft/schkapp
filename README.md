# Schkapp

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
