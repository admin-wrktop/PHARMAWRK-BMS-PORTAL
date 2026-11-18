import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    EmailID: "",
    FirstLoginStatus: null,
    GetCurrentUser: [],
  },
  getters: {
    get_user_email: (state) => {
      return state.EmailID;
    },
    get_login_status: (state) => {
      return state.FirstLoginStatus;
    },
    get_current_user_details: (state) => {
      return state.GetCurrentUser;
    },
  },
  mutations: {
    SET_USEREMAIL(state, EmailID) {
      state.EmailID = EmailID;
    },
    SET_LOGIN_STATUS(state, LoginFirstTimeLoginStatus) {
      state.FirstLoginStatus = LoginFirstTimeLoginStatus;
    },
    SET_CURRENTUSER_DETAILS(state, GetCurrentUserDetails) {
      state.GetCurrentUser = GetCurrentUserDetails;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
});
