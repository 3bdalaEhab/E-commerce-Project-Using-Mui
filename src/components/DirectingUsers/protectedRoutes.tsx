import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: ReactNode;
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  if (localStorage.getItem("userToken")) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
