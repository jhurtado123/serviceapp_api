import axios from 'axios';

class MapBoxApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.MAPBOX_URI,
    });
  }

  getCity(postalcode) {
    return this.apiClient.get(
      `/${postalcode}json?access_token=pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA`
    );
  }
}

const mapboxApiClient = new MapBoxApiClient();
export default mapboxApiClient;