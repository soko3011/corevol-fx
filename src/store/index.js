import Vue from "vue";
import Vuex from "vuex";
import DviApi from "@/apis/DviApi";
import PricerApi from "@/apis/PricerApi";
import LoginApi from "@/apis/authenticationApis/LoginApi.js";
import UserPrefsApi from "@/apis/UserPrefsApi";
import SettingsApi from "../apis/SettingsApi";
import Axios from "axios";

Vue.use(Vuex);

const state = {
  isRouterSecured: true,
  appLoaded: false,
  currentUser: "",
  userPrefCross: "",
  isUserAuthed: false,
  isAdmin: false,
  userTimeZone: "",
  spotApi: "",
  swapApi: "",
  baseRateApi: "",
  ipvVolApi: "",
  activePricerLayoutTitle: "Trader",
  dashBoardPrefs: [],
  userPricerLayoutPrefs: [],
  dviPrefs: {
    autoSaveSwitch: false
  },
  window: {
    width: 0,
    height: 0
  },
  dvi: {
    main: [],
    surf: [],
    volInput: [],
    smileInput: [],
    forCal: [],
    domCal: [],
    userWgtRanges: [],
    ipvSurf: [],
    lastUpdate: []
  },
  rightSideNav: false,
  fwdVolInputs: {},
  dvisInUse: [],
  sidebarMinified: true,
  activecross: "",
  crossList: [],
  defaultPricerKeyGroups: {},
  lastPricerTab: "",
  lastPricerCellCoords: [],
  snackbars: [],
  pricerSetupToggle: false,
  pricerSetupClosed: false,
  pricerShowTotalsToggle: false,
  pricerStrategy: [],
  activePricerList: [],
  dashBoardUpdate: [],
  analyticsTerm: "3M",
  analyticsVolType: "Raw",
  volEstimators: [
    "Raw",
    "GarmanKlass",
    "Parkinson",
    "RogersSatchell",
    "YangZhang"
  ],
  volEstimatorTerms: ["1W", "2W", "1M", "2M", "3M", "6M", "9M", "1Y", "2Y"],
  volAnalyticsSelection: "Descriptive Data"
};

const mutations = {
  SET_APP_LOADED(state) {
    setTimeout(() => {
      state.appLoaded = true;
    }, 2000);
  },
  SET_WINDOW_DIMENSIONS(state, data) {
    state.window.width = data.width;
    state.window.height = data.height - 150;
  },
  SET_ANALYTICS_TERM(state, data) {
    state.analyticsTerm = data;
  },
  SET_ANALYTICS_VOL_TYPE(state, data) {
    state.analyticsVolType = data;
  },
  SET_VOL_ANALYTICS_SELECTION(state, data) {
    state.volAnalyticsSelection = data;
  },
  SET_DASHBOARD_NOTIFIER(state, data) {
    state.dashBoardUpdate = JSON.parse(data);
  },
  SET_ACTIVE_PRICER_LIST(state, data) {
    state.activePricerList = [...data];
  },
  SET_PRICER_STRATEGY(state, data) {
    state.pricerStrategy = [];
    state.pricerStrategy = [...data];
  },
  SET_PRICER_SETUP_TOGGLE(state, data) {
    state.pricerSetupToggle = !state.pricerSetupToggle;
    if (data === "setupClosed") {
      state.pricerSetupClosed = !state.pricerSetupClosed;
    }
  },
  SET_PRICER_SHOW_TOTALS(state, data) {
    state.pricerShowTotalsToggle = data;
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
  SET_DVI_AFTER_SURFACE_UPDATE(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.volInput = JSON.parse(data.volInput);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_SMILE_UPDATE(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
    state.dvi.smileInput = JSON.parse(data.smileInput);
    state.dvi.lastUpdate = JSON.parse(data.lastUpdate);
  },
  SET_DVI_AFTER_LONGDATE_UPDATE(state, data) {
    state.dvi.surf = JSON.parse(data.surf);
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
  SET_CURRENT_USER_FROM_LOCAL_STORAGE(state) {
    state.currentUser = JSON.parse(window.localStorage.currentUser);
    state.isAdmin = JSON.parse(window.localStorage.isAdmin);
    state.isUserAuthed = JSON.parse(window.localStorage.isUserAuthed);

    let userPrefs = JSON.parse(window.localStorage.userPrefences);
    state.userPrefCross = userPrefs.StarterFxCross;
    state.userTimeZone = userPrefs.Timezone;
    state.activePricerLayoutTitle = userPrefs.ActivePricerLayout;
    state.spotApi = userPrefs.SpotApi;
    state.swapApi = userPrefs.SwapApi;
    state.baseRateApi = userPrefs.BaseRateApi;
    state.ipvVolApi = userPrefs.IpvVolApi;

    if (userPrefs.DashBoardPrefs !== null) {
      state.dashBoardPrefs = JSON.parse(userPrefs.DashBoardPrefs);
    }
    if (userPrefs.PricerLayoutPrefs !== null) {
      state.userPricerLayoutPrefs = JSON.parse(userPrefs.PricerLayoutPrefs);
    }
    if (userPrefs.DviPrefs !== null) {
      state.dviPrefs = JSON.parse(userPrefs.DviPrefs);
    }
  },
  RESET_USER(state) {
    state.currentUser = "";
    state.isAdmin = false;
    state.isUserAuthed = false;
    state.userPrefCross = "";
    state.dashBoardPrefs = [];
    state.userTimeZone = "";
    state.userPricerLayoutPrefs = [];
    state.activePricerLayoutTitle = [];
    state.dviPrefs = [];
  },
  SET_USER_PREFS(state, userPrefs) {
    window.localStorage.userPrefences = JSON.stringify(userPrefs);
  },
  SET_SINGLE_USER_PREF(state, userPref) {
    let userPrefs = JSON.parse(window.localStorage.userPrefences);
    userPrefs[userPref.key] = userPref.value;
    window.localStorage.userPrefences = JSON.stringify(userPrefs);
  },
  SET_IS_AUTHED_FALSE(state) {
    state.IsAuthed = false;
  },
  SET_LOGIN_STATUS(state, user) {
    state.currentUser = user.UserName;
    window.localStorage.currentUser = JSON.stringify(user.UserName);
    window.localStorage.token = JSON.stringify(user.TokenString);
    window.localStorage.isAdmin = JSON.stringify(user.IsAdmin);
    window.localStorage.isUserAuthed = JSON.stringify(user.IsAuthed);
  },
  SET_CROSSLIST(state, data) {
    state.crossList = JSON.parse(data).sort();
  }
};

const actions = {
  async checkLoginStatus({ commit }) {
    if (window.localStorage.currentUser === undefined) {
      window.localStorage.clear();
      commit("RESET_USER");
      return;
    }
    try {
      await LoginApi.CheckLoginStatus({
        UserName: JSON.parse(window.localStorage.currentUser)
      });
      commit("SET_CURRENT_USER_FROM_LOCAL_STORAGE");
    } catch (err) {
      window.localStorage.clear();
      commit("RESET_USER");
      alert(`Error source: CheckLoginStatus. ${err}`);
    }
  },
  async login({ commit, dispatch }, loginInfo) {
    try {
      let response = await LoginApi.LoginUser(loginInfo);
      let user = JSON.parse(response.data.userStatus);
      commit("SET_LOGIN_STATUS", user);
      await dispatch("getUserPreferences", user.UserName);
      commit("SET_CURRENT_USER_FROM_LOCAL_STORAGE");
      dispatch("setSnackbar", {
        text: `Welcome back ${user.UserName}`.toUpperCase(),
        top: true
      });
    } catch (err) {
      dispatch("setSnackbar", {
        text: err.response.data,
        top: true
      });
    }
  },
  async logOutUser({ dispatch, commit }) {
    try {
      await LoginApi.LogOutUser({
        UserName: JSON.parse(window.localStorage.currentUser)
      });
      dispatch("setSnackbar", {
        text: `${JSON.parse(
          window.localStorage.currentUser
        ).toUpperCase()} SUCCESSFULLY SIGNED OUT`
      });
      window.localStorage.clear();
    } catch (err) {
      dispatch("setSnackbar", {
        text: `There was error logging out: ${err}`
      });
    } finally {
      commit("RESET_USER");
    }
  },
  async register({ commit, dispatch }, registrationInfo) {
    try {
      let response = await LoginApi.RegisterUser(registrationInfo);
      let user = JSON.parse(response.data.userStatus);
      commit("SET_LOGIN_STATUS", user);
      let userResponse = await UserPrefsApi.registerUserPrefsToDB({
        UserName: user.UserName,
        Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      commit("SET_USER_PREFS", JSON.parse(userResponse.data.userPrefs));
      commit("SET_CURRENT_USER_FROM_LOCAL_STORAGE");
      dispatch("setSnackbar", {
        text: `WELCOME ${user.UserName}`,
        top: true
      });
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err.response.data}`,
        top: true
      });
    }
  },
  async getUserPreferences({ commit, dispatch }, userName) {
    try {
      let response = await UserPrefsApi.getUserPreferences({
        UserName: userName
      });
      let userPrefs = JSON.parse(response.data.userPrefs);
      commit("SET_USER_PREFS", userPrefs);
      await dispatch("validateUserTimeZone", userPrefs.Timezone);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async validateUserTimeZone({ dispatch }, userTimezone) {
    let browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (browserTZ === userTimezone) {
      return;
    }
    try {
      await UserPrefsApi.updateUserTimeZone({
        UserName: state.currentUser,
        Timezone: browserTZ
      });
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "Timezone",
        value: browserTZ
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}  -method: updateTimeZoneIfDifferentFromPrefs`,
        top: true
      });
    }
  },
  updateSingleUserPrefLocalStorage({ commit }, userPref) {
    commit("SET_SINGLE_USER_PREF", userPref);
    commit("SET_CURRENT_USER_FROM_LOCAL_STORAGE");
  },

  async updateSpotApi({ dispatch }, data) {
    try {
      await UserPrefsApi.updateSpotApi(data);
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "SpotApi",
        value: data.SpotApi
      });
      dispatch("setSnackbar", {
        text: "Spot Api Updated",
        centered: true
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${err}  -method: updateSpotApi`,
        top: true
      });
    }
  },
  async updateSwapApi({ dispatch }, data) {
    try {
      await UserPrefsApi.updateSwapApi(data);
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "SwapApi",
        value: data.SwapApi
      });
      dispatch("setSnackbar", {
        text: "Swap Api Updated",
        centered: true
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${err}  -method: updateSwapApi`,
        top: true
      });
    }
  },
  async updateBaseRateApi({ dispatch }, data) {
    try {
      await UserPrefsApi.updateBaseRateApi(data);
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "BaseRateApi",
        value: data.BaseRateApi
      });
      dispatch("setSnackbar", {
        text: "BaseRate Api Updated",
        centered: true
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${err}  -method: updateBaseRateApi`,
        top: true
      });
    }
  },
  async updateIpvVolApi({ dispatch }, data) {
    try {
      await UserPrefsApi.updateIpvVolApi(data);
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "IpvVolApi",
        value: data.IpvVolApi
      });
      dispatch("setSnackbar", {
        text: "IpvVol Api Updated",
        centered: true
      });
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err}  -method: updateIpvVolApi`,
        top: true
      });
    }
  },
  async saveDviPrefs({ dispatch }, data) {
    try {
      await UserPrefsApi.saveDviPrefs({
        UserName: state.currentUser
      });

      dispatch("updateSingleUserPrefLocalStorage", {
        key: "DviPrefs",
        value: JSON.stringify(data)
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async saveUserPricerLayoutPrefs({ dispatch }, data) {
    try {
      await UserPrefsApi.SaveUserPricerLayoutPrefs({
        UserName: state.currentUser,
        PricerLayoutPrefs: JSON.stringify(data)
      });
      dispatch("updateSingleUserPrefLocalStorage", {
        key: "PricerLayoutPrefs",
        value: JSON.stringify(data)
      });
      dispatch("setSnackbar", {
        text: `PricerSetup saved.`
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async saveDefaultTraderLayout({ dispatch }, data) {
    try {
      await PricerApi.SavePricerSetup(data);
      dispatch("setSnackbar", {
        text: `PricerSetup saved.`
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  setWindowDimensions({ commit }, data) {
    commit("SET_WINDOW_DIMENSIONS", data);
  },
  alertMainAppLoaded({ commit }) {
    commit("SET_APP_LOADED");
  },
  setAnalyticsTerm({ commit }, data) {
    commit("SET_ANALYTICS_TERM", data);
  },
  setAnalyticsVolType({ commit }, data) {
    commit("SET_ANALYTICS_VOL_TYPE", data);
  },
  setVolAnalyticsSelection({ commit }, data) {
    commit("SET_VOL_ANALYTICS_SELECTION", data);
  },
  dashBoardNotifier({ commit }, data) {
    commit("SET_DASHBOARD_NOTIFIER", data);
  },
  async removeActivePricer({ commit, dispatch }, data) {
    try {
      let response = await PricerApi.RemovePricerFromUse({
        userName: state.currentUser,
        PricerData: { PricerTitle: data }
      });
      let list = JSON.parse(response.data.activePricers);
      commit("SET_ACTIVE_PRICER_LIST", list);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err}  -store: removeActivePricer`,
        top: true
      });
    }
  },
  async clearAllPricers({ commit, dispatch }) {
    try {
      let response = await PricerApi.clearPricersInUse({
        UserName: state.currentUser
      });

      let list = JSON.parse(response.data.activePricers);
      commit("SET_ACTIVE_PRICER_LIST", list);
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}  -store: clearAllPricers`,
        top: true
      });
    }
  },
  async addNewActivePricer({ commit, dispatch }, data) {
    try {
      let response = await PricerApi.addNewActivePricer({
        UserName: state.currentUser,
        PricerData: { PricerTitle: data.toUpperCase() }
      });
      let list = JSON.parse(response.data.activePricers);

      commit("SET_ACTIVE_PRICER_LIST", list);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err}  -store: addNewActivePricer`,
        top: true
      });
    }
  },
  async getActivePricerListFromServer({ commit, dispatch }) {
    try {
      let response = await PricerApi.GetListOfActivePricers({
        userName: state.currentUser
      });
      let list = JSON.parse(response.data.activePricers);
      commit("SET_ACTIVE_PRICER_LIST", list);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err}. In store: getActivePricerListFromServer`,
        top: true
      });
    }
  },
  sendStrategyToPricer({ commit }, data) {
    commit("SET_PRICER_STRATEGY", data);
  },
  togglePricerSetupPage({ commit }, data) {
    commit("SET_PRICER_SETUP_TOGGLE", data);
  },
  async setPricerLayoutTitle({ dispatch }, data) {
    try {
      await UserPrefsApi.SetPricerLayoutTitle({
        UserName: state.currentUser,
        ActivePricerLayoutTitle: data
      });

      dispatch("updateSingleUserPrefLocalStorage", {
        key: "ActivePricerLayout",
        value: data
      });
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  async getDefaultPricerKeyGroups({ dispatch, commit }) {
    try {
      let response = await PricerApi.GetDefaultPricerKeyGroups();
      let keyGroups = JSON.parse(response.data.result);
      commit("SET_DEFAULT_PRICERKEYGROUPS", keyGroups);
    } catch (error) {
      dispatch("setSnackbar", {
        text: `${error}`
      });
    }
  },
  toggleRightNav({ commit }) {
    commit("TOGGLE_RIGHT_NAV");
  },
  togglePriceShowTotals({ commit }, data) {
    commit("SET_PRICER_SHOW_TOTALS", data);
  },
  async getBrowserTimezone() {
    try {
      let response = await Axios.get("https://worldtimeapi.org/api/ip");
      console.log(`${response.data.timezone} from api`);
      return response.data.timezone;
    } catch (e) {
      console.log(`${e} getting browser time zone`);
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
  setSidebarMinified({ commit }) {
    commit("SET_SIDEBARMINIFIED");
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
        text: `${err} `,
        centered: true
      });
    }
  },
  async returnDviAfterLongDateSpreadUpdate({ commit, dispatch }, payload) {
    try {
      let response = await DviApi.returnDviAfterLongDateSpreadUpdate(payload);
      commit("SET_DVI_AFTER_LONGDATE_UPDATE", response.data);
    } catch (err) {
      dispatch("setSnackbar", {
        text: `${err} `
      });
    }
  },
  async returnMatchIpvAll({ commit }, payload) {
    try {
      let response = await DviApi.returnMatchIpvAll(payload);
      commit("SET_DVI_AFTER_SURFACE_UPDATE", response.data);
      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
    }
  },
  async returnMatchIpvAtmSurf({ commit }, payload) {
    try {
      let response = await DviApi.returnMatchIpvAtmSurf(payload);
      commit("SET_DVI_AFTER_SURFACE_UPDATE", response.data);
      return response.status;
    } catch (err) {
      return { error: ` ${err}.` };
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
  async returnFixedSmileMults({ commit }, payload) {
    try {
      let response = await DviApi.returnFixedSmileMults(payload);
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
  async downloadGlobalDvi({ dispatch, commit }, payload) {
    try {
      let response = await DviApi.downloadGlobalDvi(payload);
      if (JSON.parse(response.data.dateCheck) === false) {
        return false;
      }
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
      (state.activecross === null ||
        !state.activecross === undefined ||
        state.activecross === "",
      state.activecross.length !== 6)
    ) {
      return state.userPrefCross;
    } else return state.activecross;
  },
  corrCrossGetter(state, getters) {
    let corrGetter = getters.activeCrossGetter;
    let crosses = state.crossList.filter(x => {
      return !x.includes("USD");
    });

    if (corrGetter.includes("USD")) {
      let filtered = crosses.filter(x => {
        return (
          x.includes(corrGetter.substring(0, 3)) ||
          x.includes(corrGetter.substring(3, 6))
        );
      });

      if (filtered.length > 0) {
        return filtered[0];
      }

      return "EURJPY";
    }

    return corrGetter;
  },
  lastPricerTabGetter(state) {
    if (
      state.lastPricerTab === null ||
      !state.lastPricerTab === undefined ||
      state.lastPricerTab === ""
    ) {
      return "MAIN";
    } else return state.lastPricerTab;
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
