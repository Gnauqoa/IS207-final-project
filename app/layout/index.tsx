import React from "react";
import Auth from "./auth";
import { Outlet, useLocation } from "@remix-run/react";

const Layout: React.FC = () => {
  const location = useLocation();

  if (location.pathname.includes("auth")) return <Auth />;

  // Add other layout conditions here if needed

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
