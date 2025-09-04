import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logout as logoutAction } from "../redux/slices/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Login function - now dispatches Redux action
  const login = async (userData, token) => {
    // If we already have the user and token (from direct API call),
    // we can dispatch the fulfilled action manually
    dispatch({
      type: "auth/login/fulfilled",
      payload: { user: userData, token },
    });
  };

  // Logout function - now dispatches Redux action
  const logout = () => {
    dispatch(logoutAction());
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
