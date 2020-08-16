import Vue from "vue";
import Vuex from "vuex";
import DviApi from "@/apis/DviApi";
import PricerApi from "@/apis/PricerApi";
import LoginApi from "@/apis/LoginApi";
import SettingsApi from "../apis/SettingsApi";

Vue.use(Vuex);

const state = {
  dvi: {
    main: [],
    surf: [],
    volInput: [],
    smileInput: [],
    forCal: [],
    domCal: [],
    userWgtRanges: [],
    ipvSurf: []
  },
  dvisInUse: [],

  ipvSurfData: [],

  activecross: "",
  userPrefCross: "",
  pricerLayoutName: "",
  activePricerLayout: [],
  crossList: [],

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
  SET_DVI_INIT(state, data) {
    //state.dvi = [];
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.volInput = JSON.parse(data.volInput);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.forCal = JSON.parse(data.forCal);
    state.dvi.domCal = JSON.parse(data.domCal);
    state.dvi.userWgtRanges = JSON.parse(data.userWgtRanges);
    state.dvisInUse = JSON.parse(data.dvisInUse);
    console.log(state.dvi);
  },
  SET_DVI_AFTER_VOL_UPDATE(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.volInput = JSON.parse(data.volInput);
    console.log(state.dvi.volInput);
  },
  SET_DVI_AFTER_SMILE_UPDATE(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.smileInput = JSON.parse(data.smileInput);
  },

  SET_IPV_DATA(state, rawData) {
    state.dviSurfData = JSON.parse(rawData.dviSurf);
    state.ipvSurfData = JSON.parse(rawData.ipv);
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
  }
  // SET_IPV_VOLS(state, data) {
  //   state.dviRawData.surf = JSON.stringify(data.surface);
  //   state.dviRawData.ipvString = JSON.stringify(data.ipvSurface);
  // }
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
  async initializeDviUI({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.initializeDviUI(payload);
      commit("SET_DVI_INIT", response.data);
      return true;
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async returnDviAfterVolUpdate({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.returnDviAfterVolUpdate(payload);
      commit("SET_DVI_AFTER_VOL_UPDATE", response.data);
      return true;
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async returnDviAfterSmileUpdate({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.returnDviAfterSmileUpdate(payload);
      commit("SET_DVI_AFTER_SMILE_UPDATE", response.data);
      return true;
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
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
  async checkAndLoadIpv({ commit }, payload) {
    try {
      let response = await DviApi.CheckAndLoadIpv(payload);
      commit("SET_IPV_DATA", response.data);
      let ipv = JSON.parse(response.data.ipv);
      var notNull = ipv.length > 0 ? true : false;

      return notNull;
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
  ipvSurfGetter(state) {
    let ipv = state.ipvSurfData;
    console.log(ipv.length);
    if (ipv.length !== 0) {
      return ipv;
    } else return [];
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
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
