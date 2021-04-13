/* eslint-disable  no-unused-vars */
import axios from "axios";
import store from "@/store/index.js";

export const base = "https://corevolapi-swfmuuo65q-ez.a.run.app/";
//export const base = "http://localhost:5002/";

const baseURL = `${base}api/`;

let Api = axios.create({
  baseURL
});

const authentication = Api.interceptors.request.use(config => {
  // We are importing store before it is populated.
  // We intercept the request and use the current apiKey
  config.headers = { Authorization: `Bearer ${store.state.token}` };
  return config;
});

export default Api;
