import Api from "./Api";

export default {
  getInitialize() {
    return Api.get("Initialize");
  },
  returnDviAfterVolUpdate(body) {
    return Api.post("ReturnDviAfterVolUpdate", body);
  },
  initializeDviUI(body) {
    return Api.post("InitializeDviUI", body);
  },
  changeDviCcyPair(body) {
    return Api.post("ChangeDviCcyPair", body);
  },
  UpdateMultsAndSpreads(body) {
    return Api.post("UpdateMultsAndSpreads", body);
  },
  DelRangeFromList(body) {
    return Api.post("DelRangeFromList", body);
  },
  MatchSurfaceToIpvInputs(body) {
    return Api.post("MatchSurfaceToIpvInputs", body);
  },
  GetListOfActiveDvis(body) {
    return Api.post("GetListOfActiveDvis", body);
  },
  RemoveDviFromUse(body) {
    return Api.post("RemoveDviFromUse", body);
  },
  GetDashBoardSurfs() {
    return Api.get("GetDashBoardSurfs");
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
  CheckAndLoadIpv(body) {
    return Api.post("CheckAndLoadIpv", body);
  },
  MatchIpvMults(body) {
    return Api.post("MatchIpvMults", body);
  },
  returnDviAfterSmileUpdate(body) {
    return Api.post("ReturnDviAfterSmileUpdate", body);
  }
};
