import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  operators: [],
  error: null,
  successMessage: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Loading user
    LoadRequest(state) {
      state.loading = true;
    },
    LoadOperatorSuccess(state, action) {
      state.loading = false;
      state.operators = action.payload;
    },
    LoadFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearErrors(state) {
      state.error = null;
    },
  },
});

// Export actions
export const { LoadRequest, LoadOperatorSuccess, LoadFail } = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
