import Vue from "vue";
import Vuex from "vuex";
import DviApi from "@/apis/DviApi";
import PricerApi from "@/apis/PricerApi";
import LoginApi from "@/apis/LoginApi";

Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: true,
  dviRawData: null,
  dviInput: [],
  dviSmileInput: [],
  activecross: "",
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
  isAdmin: false
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
    console.log(data);
    state.rawPricerData = data;
  },
  SET_SURF(state, data) {
    state.dviRawData.surf = data.surf;
  },
  SET_INIT(state, response) {
    state.crossList = JSON.parse(response.crossList).sort();
    state.activecross = JSON.parse(response.starterFXCross);
    state.lastPricerTab = state.activecross;
  },
  SET_ACTIVE_CROSS(state, activecross) {
    state.activecross = activecross;
  },
  REFRESH_CROSSLIST(state, data) {
    state.crossList = JSON.parse(data).sort();
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
    state.currentUser = user.Username;
    state.isAdmin = user.IsAdmin;
    window.localStorage.currentUser = JSON.stringify(user.Username);
  },
  SET_ISAUTHED(state, authed) {
    state.isUserAuthed = authed;
  }
};

const actions = {
  async checkLoginStatus({ commit }) {
    try {
      let response = await LoginApi.CheckLoginStatus({
        Username: JSON.parse(window.localStorage.currentUser)
      });
      let user = JSON.parse(response.data.userProfile);
      commit("SET_ISAUTHED", user.IsAuthed);
      console.log(`Starting app: user is authed: ${state.isUserAuthed}`);
      if (user.IsAuthed === true) {
        commit("SET_CURRENT_USER", user);
      }
      return user;
    } catch {
      return { error: "There was an error.  Please try again." };
    }
  },

  async logOutUser({ dispatch, commit }) {
    try {
      let response = await LoginApi.LogOutUser({
        Username: JSON.parse(window.localStorage.currentUser)
      });
      let user = JSON.parse(response.data.userProfile);
      commit("SET_ISAUTHED", user.IsAuthed);
      dispatch("setSnackbar", {
        text: `${user.Username} is signed out`
      });

      return user;
    } catch {
      return { error: "There was an error.  Please try again." };
    }
  },

  async login({ commit }, loginInfo) {
    try {
      let response = await LoginApi.LoginUser(loginInfo);
      let user = JSON.parse(response.data.userProfile);
      commit("SET_ISAUTHED", user.IsAuthed);

      if (user.IsAuthed === true) {
        commit("SET_CURRENT_USER", user);
      }
      return user;
    } catch {
      return { error: "There was an error.  Please try again." };
    }
  },
  async register({ commit }, registrationInfo) {
    try {
      let response = await LoginApi.RegisterUser(registrationInfo);
      let user = JSON.parse(response.data.userProfile);

      commit("SET_ISAUTHED", user.IsAuthed);

      if (user.IsAuthed === true) {
        commit("SET_CURRENT_USER", user);
      }
      return user;
    } catch {
      return { error: "There was an error.  Please try again." };
    }
  },

  setSnackbar({ commit }, snackbar) {
    snackbar.showing = true;
    snackbar.color = snackbar.color || "dark";
    commit("SET_SNACKBAR", snackbar);
  },
  initApp({ commit }) {
    return new Promise((resolve, reject) => {
      DviApi.getInitialize()
        .then(response => {
          commit("SET_INIT", response.data);

          resolve(response.status);
        })
        .catch(error => {
          reject(error);
        });
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
  returnDviWithIpvMatch({ commit }, payload) {
    return new Promise((resolve, reject) => {
      DviApi.MatchSurfaceToIpvInputs(payload)
        .then(response => {
          commit("SET_DVI_DATA", response.data.dviReturn.value);
          resolve(response.status);
        })
        .catch(err => {
          reject(err.status);
        });
    });
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
  refreshCrossList({ commit }, payload) {
    commit("REFRESH_CROSSLIST", payload);
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
    console.log(JSON.parse(state.dviRawData.surf));
    return JSON.parse(state.dviRawData.surf);
  },
  dviGetter(state) {
    return JSON.parse(state.dviRawData.show);
  },
  crossListGetter(state) {
    return Object.values(state.crossList);
  },
  pricerLayoutGetter(state) {
    return state.pricerLayoutName;
  },
  activeCrossGetter(state) {
    return state.activecross;
  },
  dviInputGetter(state) {
    //return JSON.parse(state.dviRawData.dviInput);
    return state.dviInput;
  },
  dviSmileInputGetter(state) {
    //return JSON.parse(state.dviRawData.smileInput);
    return state.dviSmileInput;
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
