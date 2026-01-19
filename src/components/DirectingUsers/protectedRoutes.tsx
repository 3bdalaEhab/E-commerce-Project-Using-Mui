import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getValidToken } from "../../utils/security";

interface ProtectedRoutesProps {
  children: ReactNode;
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const token = getValidToken();
  
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
