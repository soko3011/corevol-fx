import Api from "./Api";

export default {
  GetSpotRates() {
    return Api.get("SpotRates");
  },
  GetSwaps(body) {
    return Api.post("GetSwaps", body);
  }
};
