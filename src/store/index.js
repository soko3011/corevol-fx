import Vue from "vue";
import Vuex from "vuex";
import DviApi from "@/apis/DviApi";
import PricerApi from "@/apis/PricerApi";
import LoginApi from "@/apis/LoginApi";
import SettingsApi from "../apis/SettingsApi";

Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: true,
  dviRawData: null,
  dviInput: [],
  dviSmileInput: [],
  activecross: "",
  userPrefCross: "",
  pricerLayoutName: "",
  activePricerLayout: [],
  crossList: [],
  iData: {},
  lastPricerTab: "",
  lastPricerCellCoords: [],
  ipvVolData: [],
  rawPricerData: [],
  currentUser: "",
  snackbars: [],
  isUserAuthed: false,
  isAdmin: false,
  token: ""
};

const mutations = {
  SET_SNACKBAR(state, snackbar) {
    state.snackbars = state.snackbars.concat(snackbar);
  },
  SET_DVI_DATA(state, dviRawData) {
    state.dviRawData = dviRawData;

    state.dviInput = JSON.parse(dviRawData.dviInput);
    state.dviSmileInput = JSON.parse(dviRawData.smileInput);
  },
  SET_DVI_INPUT(state, data) {
    state.dviInput = data.inputs;
    state.dviSmileInput = data.smileInputs;
  },
  SET_DVI_INPUT_TO_IPV(state, data) {
    state.dviInput = data;
  },
  SET_PRICER(state, data) {
    state.rawPricerData = data;
  },
  SET_SURF(state, data) {
    state.dviRawData.surf = data.surf;
  },
  SET_ACTIVE_CROSS(state, activecross) {
    state.activecross = activecross;
  },
  SET_USER_PREF_CROSS(state, user) {
    state.userPrefCross = user.StarterFxCross;
  },

  SET_PRICER_LAYOUT(state, data) {
    state.pricerLayoutName = data.name;
    state.activePricerLayout = data.layout;
  },
  SET_LAST_PRICER_TAB(state, data) {
    state.lastPricerTab = data;
  },
  SET_LAST_PRICER_CELL_POS(state, data) {
    state.lastPricerCellCoords = data;
  },
  SET_IDATA(state, iData) {
    Object.assign(state.iData, iData);
  },
  GET_IPV_VOLS(state, data) {
    state.ipvVolData = data;
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user.UserName;
    state.isAdmin = user.IsAdmin;
    window.localStorage.currentUser = JSON.stringify(user.UserName);
  },
  SET_ISAUTHED(state, user) {
    state.isUserAuthed = user.IsAuthed;
    state.token = user.TokenString;
  },
  SET_CROSSLIST(state, data) {
    state.crossList = JSON.parse(data).sort();
  },
  SET_IPV_VOLS(state, data) {
    state.dviRawData.surf = JSON.stringify(data.surface);
    state.dviRawData.ipvString = JSON.stringify(data.ipvSurface);
  }
};

const actions = {
  async checkLoginStatus({ commit }) {
    try {
      let response = await LoginApi.CheckLoginStatus({
        Email: JSON.parse(window.localStorage.currentUser)
      });

      let user = JSON.parse(response.data.userProfile);

      commit("SET_ISAUTHED", user);

      if (user.IsAuthed === true) {
        commit("SET_CURRENT_USER", user);
        commit("SET_USER_PREF_CROSS", user);
      }

      return user;
    } catch (e) {
      alert(e);
      return { error: "There was an error.  Please try again." };
    }
  },

  async logOutUser({ dispatch, commit }) {
    try {
      let response = await LoginApi.LogOutUser({
        Email: JSON.parse(window.localStorage.currentUser)
      });
      let user = JSON.parse(response.data.userProfile);
      commit("SET_ISAUTHED", user.IsAuthed);
      dispatch("setSnackbar", {
        text: `${user.Email} is signed out`
      });

      return user;
    } catch {
      return { error: "There was an error.  Please try again." };
    }
  },

  async login({ commit }, loginInfo) {
    try {
      let response = await LoginApi.LoginUser(loginInfo);
      let serverData = JSON.parse(response.data.serverData);

      if (serverData.ModelError !== null) {
        return { error: serverData.ModelError };
      }
      if (serverData.BadRequest !== null) {
        return { error: serverData.BadRequest };
      } else {
        let user = serverData.UserProfile;

        commit("SET_ISAUTHED", user);

        if (user.IsAuthed === true) {
          commit("SET_CURRENT_USER", user);
        }
        return user;
      }
    } catch (err) {
      return { error: `There was an error. ${err}.` };
    }
  },
  async register({ commit }, registrationInfo) {
    try {
      let response = await LoginApi.RegisterUser(registrationInfo);
      let serverData = JSON.parse(response.data.serverData);

      if (serverData.ModelError !== null) {
        return { error: serverData.ModelError };
      }
      if (serverData.BadRequest !== null) {
        return { error: serverData.BadRequest };
      } else {
        let user = serverData.UserProfile;

        commit("SET_ISAUTHED", user);

        if (user.IsAuthed === true) {
          commit("SET_CURRENT_USER", user);
        }
        return user;
      }
    } catch (err) {
      return { error: `There was an error. ${err}.` };
    }
  },

  setSnackbar({ commit }, snackbar) {
    snackbar.showing = true;
    snackbar.color = snackbar.color || "dark";
    commit("SET_SNACKBAR", snackbar);
  },

  RefreshCrossList({ commit }) {
    SettingsApi.GetCrossList()
      .then(response => {
        commit("SET_CROSSLIST", response.data.crossList);
      })
      .catch(err => {
        alert(err);
      });
  },
  ChangeDviCcyPair({ commit }, payload) {
    return new Promise((resolve, reject) => {
      DviApi.changeDviCcyPair(payload)
        .then(response => {
          commit("SET_DVI_DATA", response.data);
          resolve(response.status);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  RefreshDvi({ commit }, payload) {
    return new Promise((resolve, reject) => {
      DviApi.getDviData(payload)
        .then(response => {
          commit("SET_DVI_DATA", response.data);
          resolve(response.status);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  loadDviWithPayload({ commit }, payload) {
    DviApi.getDviData(payload).then(response => {
      commit("SET_DVI_DATA", response.data);
    });
  },
  async returnDviWithIpvMatch({ commit }, payload) {
    try {
      let response = await DviApi.MatchSurfaceToIpvInputs(payload);

      commit("SET_DVI_DATA", response.data.dviReturn.value);

      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },

  getIpvVolData({ commit }) {
    DviApi.GetIpvSurfaces().then(response => {
      var data = JSON.parse(response.data.dashBoardSurfs);
      commit("GET_IPV_VOLS", data);
    });
  },
  updateMultsAndSpreads({ commit }, payload) {
    DviApi.UpdateMultsAndSpreads(payload).then(response => {
      commit("SET_SURF", response.data);
    });
  },
  setActivecross({ commit }, payload) {
    commit("SET_ACTIVE_CROSS", payload);
  },
  AddIpvVol({ commit }, payload) {
    commit("SET_IPV_VOLS", payload);
  },

  setPricerLayout({ commit }, payload) {
    commit("SET_PRICER_LAYOUT", payload);
  },
  setPricerTab({ commit }, payload) {
    commit("SET_LAST_PRICER_TAB", payload);
  },
  updateDviInput({ commit }, payload) {
    commit("SET_DVI_INPUT", payload);
  },
  resetDviInputToIpv({ commit }, payload) {
    commit("SET_DVI_INPUT_TO_IPV", payload);
  },
  setLastCellPosition({ commit }, payload) {
    commit("SET_LAST_PRICER_CELL_POS", payload);
  },
  setIdataObject({ dispatch, commit }, payload) {
    commit("SET_IDATA", payload);
    dispatch("loadDviWithPayload", this.state.iData);
  },
  ChangePricer({ commit }, pricerName) {
    return new Promise((resolve, reject) => {
      PricerApi.setPricer({
        User: state.currentUser,
        PricerData: { PricerTitle: pricerName }
      })
        .then(response => {
          commit("SET_PRICER", response.data);
          resolve(response.status);
        })
        .catch(err => {
          reject(err.status);
        });
    });
  },
  changeCurrentUser({ commit }, payload) {
    commit("SET_CURRENT_USER", payload);
  }
};

const getters = {
  surfGetter(state) {
    return JSON.parse(state.dviRawData.surf);
  },
  ipvSurfGetter(state) {
    let ipv = JSON.parse(state.dviRawData.ipvString);
    if (ipv !== "null") {
      return ipv;
    } else return [];
  },
  dviGetter(state) {
    return JSON.parse(state.dviRawData.show);
  },

  activeCrossGetter(state) {
    if (
      state.activecross === null ||
      !state.activecross === undefined ||
      state.activecross === ""
    ) {
      return state.userPrefCross;
    } else return state.activecross;
  },
  lastPricerTabGetter(state) {
    if (
      state.lastPricerTab === null ||
      !state.lastPricerTab === undefined ||
      state.lastPricerTab === ""
    ) {
      return state.userPrefCross;
    } else return state.lastPricerTab;
  },
  forCalGetter(state) {
    return JSON.parse(state.dviRawData.forCal);
  },
  domCalGetter(state) {
    return JSON.parse(state.dviRawData.domCal);
  },
  userRangeGetter(state) {
    return JSON.parse(state.dviRawData.userRange);
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
