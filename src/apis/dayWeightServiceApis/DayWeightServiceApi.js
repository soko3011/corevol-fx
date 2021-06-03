import Api from "@/apis/dayWeightServiceApis/DwsApi.js";

export default {
  getAvailableCurr() {
    return Api.get("ProductionEvents/GetAvailableCurr");
  },
  getEvents(body) {
    return Api.post("ProductionEvents/GetEvents", body);
  },
  buildProductionList(body) {
    return Api.post("ProductionEvents/BuildProductionList", body);
  },
  saveDataToDB(body) {
    return Api.post("ProductionEvents/SaveDataToDB", body);
  },
  refreshEventsFromApi() {
    return Api.get("RawEvents/UpdateRawEvents/BabyPipsDotCom");
  }
};
