import { Outlet } from "@remix-run/react";
import ResponsiveAppBar from "./Appbar";

const Main = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="absolute top-0 w-full">
        <ResponsiveAppBar />
      </div>
      <div className="flex flex-col pt-[68.5px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
