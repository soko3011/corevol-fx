/* eslint-disable  no-unused-vars */
import axios from "axios";

export const base = process.env.VUE_APP_PYTHON_API;

const baseURL = `${base}/api/`;

let Api = axios.create({
  baseURL
});

Api.interceptors.request.use(config => {
  let token =
    window.localStorage.token !== undefined
      ? JSON.parse(window.localStorage.token)
      : null;
  config.headers = { Authorization: `Bearer ${token}` };
  return config;
});

export default Api;
