import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
    loginModal: false,
    movieId: 0,
  },
  getters: {
    user(state) {
      return state.user;
    },
    selectedId(state) {
      return state.movieId;
    },
  },
  mutations: {
    SET_USER(state, data) {
      state.user.data = data;
    },
    SELECTED_MOVIE_ID(state, movieId) {
      state.movieId = movieId;
    },
    SET_LOGGED_IN(state) {
      state.user.loggedIn = true;
    },
    SET_LOGGED_OUT(state) {
      state.user.loggedIn = false;
    },
    TOGGLE_LOGIN_MODAL(state) {
      state.loginModal = !state.loginModal;
    },
  },
  actions: {
    selectedMovieId({ commit }, movieId) {
      commit("SELECTED_MOVIE_ID", movieId);
    },
    setLoggedIn({ commit }) {
      commit("SET_LOGGED_IN");
    },
    setLoggedOut({ commit }) {
      commit("SET_LOGGED_OUT");
    },
    toggleLoginModal({ commit }) {
      commit("TOGGLE_LOGIN_MODAL");
    },
  },
});

export default store;
