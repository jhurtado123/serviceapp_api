const axios = require("axios");

class MapBoxApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.MAPBOX_URI,
    });
  }

  getCity(postalcode) {
    return this.apiClient.get(
      `/${postalcode}.json?access_token=${process.env.MAPBOX_TOKEN}&country=es`
    );
  }
}

const mapboxApiClient = new MapBoxApiClient();
module.exports = { mapboxApiClient};