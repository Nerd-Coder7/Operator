import api from "../../api";
import { LoadFail, LoadOperatorSuccess, LoadRequest } from "../reducers/admin";

// load user
export const loadOperators = () => async (dispatch) => {
  try {
    dispatch(LoadRequest());
    const { data } = await api.get(`/user/admin/get-all-operators`);
    dispatch(LoadOperatorSuccess(data?.data));
  } catch (error) {
    console.log(error);
    dispatch(LoadFail(error.response.data.message));
  }
};

