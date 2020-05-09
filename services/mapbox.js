const axios = require("axios");

class MapBoxApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.MAPBOX_URI,
    });
  }

  getCoordsByPostalCode(postalCode) {
    return this.apiClient.get(`/${postalCode}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1&country=es`);
  }

  getCity(postalcode) {
    return this.apiClient.get(
      `/${postalcode}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1&country=es`
    );
  }
}

const mapboxApiClient = new MapBoxApiClient();
module.exports = mapboxApiClient;