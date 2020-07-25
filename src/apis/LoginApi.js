import Api from "./Api";

export default {
  LoginUser(body) {
    return Api.post("LoginUser", body);
  },
  RegisterUser(body) {
    return Api.post("RegisterUser", body);
  },

  CheckLoginStatus(body) {
    return Api.post("CheckLoginStatus", body);
  },
  LogOutUser(body) {
    return Api.post("LogOutUser", body);
  }
};
