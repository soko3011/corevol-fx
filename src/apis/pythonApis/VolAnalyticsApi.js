import Api from "./PyApi";

export default {
  get_descriptive_vol_data(cross, date_str) {
    return Api.get(`/nlp/cross_and_expiry//${cross}/${date_str}`);
  }
};
