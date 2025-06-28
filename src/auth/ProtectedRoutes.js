import React from "react";
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  // console.log("token", tokenData)

  return (
    // modeValue != null ? (
      tokenData != null || tokenData !== undefined ? (
      <Outlet />
    ) : (
      <Navigate
        to={{
          pathname: "/",
        }}
      />))
};

export default ProtectedRoutes;
