import React from "react";
import Auth from "./auth";
import {  useLocation } from "@remix-run/react";
import Main from "./main";

const Layout: React.FC = () => {
  const location = useLocation();

  if (location.pathname.includes("auth")) return <Auth />;

  // Add other layout conditions here if needed

  return <Main />;
};

export default Layout;
