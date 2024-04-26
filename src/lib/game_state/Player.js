export class Player {
    constructor(serialized = undefined) {
        if (serialized) {
            let jsonData = JSON.parse(serialized);

            this.id = jsonData.id;
            this.name = jsonData.name;
            this.score = jsonData.score;
        } else {
            this.id = 0; // TODO: Define a unique id
            this.name = "";
            this.score = 0;
        }
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            score: this.score,
        });
    }
}