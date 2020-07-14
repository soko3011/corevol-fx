import Api from "./Api";

export default {
  GetDviSetup() {
    return Api.get("DviSetup");
  },
  GetCrossSetup() {
    return Api.get("CrossSetup");
  },
  GetCcySetup() {
    return Api.get("CcySetup");
  },
  UpdateDviDets(body) {
    return Api.post("UpdateDviDets", body);
  },
  UpdateCrossDets(body) {
    return Api.post("UpdateCrossDets", body);
  },
  UpdateCcyDets(body) {
    return Api.post("UpdateCcyDets", body);
  },
  AddNewCcyPair(body) {
    return Api.post("AddNewCcyPair", body);
  },
  DeleteCcyPairData(body) {
    return Api.post("DeleteCcyPairData", body);
  },
  DeleteCcyData(body) {
    return Api.post("DeleteCcyData", body);
  },
  MirrorCrossDets(body) {
    return Api.post("MirrorCrossDets", body);
  }
};
