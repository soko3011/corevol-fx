import Api from "./PyApi";

export default {
  get_historical_vols(cross) {
    return Api.get(`/historical_vols/${cross}`);
  },
  get_historical_vol_term_structure_grid(cross) {
    return Api.get(`/historical_vol_term_structure_grid/${cross}`);
  }
};
