import Api from "./Api";

export default {
  getInitialize() {
    return Api.get("Initialize");
  },
  returnDviAfterUserWgtUpdate(body) {
    return Api.post("ReturnDviAfterUserWgtUpdate", body);
  },
  returnDviAfterUserWgtRangeUpdate(body) {
    return Api.post("ReturnDviAfterUserWgtRangeUpdate", body);
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
  returnMatchIpvSmile(body) {
    return Api.post("ReturnMatchIpvSmile", body);
  },
  returnMatchIpvAtm(body) {
    return Api.post("ReturnMatchIpvAtm", body);
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
  returnMatchIpvMults(body) {
    return Api.post("ReturnMatchIpvMults", body);
  },
  returnDviAfterSmileUpdate(body) {
    return Api.post("ReturnDviAfterSmileUpdate", body);
  }
};
