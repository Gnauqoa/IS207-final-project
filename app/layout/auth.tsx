import { Outlet } from "@remix-run/react";

const Auth = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <Outlet />
    </div>
  );
};

export default Auth;
