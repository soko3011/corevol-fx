import Api from "./Api";

export default {
  LoginUser(body) {
    return Api.post("LoginUser", body);
  },
  RegisterUser(body) {
    return Api.post("Register", body);
  },
  CheckLoginStatus(body) {
    return Api.post("CheckLoginStatus", body);
  },
  LogOutUser(body) {
    return Api.post("LogOutUser", body);
  },
  GetAllUsers() {
    return Api.get("GetAllUsers");
  },
  UpdateUser(body) {
    return Api.post("UpdateUser", body);
  },
  DeleteUser(body) {
    return Api.post("DeleteUser", body);
  },
  updateUserStartFxCross(body) {
    return Api.post("UpdateUserStartFxCross", body);
  },
  updateUserTimeZone(body) {
    return Api.post("UpdateUserTimeZone", body);
  },

};
