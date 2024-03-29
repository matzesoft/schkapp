
const fs = require('fs');
const path = require('path');

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

class StationHelper {
  constructor() {
    this.stationsList = [];
    this.loadStations();
  }

  loadStations() {
    if (this.stationsList.length > 0) return;

    const jsonPath = path.join(__dirname, "./train_stations_list.json");
    const jsonRaw = fs.readFileSync(jsonPath);
    const stations = JSON.parse(jsonRaw);

    this.stationsList = stations.map(item => new Station(item));
  }

  findStationsByLatLong(targetLat, targetLong, radius) {
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

  findStationsByName(query) {
    return this.stationsList.filter(station => station.NAME.includes(query));
  }
}
module.exports = StationHelper;

  


async function printTrainList(trains) {
    for (const train of trains) {
        console.log(`-> ${train.trainType}:`);
        if (train.stopId) console.log(`Stop ID: ${train.stopId}`);
        if (train.tripType) console.log(`Trip Type: ${train.tripType}`);
        if (train.trainNumber) console.log(`Train Number: ${train.trainNumber}`);
        if (train.trainLine) console.log(`Train Line: ${train.trainLine}`);
        if (train.platform) console.log(`Platform: ${train.platform}`);
        if (train.passedStations) console.log(`Passed Stations: ${train.passedStations}`);
        if (train.stations) console.log(`Stations: ${train.stations}`);
        if (train.arrival) console.log(`Arrival: ${train.arrival}`);
        if (train.departure) console.log(`Departure: ${train.departure}`);
        console.log(""); // Leerzeile für bessere Lesbarkeit
    }
}

