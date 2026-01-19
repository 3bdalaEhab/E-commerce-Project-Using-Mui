import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getValidToken } from "../../utils/security";

interface UnProtectedRoutesProps {
  children: ReactNode;
}

export default function UnProtectedRoutes({ children }: UnProtectedRoutesProps) {
  const token = getValidToken();
  
  if (token) {
    return <Navigate to="/" replace />;
  } else {
    return <>{children}</>;
  }
}
