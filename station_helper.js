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

function normalizeLatOrLongFromStation(station) {
  const lat = parseFloat(station.Breite.replace(",", "."));
  const long = parseFloat(station.Laenge.replace(",", "."));
  return { lat, long };
}

function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Erdradius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

export default class StationHelper {
  constructor() {
    this.stationsList = [];
  }

  async loadStations() {
    // Verhindere das erneute Laden, falls die Liste bereits gefüllt ist.
    if (this.stationsList.length > 0) return;

    try {
      // Angenommen, die JSON-Datei ist öffentlich zugänglich unter dem gleichen Pfad wie Ihre HTML-Datei.
      const response = await fetch("./train_stations_list.json");
      if (!response.ok) throw new Error("Netzwerkantwort war nicht ok.");

      const stations = await response.json();

      // Hier wird vorausgesetzt, dass `Station` eine Klasse oder Funktion ist, die Sie definieren,
      // um ein Stationsobjekt zu instanziieren.
      this.stationsList = stations.map(item => new Station(item));
    } catch (error) {
      console.error("Fehler beim Laden der Stationsliste:", error);
    }
  }

  async findStationsByLatLong(targetLat, targetLong, radius) {
    await this.loadStations();
    const results = [];

    this.stationsList.forEach(station => {
      const { lat, long } = normalizeLatOrLongFromStation(station);
      const distance = haversineDistance([lat, long], [targetLat, targetLong]);

      if (distance < radius) {
        results.push(station);
      }
    });

    return results;
  }

  async findStationsByName(query) {
    await this.loadStations();
    return this.stationsList.filter(station => station.NAME.includes(query));
  }

}


