import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  addressloading: false,
  usersLoading: false,
  user: null,
  users: [],
  error: null,
  successMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Loading user
    LoadUserRequest(state) {
      state.loading = true;
    },
    LoadUserSuccess(state, action) {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    LoadUserFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    LogoutUser(state) {
      state.isAuthenticated = false;
      state.loading = false;
      state.addressloading = false;
      state.usersLoading = false;
      state.user = null;
      state.users = [];
      state.error = null;
      state.successMessage = "";
    },

    // Updating user information
    updateUserInfoRequest(state) {
      state.loading = true;
    },
    updateUserInfoSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserInfoFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateAllOnlineUsers(state,action){
      state.users=action.payload;
    },

    // Updating user address
    updateUserAddressRequest(state) {
      state.addressloading = true;
    },
    updateUserAddressSuccess(state, action) {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = { ...state.user, ...action.payload.user };
    },
    updateUserAddressFailed(state, action) {
      state.addressloading = false;
      state.error = action.payload;
    },

    // Deleting user address
    deleteUserAddressRequest(state) {
      state.addressloading = true;
    },
    deleteUserAddressSuccess(state, action) {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      // Assuming deletion means removing address from user, you might need to adjust based on your data structure
      if (state.user && state.user.address) {
        delete state.user.address; // Or whatever your logic for deleting the address
      }
    },
    deleteUserAddressFailed(state, action) {
      state.addressloading = false;
      state.error = action.payload;
    },

    // Admin - Get all users
    getAllUsersRequest(state) {
      state.usersLoading = true;
    },
    getAllUsersSuccess(state, action) {
      state.usersLoading = false;
      state.users = action.payload;
    },
    getAllUsersFailed(state, action) {
      state.usersLoading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearErrors(state) {
      state.error = null;
    },
  },
});

// Export actions
export const {
  LoadUserRequest,
  LoadUserSuccess,
  LoadUserFail,
  LogoutUser,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  updateUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
  clearErrors,
  updateAllOnlineUsers,
  update
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
