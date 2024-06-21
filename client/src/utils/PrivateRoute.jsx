import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Authenticated";
const PrivateRoute = ({ children }) => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const isAuthenticatedd = isAuthenticated();
  // const logout = async () => {
  //   try {
  //     const { data } = await api.post("/user/logout");

  //     if (data.success) {
  //       console.log("Logged out successfully:", data.message);
  //      await dispatch(LogoutUser())
  //       navigate("/signin");
  //     } else {
  //       console.error("Logout failed:", data.message); 
  //     }
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //   }
  // };
  // useAutoLogout(logout);

  if (loading) {
    return "loading...";
  }

  // console.log(isAuthenticatedd,loading)
  if (!isAuthenticatedd) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
