import { Outlet } from "@remix-run/react";
import ResponsiveAppBar from "./Appbar";

const Main = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <ResponsiveAppBar />
      <Outlet />
    </div>
  );
};

export default Main;
