import Api from "./Api";

export default {
  initializeDviUI(body) {
    return Api.post("InitializeDviUI", body);
  },
  returnDviAfterVolUpdate(body) {
    return Api.post("ReturnDviAfterVolUpdate", body);
  },
  returnDviAfterSmileUpdate(body) {
    return Api.post("ReturnDviAfterSmileUpdate", body);
  },
  returnDviAfterUserWgtUpdate(body) {
    return Api.post("ReturnDviAfterUserWgtUpdate", body);
  },
  returnDviAfterUserWgtRangeUpdate(body) {
    return Api.post("ReturnDviAfterUserWgtRangeUpdate", body);
  },
  UpdateMultsAndSpreads(body) {
    return Api.post("UpdateMultsAndSpreads", body);
  },
  DelRangeFromList(body) {
    return Api.post("DelRangeFromList", body);
  },
  CheckAndLoadIpv(body) {
    return Api.post("CheckAndLoadIpv", body);
  },
  returnMatchIpvAtm(body) {
    return Api.post("ReturnMatchIpvAtm", body);
  },
  returnMatchIpvSmile(body) {
    return Api.post("ReturnMatchIpvSmile", body);
  },
  returnMatchIpvMults(body) {
    return Api.post("ReturnMatchIpvMults", body);
  },
  getDviObject(body) {
    return Api.post("GetDviObject", body);
  },
  RemoveDviFromUse(body) {
    return Api.post("RemoveDviFromUse", body);
  },
  GetDashBoardSurfs(body) {
    return Api.post("GetDashBoardSurfs", body);
  },
  GetIpvSurfaces() {
    return Api.get("GetIpvSurfaces");
  },
  GetSingleDashBoardSurf(body) {
    return Api.post("GetSingleDashBoardSurf", body);
  },
  CheckSessionDviCount() {
    return Api.get("CheckSessionDviCount");
  },
  downloadGlobalDvi(body) {
    return Api.post("DownloadGlobalDvi", body);
  },
  saveUserDashBoardPrefs(body) {
    return Api.post("SaveUserDashBoardPrefs", body);
  }
};
