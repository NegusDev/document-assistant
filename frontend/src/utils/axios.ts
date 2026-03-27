import config from "@/utils/config";
import axios from "axios"

// FOR SESSION BASED AUTHENTICATION

const axiosClient = axios.create({
  baseURL: config.backendURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(error);
    }
    throw new Error(error);
  },
);

export default axiosClient;