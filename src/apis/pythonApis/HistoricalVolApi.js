import Api from "./PyApi";

export default {
  get_historical_vols(cross) {
    return Api.get(`/historical_vols/${cross}`);
  },
  get_historical_vols_including_past_dates(cross) {
    return Api.get(`/historical_vols_including_past_dates/${cross}`);
  }
};
