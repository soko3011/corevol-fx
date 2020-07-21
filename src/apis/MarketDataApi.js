import Api from "./Api";

export default {
  GetSpotRates() {
    return Api.get("SpotRates");
  },
  CurrentInterfaces(body) {
    return Api.post("CurrentInterfaces", body);
  },

  GetSwaps(body) {
    return Api.post("GetSwaps", body);
  },
  GetBaseRates(body) {
    return Api.post("GetBaseRates", body);
  },
  GetRateTiles(body) {
    return Api.post("GetRateTiles", body);
  },
  ChangeInterface(body) {
    return Api.post("ChangeInterface", body);
  }
};
