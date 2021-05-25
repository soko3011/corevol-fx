import Api from "./Api";

export default {
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
  }
};
