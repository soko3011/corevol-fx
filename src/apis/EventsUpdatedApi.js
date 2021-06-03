import Api from "./Api";

export default {
  eventWeightsUpdated(body) {
    return Api.post("EventWeightsUpdated", body);
  }
};
