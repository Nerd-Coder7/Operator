export const isAuthenticated = () => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    return true;
  } else {
    return false;
  }
};
