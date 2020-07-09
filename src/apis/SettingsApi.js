import Api from "./Api";

export default {
  GetDviSetup() {
    return Api.get("DviSetup");
  },
  GetCrossSetup() {
    return Api.get("CrossSetup");
  },
  AmendCcyPairData(body) {
    return Api.post("AmendCcyPairData", body);
  }
};
