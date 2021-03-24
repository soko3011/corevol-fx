import Api from "./PyApi";

export default {
  get_descriptive_vol_data(cross,term) {
    return Api.get(`/descriptive_vol_data/${cross}/${term}`);
  },
  get_rolling_percentiles(cross,term) {
    return Api.get(`/rolling_precentiles/${cross}/${term}`);
  },
  get_vol_cone_historical(cross,observations) {
    return Api.get(`/vol_cone/${cross}/${observations}`);
  },

};
