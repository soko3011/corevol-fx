import Api from "./PyApi";
export default {
  filter_cross_and_expiry(cross, date_str) {
    return Api.get(`/nlp/cross_and_expiry/${cross}/${date_str}`);
  }
};
