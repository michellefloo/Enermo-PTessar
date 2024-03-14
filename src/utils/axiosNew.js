import axios from "axios";
import { getAuthToken } from "../utils/auth";

const instance = axios.create({
  baseURL: "https://devapi.automa.me/api",
  timeout: 900000,
});

instance.interceptors.request.use(async (config) => {
  config.headers = {
    Authorization: await getAuthToken(),
    Accept: "application/json",
  };
  return config;
});

export default instance;
