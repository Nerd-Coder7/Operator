import axios from "axios";
import api from "../../api";
import {
  LoadUserFail,
  LoadUserRequest,
  LoadUserSuccess,
  updateAllOnlineUsers,
  updateUserInfoFailed,
  updateUserInfoRequest,
  updateUserInfoSuccess,
} from "../reducers/user";
// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(LoadUserRequest());
    const { data } = await axios.get(`${process.env.REACT_APP_API_URI}/api/v1/user/getuser`,{withCredentials: true});

    console.log(data, "DATA GOT BY USER");
    dispatch(LoadUserSuccess(data?.user));
  } catch (error) {
    console.log(error);
    dispatch(LoadUserFail(error.response.data.message));
  }
};

// User update information
export const updateUserInformation = (form) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateUserInfoRequest());

      const { data } = await api.put(`/user/recruiter/update`, { ...form });

      dispatch(updateUserInfoSuccess(data.data));
      resolve(data.user);
    } catch (error) {
      dispatch(updateUserInfoFailed());
      reject(error);
    }
  });
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await api.get(`/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};

export const LogoutUserT = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    sessionStorage.removeItem("authToken");
    await api.post(`/user/logout`, {
      withCredentials: true,
    });

    dispatch({
      type: "LogoutUser",
    });
    window.location.replace("/login")
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

export const updateOnlineUsers = (data) => async (dispatch) => {
  dispatch(updateAllOnlineUsers(data));
};
