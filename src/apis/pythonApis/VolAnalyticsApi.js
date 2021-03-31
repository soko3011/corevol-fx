import Api from "./PyApi";

export default {
  get_descriptive_vol_data(cross, term, estimator, averaging_period) {
    return Api.get(
      `/descriptive_vol_data/${cross}/${term}/${estimator}/${averaging_period}`
    );
  },
  get_rolling_percentiles(cross, term, estimator, averaging_period) {
    return Api.get(
      `/rolling_precentiles/${cross}/${term}/${estimator}/${averaging_period}`
    );
  },
  get_histogram(cross, term, estimator, observations) {
    return Api.get(`/histogram/${cross}/${term}/${estimator}/${observations}`);
  },
  get_vol_cone_historical(cross, observations, estimator) {
    return Api.get(`/vol_cone/${cross}/${observations}/${estimator}`);
  },
  get_historical_vol_term_structure_grid(cross, estimator) {
    return Api.get(`/historical_term_structures/${cross}/${estimator}`);
  },
  get_vol_compare(cross, term) {
    return Api.get(`/vol_compare/${cross}/${term}`);
  },
  get_historical_vol_series(cross, estimator) {
    return Api.get(`/historical_vol_series/${cross}/${estimator}`);
  }
};
