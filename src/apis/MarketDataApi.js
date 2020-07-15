import Api from "./Api";

export default {
  GetSpotRates() {
    return Api.get("SpotRates");
  },
  GetSwaps(body) {
    return Api.post("GetSwaps", body);
  },
  GetBaseRates(body) {
    return Api.post("GetBaseRates", body);
  },
  GetRateTiles(body) {
    return Api.post("GetRateTiles", body);
  }
};
