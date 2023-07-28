import axios from "axios";
import store from "@/store/index.js";

axios.defaults.baseURL = "https://poker.evenbetpoker.com/api/web/";

let refresh = false;

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;

      await store.dispatch("refreshToken", {});
    }
    refresh = false;
    return error;
  }
);
