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
  get_corr_cone_historical(cross, base_ccy, sample_size) {
    return Api.get(`/corr_cone/${cross}/${base_ccy}/${sample_size}`);
  },
  get_corr_moving_average(cross, base_ccy, term) {
    return Api.get(`/corr_moving_average/${cross}/${base_ccy}/${term}`);
  },
  get_historical_vol_term_structure_grid(cross, estimator) {
    return Api.get(`/historical_term_structures/${cross}/${estimator}`);
  },
  get_vol_compare(cross, term) {
    return Api.get(`/vol_compare/${cross}/${term}`);
  },
  get_historical_vol_series(cross, estimator) {
    return Api.get(`/historical_vol_series/${cross}/${estimator}`);
  },
  get_vol_cone_scanner(estimator, sample_size) {
    return Api.get(`/vol_cone_scanner/${estimator}/${sample_size}`);
  },
  get_realized_zscore_scanner(estimator, averaging_period) {
    return Api.get(`/realized_zscore_scanner/${estimator}/${averaging_period}`);
  },
  get_corr_scanner(sample_size, base_ccy) {
    return Api.get(`/corr_scanner/${sample_size}/${base_ccy}`);
  },
  get_p_ratio_scanner() {
    return Api.get(`/p_ratio_scanner`);
  },
  get_spot_series(cross) {
    return Api.get(`/spot_series/${cross}`);
  },
  refresh_historical_spots() {
    return Api.get(`/refresh_historical_spots`);
  }
};
