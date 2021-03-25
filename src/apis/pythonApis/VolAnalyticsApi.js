import Api from "./PyApi";

export default {
  get_descriptive_vol_data(cross,term,estimator,averaging_period) {
    return Api.get(`/descriptive_vol_data/${cross}/${term}/${estimator}/${averaging_period}`);
  },
  get_rolling_percentiles(cross,term,estimator,averaging_period) {
    return Api.get(`/rolling_precentiles/${cross}/${term}/${estimator}/${averaging_period}`);
  },
  get_histogram(cross,term,estimator,observations) {
    return Api.get(`/histogram/${cross}/${term}/${estimator}/${observations}`);
  },
  get_vol_cone_historical(cross,observations,estimator) {
    return Api.get(`/vol_cone/${cross}/${observations}/${estimator}`);
  },

};
