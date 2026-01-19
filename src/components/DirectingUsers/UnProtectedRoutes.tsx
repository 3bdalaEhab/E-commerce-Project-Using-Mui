import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface UnProtectedRoutesProps {
  children: ReactNode;
}

export default function UnProtectedRoutes({ children }: UnProtectedRoutesProps) {
  if (localStorage.getItem("userToken")) {
    return <Navigate to="/" replace />;
  } else {
    return <>{children}</>;
  }
}
