import Api from "./Api";

export default {
  setPricer(body) {
    return Api.post("SetPricer", body);
  },
  RemovePricerFromUse(body) {
    return Api.post("RemovePricerFromUse", body);
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
  ReCalcOpt(body) {
    return Api.post("FxOpt", body);
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
  SaveUserPricerLayoutPrefs(body) {
    return Api.post("SaveUserPricerLayoutPrefs", body);
  },
  GetDefaultPricerKeyGroups() {
    return Api.get("GetDefaultPricerKeyGroups");
  },
  SetPricerLayoutTitle(body) {
    return Api.post("SetPricerLayoutTitle", body);
  }
};
