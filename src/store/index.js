import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
    loginModal: false,
    movieId: "",
    filterId: "",
    isTimeFilter: "",
    listOfMovies: [],
    favBtnClick: false,
  },
  // getters methods are use for getting value of function like, {{ $store.getters.selectedId }}
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
    SELECTED_MOVIE_LIST(state, listOfMovies) {
      state.listOfMovies = listOfMovies;
    },
    SELECTED_FILTER_ID(state, filterId) {
      state.filterId = filterId;
    },
    TOGGLE_TIME_FILTER(state, isTimeFilter) {
      state.isTimeFilter = isTimeFilter;
    },
    TOGGLE_FAV_BTN(state) {
      state.favBtnClick = !state.favBtnClick;
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
    selectedMovieList({ commit }, listOfMovies) {
      commit("SELECTED_MOVIE_LIST", listOfMovies);
    },
    selectedFilterId({ commit }, filterId) {
      commit("SELECTED_FILTER_ID", filterId);
    },
    toggleTimeFilter({ commit }, isTimeFilter) {
      commit("TOGGLE_TIME_FILTER", isTimeFilter);
    },
    toggleFavBtn({ commit }) {
      commit("TOGGLE_FAV_BTN");
    },
  },
});

export default store;
