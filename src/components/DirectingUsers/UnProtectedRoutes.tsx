import React from "react";
import { Navigate } from "react-router-dom";

export default function UnProtectedRoutes(props: any) {
  if (localStorage.getItem("userToken")) {
    return <Navigate to="/" />;
  } else {
    return props.children;
  }
}
