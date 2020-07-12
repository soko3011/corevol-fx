import Api from "./Api";

export default {
  GetDviSetup() {
    return Api.get("DviSetup");
  },
  GetCrossSetup() {
    return Api.get("CrossSetup");
  },
  UpdateDviDets(body) {
    return Api.post("UpdateDviDets", body);
  },
  UpdateCrossDets(body) {
    return Api.post("UpdateCrossDets", body);
  },
  AddNewCcyPair(body) {
    return Api.post("AddNewCcyPair", body);
  },
  DeleteCcyPairData(body) {
    return Api.post("DeleteCcyPairData", body);
  }
};
