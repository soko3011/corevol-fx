import Api from "./Api";

export default {
  setPricer(body) {
    return Api.post("SetPricer", body);
  },
  RemovePricerFromUse(body) {
    return Api.post("RemovePricerFromUse", body);
  },
  clearPricersInUse(body) {
    return Api.post("ClearPricersInUse", body);
  },
  getLayouts() {
    return Api.get("GetPricerLayouts");
  },
  GetListOfActivePricers(body) {
    return Api.post("GetListOfActivePricers", body);
  },
  SaveLayout(body) {
    return Api.post("SavePricerLayout", body);
  },
  SetPricerLayout(body) {
    return Api.post("SetPricerLayout", body);
  },
  calculateSingleOption(body) {
    return Api.post("CalculateSingleOption", body);
  },
  calculateContainer(body) {
    return Api.post("CalculateContainer", body);
  },
  GetSurfaceStatus(body) {
    return Api.post("GetSurfaceStatus", body);
  },
  ReturnCurrentOpts(body) {
    return Api.post("CurrentOpts", body);
  },
  GetSingleSpot(body) {
    return Api.post("GetSingleSpot", body);
  },
  getSingleSpotLiveForce(body) {
    return Api.post("GetSingleSpotLiveForce", body);
  },
  SavePricerSetup(body) {
    return Api.post("SavePricerSetup", body);
  },

  GetDefaultPricerKeyGroups() {
    return Api.get("GetDefaultPricerKeyGroups");
  },

  getStrategyVol(body) {
    return Api.post("GetStrategyVol", body);
  },
  addNewActivePricer(body) {
    return Api.post("AddNewActivePricer", body);
  },
  getGlobalTermsList() {
    return Api.get("GetGlobalTermsList");
  },
  simulateOptions(body) {
    return Api.post("SimulateOptions", body);
  },
  simulateOptionsTimeAdusted(body) {
    return Api.post("SimulateOptionsTimeAdusted", body);
  }
};
