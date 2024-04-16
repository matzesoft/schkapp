class Station {
  constructor({ EVA_NR, DS100, IFOPT, NAME, Verkehr, Laenge, Breite, Betreiber_Name, Betreiber_Nr, Status }) {
    this.EVA_NR = EVA_NR;
    this.DS100 = DS100;
    this.IFOPT = IFOPT;
    this.NAME = NAME;
    this.Verkehr = Verkehr;
    this.Laenge = Laenge;
    this.Breite = Breite;
    this.Betreiber_Name = Betreiber_Name;
    this.Betreiber_Nr = Betreiber_Nr;
    this.Status = Status;
  }
}

export default class StationHelper {
  constructor() {
    this.stationsList = [];
  }

  async loadStations() {
    // Verhindere das erneute Laden, falls die Liste bereits gefüllt ist.
    if (this.stationsList.length > 0) return;

    try {
      // Loading train station json
      const response = await fetch("./src/lib/db_api/static/train_stations_list.json");
      if (!response.ok) throw new Error("train_stations_list not found");
      const stations = await response.json();

      this.stationsList = stations.map(item => new Station(item));
    } catch (error) {
      console.error("Fehler beim Laden der Stationsliste:", error);
    }
  }

  async findStationsByName(query) {
    await this.loadStations();
    return this.stationsList.filter(station => station.NAME.includes(query));
  }

}


