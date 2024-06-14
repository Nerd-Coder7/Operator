import axios from "axios";
import Store from "./redux/store";
import { LogoutUserT } from "./redux/actions/user";
// import Store from "./redux/store";
// import { LogoutUserT } from "./utils/Logout";

// Create an instance of axios
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URI}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use( 
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
    Store.dispatch(LogoutUserT());
    }
    return Promise.reject(err);
  }
);

export default api;