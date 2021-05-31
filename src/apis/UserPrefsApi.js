import Api from "./Api";

export default {
  getAvailableServices() {
    return Api.get("GetAvailableServices");
  },
  getUserPreferences(body) {
    return Api.post("GetUserPreferences", body);
  },
  updateUserStartFxCross(body) {
    return Api.post("UpdateUserStartFxCross", body);
  },
  updateUserTimeZone(body) {
    return Api.post("UpdateUserTimeZone", body);
  },
  saveUserDashBoardPrefs(body) {
    return Api.post("SaveUserDashBoardPrefs", body);
  },
  saveDviPrefs(body) {
    return Api.post("SaveDviPrefs", body);
  },
  SaveUserPricerLayoutPrefs(body) {
    return Api.post("SaveUserPricerLayoutPrefs", body);
  },
  SetPricerLayoutTitle(body) {
    return Api.post("SetPricerLayoutTitle", body);
  },
  updateSpotApi(body) {
    return Api.post("UpdateSpotApi", body);
  },
  updateSwapApi(body) {
    return Api.post("UpdateSwapApi", body);
  },
  updateBaseRateApi(body) {
    return Api.post("UpdateBaseRateApi", body);
  },
  updateIpvVolApi(body) {
    return Api.post("UpdateIpvVpolApi", body);
  },
  deleteUserPrefsFromDB(body) {
    return Api.post("DeleteUserPrefsFromDB", body);
  },
  registerUserPrefsToDB(body) {
    return Api.post("RegisterUserPrefsToDB", body);
  }
};
