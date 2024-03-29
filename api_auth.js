class ApiAuthentication {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async testCredentials() {
    try {
      const response = await fetch("https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/station/BLS", {
        method: 'GET', // HTTP-Methodentyp
        headers: {
          "DB-Api-Key": this.clientSecret,
          "DB-Client-Id": this.clientId,
        }
      });
      
      // Überprüfe, ob der Statuscode 200 ist, was bedeutet, dass die Anfrage erfolgreich war
      return response.status === 200;
    } catch (error) {
      console.error('Fehler bei der Überprüfung der Anmeldeinformationen:', error);
      return false; // Rückgabe von false im Fehlerfall
    }
  }

  getHeaders() {
    return {
      "DB-Api-Key": this.clientSecret,
      "DB-Client-Id": this.clientId,
    };
  }
}
module.exports = ApiAuthentication;