import axios from "axios";
import { SECRET_USERINFO_KEY } from "../utility/constants";

const port = "8080";
const domain = "http://localhost";
let baseURL = null;

baseURL = `${domain}:${port}`;

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const data = localStorage.getItem(SECRET_USERINFO_KEY);

  const parsedData = data ? JSON.parse(data) : null;
  const jwt = parsedData ? parsedData.token : data;
  // console.log("ACCESS_TOKEN: ", `Bearer: ${jwt}`);
  // const language = "en";
  config.headers["content-type"] = "application/json";
  if (jwt) {
    config.headers["access-token"] = `Bearer: ${jwt}`;
  }
  // config.headers["content-language"] = language ? language : "en";
  return config;
});

apiClient.interceptors.response.use(
  function (response) {
    //console.log('RESPONSE: ', response.config.url, response.data);
    return response;
  },
  function (error) {
    console.log("ERROR", error);
    if (
      error?.response?.data?.statusCode === 401 ||
      error?.response?.status === 401
    ) {
      handleLogout();
    } else {
      if (error?.response?.data?.message || error?.data?.message) {
        console.log(
          "Api error",
          error?.response?.data?.message || error?.data?.message
        );
      } else {
      }
    }

    return Promise.reject(error.response);
  }
);

const handleLogout = () => {
  localStorage.removeItem(SECRET_USERINFO_KEY);
  window.location.reload();
};

export { apiClient as default, domain, port };
