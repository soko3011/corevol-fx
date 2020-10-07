import Vue from "vue";
import Vuex from "vuex";
import DviApi from "@/apis/DviApi";
import PricerApi from "@/apis/PricerApi";
import LoginApi from "@/apis/LoginApi";
import SettingsApi from "../apis/SettingsApi";
import Axios from "axios";

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
    ipvSurf: [],
    autoSave: true,
    lastUpdate: []
  },
  rightSideNav: false,
  fwdVolInputs: {},
  dvisInUse: [],
  sidebarMinified: true,
  activecross: "",
  userPrefCross: "",
  crossList: [],
  defaultPricerKeyGroups: {},
  lastPricerTab: "",
  lastPricerCellCoords: [],
  currentUser: "",
  snackbars: [],
  isUserAuthed: false,
  isAdmin: false,
  token: "",
  dashBoardPrefs: [],
  userPricerLayoutPrefs: [],
  dviPrefs: {
    autoSaveSwitch: false,
    dayWgtRangesSwitch: false,
    ipvSwitch: false
  },
  activePricerLayoutTitle: "Trader",
  pricerSetupToggle: false,
  pricerSetupClosed: false
};

const mutations = {
  SET_PRICER_SETUP_TOGGLE(state, data) {
    state.pricerSetupToggle = !state.pricerSetupToggle;
    if (data === "setupClosed") {
      state.pricerSetupClosed = !state.pricerSetupClosed;
    }
  },
  SET_ACTIVE_PRICERLAYOUT_TITLE(state, data) {
    state.activePricerLayoutTitle = data;
  },
  SET_DEFAULT_PRICERKEYGROUPS(state, data) {
    state.defaultPricerKeyGroups = data;
  },
  TOGGLE_RIGHT_NAV(state) {
    state.rightSideNav = !state.rightSideNav;
  },
  SET_FWDVOL_INPUTS(state, data) {
    state.fwdVolInputs = data;
  },
  SET_SIDEBARMINIFIED(state) {
    state.sidebarMinified = !state.sidebarMinified;
  },
  SET_SNACKBAR(state, snackbar) {
    state.snackbars = state.snackbars.concat(snackbar);
  },
  SET_AUTOSAVE(state, data) {
    state.dvi.autoSave = data;
  },
  SET_DVI_INIT(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.volInput = JSON.parse(data.volInput);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.forCal = JSON.parse(data.forCal);
    state.dvi.domCal = JSON.parse(data.domCal);
    state.dvi.userWgtRanges = JSON.parse(data.userWgtRanges);
    state.dvisInUse = JSON.parse(data.dvisInUse);
    state.dvi.ipvSurf = JSON.parse(data.ipvSurf);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_VOL_UPDATE(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.volInput = JSON.parse(data.volInput);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_SMILE_UPDATE(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_USERWGT_UPDATE(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_USERWGTRANGE_UPDATE(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.userWgtRanges = JSON.parse(data.userWgtRanges);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_GLOBAL_DOWNLOAD(state, data) {
    state.dvi.main = JSON.parse(data.main);
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.volInput = JSON.parse(data.volInput);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.userWgtRanges = JSON.parse(data.userWgtRanges);
  },

  SET_IPV_DATA(state, data) {
    state.dvi.surf = JSON.parse(data.dviSurf);
    state.dvi.ipvSurf = JSON.parse(data.ipvSurf);
  },
  SET_SURF(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
  },

  SET_ACTIVE_CROSS(state, activecross) {
    state.activecross = activecross;
  },
  SET_USER_PREF_CROSS(state, user) {
    state.userPrefCross = user.StarterFxCross;
  },

  SET_LAST_PRICER_TAB(state, data) {
    state.lastPricerTab = data;
  },
  SET_LAST_PRICER_CELL_POS(state, data) {
    state.lastPricerCellCoords = data;
  },

  SET_CURRENT_USER(state, user) {
    state.currentUser = user.UserName;
    state.isAdmin = user.IsAdmin;
    window.localStorage.currentUser = JSON.stringify(user.UserName);
    state.userPrefCross = user.StarterFxCross;
    state.dashBoardPrefs = JSON.parse(user.DashBoardPrefs);
    state.userPricerLayoutPrefs = JSON.parse(user.PricerLayoutPrefs);
    state.activePricerLayoutTitle = user.ActivePricerLayoutTitle;
    if (user.DviPrefs !== null) {
      state.dviPrefs = JSON.parse(user.DviPrefs);
    }
    console.log(state.dviPrefs);
  },
  SET_ISAUTHED(state, user) {
    state.isUserAuthed = user.IsAuthed;
    state.token = user.TokenString;
  },
  SET_CROSSLIST(state, data) {
    state.crossList = JSON.parse(data).sort();
  }
};

const actions = {
  togglePricerSetupPage({ commit }, data) {
    commit("SET_PRICER_SETUP_TOGGLE", data);
  },
  async setPricerLayoutTitle({ commit }, data) {
    commit("SET_ACTIVE_PRICERLAYOUT_TITLE", data);

    try {
      let response = await PricerApi.SetPricerLayoutTitle({
        UserName: state.currentUser,
        ActivePricerLayoutTitle: data
      });
      console.log(`activeLayoutTitleSaved ${response.status}`);
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async getDefaultPricerKeyGroups({ dispatch, commit }) {
    try {
      let response = await PricerApi.GetDefaultPricerKeyGroups();

      var keyGroups = JSON.parse(response.data.result);

      commit("SET_DEFAULT_PRICERKEYGROUPS", keyGroups);
      return true;
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async saveDviPrefs({ dispatch }, data) {
    try {
      let response = await DviApi.saveDviPrefs({
        UserName: state.currentUser,
        DviPrefs: JSON.stringify(data)
      });

      console.log("dviPrefs saved");
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async saveUserPricerLayoutPrefs({ dispatch }, data) {
    try {
      let response = await PricerApi.SaveUserPricerLayoutPrefs({
        UserName: state.currentUser,
        PricerLayoutPrefs: JSON.stringify(data)
      });
      dispatch("setSnackbar", {
        text: `PricerSetup saved. Status: ${response.status}`
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async saveDefaultTraderLayout({ dispatch }, data) {
    try {
      let response = await PricerApi.SavePricerSetup(data);
      dispatch("setSnackbar", {
        text: `PricerSetup saved. Status: ${response.status}`
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  toggleRightNav({ commit }) {
    commit("TOGGLE_RIGHT_NAV");
  },
  async getBrowserTimezone() {
    try {
      let response = await Axios.get("https://worldtimeapi.org/api/ip");
      return response.data.timezone;
    } catch (e) {
      alert(e);
    }
  },
  async setPricerNew({ dispatch }, pricerName) {
    try {
      let response = await PricerApi.setPricer({
        UserName: state.currentUser,
        PricerData: { PricerTitle: pricerName }
      });

      return JSON.parse(response.data.storedPricerData);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `Error: ${err} `
      });
    }
  },
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
      console.log(e);
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
  async login({ dispatch, commit }, loginInfo) {
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
  setSidebarMinified({ commit }) {
    commit("SET_SIDEBARMINIFIED");
  },
  setAutoSave({ commit }, data) {
    commit("SET_AUTOSAVE", data);
  },
  setSnackbar({ commit }, snackbar) {
    snackbar.showing = true;
    snackbar.color = snackbar.color || "dark";

    commit("SET_SNACKBAR", snackbar);
  },
  refreshCrossList({ commit }) {
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
  async returnDviAfterUserWgtUpdate({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.returnDviAfterUserWgtUpdate(payload);
      commit("SET_DVI_AFTER_USERWGT_UPDATE", response.data);
      return true;
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async returnDviAfterUserWgtRangeUpdate({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.returnDviAfterUserWgtRangeUpdate(payload);
      commit("SET_DVI_AFTER_USERWGTRANGE_UPDATE", response.data);
      return true;
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async returnMatchIpvSmile({ commit }, payload) {
    try {
      let response = await DviApi.returnMatchIpvSmile(payload);
      commit("SET_DVI_AFTER_SMILE_UPDATE", response.data);
      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  async returnMatchIpvAtm({ commit }, payload) {
    try {
      let response = await DviApi.returnMatchIpvAtm(payload);
      commit("SET_DVI_AFTER_VOL_UPDATE", response.data);
      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  async returnMatchIpvMults({ commit }, payload) {
    try {
      let response = await DviApi.returnMatchIpvMults(payload);
      commit("SET_SURF", response.data);
      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  async checkAndLoadIpv({ commit }, payload) {
    try {
      let response = await DviApi.CheckAndLoadIpv(payload);
      commit("SET_IPV_DATA", response.data);
      let ipv = JSON.parse(response.data.ipvSurf);
      var notNull = ipv.length > 0 ? true : false;

      return notNull;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  async downloadGlobalDvi({ commit }, payload) {
    try {
      let response = await DviApi.downloadGlobalDvi(payload);
      commit("SET_DVI_AFTER_GLOBAL_DOWNLOAD", response.data);

      return JSON.parse(response.data.globalDviExist);
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  updateMultsAndSpreads({ commit }, payload) {
    DviApi.UpdateMultsAndSpreads(payload).then(response => {
      commit("SET_SURF", response.data);
    });
  },
  setActivecross({ commit }, payload) {
    commit("SET_ACTIVE_CROSS", payload);
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
        UserName: state.currentUser,
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
  },
  fwdVolInputsFromDviTable({ commit }, payload) {
    commit("SET_FWDVOL_INPUTS", payload);
  }
};

const getters = {
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
