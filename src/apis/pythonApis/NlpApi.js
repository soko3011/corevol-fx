import Api from "./PyApi";
export default {
  filter_cross_and_expiry(cross, date_str) {
    return Api.get(`/nlp/cross_and_expiry/${cross}/${date_str}`);
  },
  filter_mat_group(cross, date_str, mat_group) {
    return Api.get(`/nlp/mat_group/${cross}/${date_str}/${mat_group}`);
  },
  filter_smile(cross, date_str) {
    return Api.get(`/nlp/smile/${cross}/${date_str}`);
  },
  get_summary(date_str) {
    return Api.get(`/nlp/summary/${date_str}`);
  },
  get_chat_dates() {
    return Api.get(`/nlp/chat_dates`);
  }
};
