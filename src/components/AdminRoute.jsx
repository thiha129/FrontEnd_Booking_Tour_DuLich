import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

const AdminRoute = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useLanguage();

  if (initializing) {
    return (
      <h4 className="loading-state text-center pt-5">{t("common.loading")}</h4>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
