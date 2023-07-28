import { createStore } from "vuex";
import axios from "axios";
import Cookie from "js-cookie";

export default createStore({
  state: {
    token: localStorage.getItem("token") || null,
  },
  getters: {
    getToken(state) {
      return state.token != null;
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    async login({ commit }, data) {
      try {
        const response = await axios.post("/v2/login?clientId=default", data);
        const tokens = response.data.data[0].attributes;
        commit("setToken", tokens.token);
        localStorage.setItem("token", tokens.token);
        Cookie.set("jwt", tokens["refresh-token"]);
      } catch (error) {
        throw new Error("Authentication failed");
      }
    },
    async fetchBalance({ state }) {
      try {
        const response = await axios.get(
          `/v2/users/me/balance?clientId=default&auth=${state.token}`
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
    async fetchGames() {
      try {
        const response = await axios.get("/v2/casino/games?clientId=default");
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch games");
      }
    },
    async playDemo(_, gameId) {
      try {
        const response = await axios.post(
          `/v2/casino/games/${gameId}/session-demo?clientId=default`,
          {
            responseType: "stream",
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to play demo");
      }
    },
    async refreshToken({ commit }) {
      try {
        const jwtToken = Cookie.get("jwt");
        if (jwtToken) {
          const response = await axios.post("/auth/token?clientId=default", {
            clientId: "default",
            refreshToken: jwtToken,
          });
          console.log(response);
          Cookie.set("jwt", response.data["refresh-token"]);
          const token = response.data.token;
          localStorage.setItem("token", token);
          commit("setToken", token);
        } else {
          return;
        }
      } catch (error) {
        throw new Error("Failed to refresh token");
      }
    },
  },
  modules: {},
});
